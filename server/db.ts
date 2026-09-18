import { and, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  AttemptAnswer,
  InsertUser,
  attemptAnswers,
  questions,
  questionSets,
  quizAttempts,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  } else {
    values.lastSignedIn = new Date();
    updateSet.lastSignedIn = new Date();
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listQuestions(search?: string, subject?: string) {
  const db = await getDb();
  if (!db) return [];
  const filters = [];
  if (subject && subject !== "all") filters.push(eq(questions.subject, subject));
  if (search) {
    filters.push(or(like(questions.prompt, `%${search}%`), like(questions.explanation, `%${search}%`)));
  }
  return db.select().from(questions).where(filters.length ? and(...filters) : undefined).orderBy(desc(questions.createdAt));
}

export async function listActiveQuestions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(questions).where(eq(questions.isActive, 1)).orderBy(desc(questions.id));
}

export async function listAttempts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizAttempts).orderBy(desc(quizAttempts.startedAt));
}

export async function getAttempt(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const [attempt] = await db.select().from(quizAttempts).where(eq(quizAttempts.id, id)).limit(1);
  if (!attempt) return undefined;
  const answers = await db.select().from(attemptAnswers).where(eq(attemptAnswers.attemptId, id)).orderBy(attemptAnswers.questionIndex);
  return { attempt, answers };
}

export async function createQuestionSet(input: {
  title: string;
  fileName?: string;
  fileUrl?: string;
  fileKey?: string;
  sourceType: "pdf" | "paste" | "sample";
  extractionStatus?: "ready" | "review" | "failed";
  questionCount: number;
}) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(questionSets).values(input);
  return Number(result[0].insertId);
}

export async function createQuestions(rows: Array<typeof questions.$inferInsert>) {
  const db = await getDb();
  if (!db || !rows.length) return;
  await db.insert(questions).values(rows);
}

export async function createAttempt(input: typeof quizAttempts.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(quizAttempts).values(input);
  return Number(result[0].insertId);
}

export async function submitAttempt(
  id: number,
  score: number,
  accuracy: number,
  timeTakenSeconds: number,
  status: "submitted" | "timed_out",
  answers: Array<Omit<AttemptAnswer, "id" | "attemptId">>,
) {
  const db = await getDb();
  if (!db) return;
  await db.update(quizAttempts).set({ score, accuracy, timeTakenSeconds, status, submittedAt: new Date() }).where(eq(quizAttempts.id, id));
  if (answers.length) await db.insert(attemptAnswers).values(answers.map((answer) => ({ ...answer, attemptId: id })));
}
