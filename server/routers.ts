import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createAttempt,
  createQuestionSet,
  createQuestions,
  getAttempt,
  listActiveQuestions,
  listAttempts,
  listQuestions,
  submitAttempt,
} from "./db";
import { isValidAdminCredential } from "./vaoAuth";
import { calculateQuizMetrics, fillQuestionPool } from "./vaoLogic";
import { storagePut } from "./storage";

const optionSchema = z.enum(["A", "B", "C", "D"]);
const sizeSchema = z.union([z.literal(25), z.literal(50), z.literal(75), z.literal(100)]);
const questionInput = z.object({
  subject: z.string().min(2).max(80),
  prompt: z.string().min(10),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  correctOption: optionSchema,
  explanation: z.string().min(10),
  sourcePage: z.number().optional(),
});

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function requireAdmin(id: string, password: string) {
  if (!isValidAdminCredential(id, password)) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid admin credentials" });
  }
}

function parsePastedQuestions(text: string) {
  const blocks = text.split(/\n\s*\n/).map((block) => block.trim()).filter(Boolean);
  return blocks.flatMap((block) => {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const prompt = lines.find((line) => /^q\d*[:.)]/i.test(line))?.replace(/^q\d*[:.)]\s*/i, "") ?? lines[0];
    const optionLines = lines.filter((line) => /^[ABCD][.)]\s+/i.test(line));
    const options = optionLines.map((line) => line.replace(/^[ABCD][.)]\s+/i, ""));
    const answerLine = lines.find((line) => /^(answer|ans|correct)[:.)]?/i.test(line));
    const explanationLine = lines.find((line) => /^explanation[:.)]?/i.test(line));
    const correct = answerLine?.match(/[ABCD]/i)?.[0]?.toUpperCase() as "A" | "B" | "C" | "D" | undefined;
    if (!prompt || options.length < 4 || !correct) return [];
    return [{
      subject: "General Knowledge",
      prompt,
      optionA: options[0], optionB: options[1], optionC: options[2], optionD: options[3],
      correctOption: correct,
      explanation: explanationLine?.replace(/^explanation[:.)]?\s*/i, "") ?? "Review the source material and confirm the reasoning behind this answer.",
    }];
  });
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  candidate: router({
    pool: publicProcedure.query(async () => listActiveQuestions()),
    start: publicProcedure.input(z.object({
      candidateName: z.string().min(2).max(160),
      candidateEmail: z.string().email(),
      quizSize: sizeSchema,
    })).mutation(async ({ input }) => {
      const pool = await listActiveQuestions();
      if (!pool.length) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "No active questions are available." });
      const selected = fillQuestionPool(shuffle(pool), input.quizSize);
      const id = await createAttempt({
        candidateName: input.candidateName,
        candidateEmail: input.candidateEmail,
        quizSize: input.quizSize,
        questionSnapshot: JSON.stringify(selected),
        status: "in_progress",
      });
      return { id, questions: selected };
    }),
    submit: publicProcedure.input(z.object({
      attemptId: z.number(),
      timeTakenSeconds: z.number().int().nonnegative(),
      status: z.enum(["submitted", "timed_out"]),
      answers: z.array(z.object({ questionId: z.number(), questionIndex: z.number(), selectedOption: optionSchema.nullable(), correctOption: optionSchema, isFlagged: z.boolean() })),
    })).mutation(async ({ input }) => {
      const { score, accuracy } = calculateQuizMetrics(input.answers);
      await submitAttempt(input.attemptId, score, accuracy, input.timeTakenSeconds, input.status, input.answers.map((answer) => ({
        questionId: answer.questionId,
        questionIndex: answer.questionIndex,
        selectedOption: answer.selectedOption,
        correctOption: answer.correctOption,
        isCorrect: answer.selectedOption === answer.correctOption ? 1 : 0,
        isFlagged: answer.isFlagged ? 1 : 0,
      })));
      return { score, accuracy };
    }),
    result: publicProcedure.input(z.object({ attemptId: z.number() })).query(({ input }) => getAttempt(input.attemptId)),
  }),
  admin: router({
    login: publicProcedure.input(z.object({ id: z.string(), password: z.string() })).mutation(({ input }) => {
      requireAdmin(input.id, input.password);
      return { success: true, displayName: "VAO Administrator" };
    }),
    questionBank: publicProcedure.input(z.object({ id: z.string(), password: z.string(), search: z.string().optional(), subject: z.string().optional() })).query(async ({ input }) => {
      requireAdmin(input.id, input.password);
      return listQuestions(input.search, input.subject);
    }),
    attempts: publicProcedure.input(z.object({ id: z.string(), password: z.string() })).query(async ({ input }) => {
      requireAdmin(input.id, input.password);
      return listAttempts();
    }),
    attemptDetail: publicProcedure.input(z.object({ id: z.string(), password: z.string(), attemptId: z.number() })).query(async ({ input }) => {
      requireAdmin(input.id, input.password);
      return getAttempt(input.attemptId);
    }),
    ingestText: publicProcedure.input(z.object({ id: z.string(), password: z.string(), title: z.string().min(3), text: z.string().min(20), sourceType: z.enum(["pdf", "paste"]) })).mutation(async ({ input }) => {
      requireAdmin(input.id, input.password);
      const parsed = parsePastedQuestions(input.text);
      if (!parsed.length) throw new TRPCError({ code: "BAD_REQUEST", message: "No complete MCQ blocks were detected. Use Q:, A:, B:, C:, D:, Answer: and Explanation: lines." });
      const setId = await createQuestionSet({ title: input.title, sourceType: input.sourceType, extractionStatus: "ready", questionCount: parsed.length });
      if (setId) await createQuestions(parsed.map((question) => ({ ...question, setId })));
      return { count: parsed.length };
    }),
    uploadPdf: publicProcedure.input(z.object({ id: z.string(), password: z.string(), title: z.string().min(3), fileName: z.string().min(1).max(255), contentType: z.string().min(3), dataBase64: z.string().min(20).max(8_000_000) })).mutation(async ({ input }) => {
      requireAdmin(input.id, input.password);
      const fileBuffer = Buffer.from(input.dataBase64, "base64");
      const stored = await storagePut(`vao-question-sets/${input.fileName}`, fileBuffer, input.contentType);
      const setId = await createQuestionSet({ title: input.title, fileName: input.fileName, fileUrl: stored.url, fileKey: stored.key, sourceType: "pdf", extractionStatus: "review", questionCount: 0 });
      return { setId, fileName: input.fileName, fileUrl: stored.url, fileKey: stored.key, extractionStatus: "review" as const };
    }),
  }),
  owner: router({
    health: protectedProcedure.query(() => ({ ok: true })),
  }),
});

export type AppRouter = typeof appRouter;
