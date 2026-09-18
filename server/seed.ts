import { createQuestionSet, createQuestions, getDb } from "./db";
import { sampleQuestions } from "../client/src/data/questions";
import { questionSets } from "../drizzle/schema";

async function seed() {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_URL is not configured");
  const existing = await db.select().from(questionSets).limit(1);
  if (existing.length) {
    console.log("Sample question set already exists; skipping seed.");
    return;
  }
  const setId = await createQuestionSet({
    title: "Karnataka VAO Sample Set",
    sourceType: "sample",
    extractionStatus: "ready",
    questionCount: sampleQuestions.length,
  });
  if (!setId) throw new Error("Could not create sample question set");
  await createQuestions(sampleQuestions.map((question) => ({
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
  console.log(`Seeded ${sampleQuestions.length} Karnataka VAO questions.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
