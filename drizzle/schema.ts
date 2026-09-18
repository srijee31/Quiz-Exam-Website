import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const questionSets = mysqlTable("question_sets", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 240 }).notNull(),
  fileName: varchar("fileName", { length: 255 }),
  fileUrl: text("fileUrl"),
  fileKey: text("fileKey"),
  sourceType: mysqlEnum("sourceType", ["pdf", "paste", "sample"]).default("sample").notNull(),
  extractionStatus: mysqlEnum("extractionStatus", ["ready", "review", "failed"]).default("ready").notNull(),
  questionCount: int("questionCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const questions = mysqlTable("questions", {
  id: int("id").autoincrement().primaryKey(),
  setId: int("setId").notNull(),
  subject: varchar("subject", { length: 80 }).notNull(),
  prompt: text("prompt").notNull(),
  optionA: text("optionA").notNull(),
  optionB: text("optionB").notNull(),
  optionC: text("optionC").notNull(),
  optionD: text("optionD").notNull(),
  correctOption: mysqlEnum("correctOption", ["A", "B", "C", "D"]).notNull(),
  explanation: text("explanation").notNull(),
  sourcePage: int("sourcePage"),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  candidateName: varchar("candidateName", { length: 160 }).notNull(),
  candidateEmail: varchar("candidateEmail", { length: 320 }).notNull(),
  quizSize: int("quizSize").notNull(),
  score: int("score").default(0).notNull(),
  accuracy: int("accuracy").default(0).notNull(),
  timeTakenSeconds: int("timeTakenSeconds").default(0).notNull(),
  status: mysqlEnum("status", ["in_progress", "submitted", "timed_out"]).default("in_progress").notNull(),
  questionSnapshot: text("questionSnapshot").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  submittedAt: timestamp("submittedAt"),
});

export const attemptAnswers = mysqlTable("attempt_answers", {
  id: int("id").autoincrement().primaryKey(),
  attemptId: int("attemptId").notNull(),
  questionId: int("questionId").notNull(),
  questionIndex: int("questionIndex").notNull(),
  selectedOption: varchar("selectedOption", { length: 1 }),
  correctOption: varchar("correctOption", { length: 1 }).notNull(),
  isCorrect: int("isCorrect").default(0).notNull(),
  isFlagged: int("isFlagged").default(0).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type QuestionSet = typeof questionSets.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type AttemptAnswer = typeof attemptAnswers.$inferSelect;
