import { createQuestionSet, createQuestions, getDb } from "./db";
import { sampleQuestions } from "../client/src/data/questions";
import { questionSets } from "../drizzle/schema";

async function seed() {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_URL is not configured");
  const existing = await db.select().from(questionSets);
  const hasSample = existing.some((set) => set.title === "Karnataka VAO Sample Set");
  const sourcedSet = existing.find((set) => set.title === "Karnataka VAO Sourced Expansion 2021-2026");
  if (!hasSample) {
    const setId = await createQuestionSet({
      title: "Karnataka VAO Sample Set",
      sourceType: "sample",
      extractionStatus: "ready",
      questionCount: 30,
    });
    if (!setId) throw new Error("Could not create sample question set");
    await createQuestions(sampleQuestions.filter((question) => question.id < 1000).map((question) => ({
      setId,
      subject: question.subject,
      prompt: question.prompt,
      optionA: question.options.A,
      optionB: question.options.B,
      optionC: question.options.C,
      optionD: question.options.D,
      correctOption: question.answer,
      explanation: question.explanation,
      sourcePage: question.page,
      isActive: 1,
    })));
    console.log("Seeded the original Karnataka VAO sample set.");
  }
  if (sourcedSet && sourcedSet.questionCount > 0) {
    console.log("Sourced Karnataka VAO expansion already exists; skipping expansion.");
    return;
  }
  const setId = sourcedSet?.id ?? await createQuestionSet({
      title: "Karnataka VAO Sourced Expansion 2021-2026",
      sourceType: "sample",
      extractionStatus: "ready",
      questionCount: sampleQuestions.filter((question) => question.id >= 1000).length,
    });
  if (!setId) throw new Error("Could not create sourced expansion question set");
  await createQuestions(sampleQuestions.filter((question) => question.id >= 1000).map((question) => ({
    setId,
    subject: question.subject,
    prompt: question.prompt,
    optionA: question.options.A,
    optionB: question.options.B,
    optionC: question.options.C,
    optionD: question.options.D,
    correctOption: question.answer,
    explanation: question.explanation,
    sourcePage: question.page,
    isActive: 1,
  })));
  console.log(`Seeded ${sampleQuestions.filter((question) => question.id >= 1000).length} sourced Karnataka VAO questions.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
