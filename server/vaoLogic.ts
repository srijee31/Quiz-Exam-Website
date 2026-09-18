export type AnswerCheck = { selectedOption: string | null; correctOption: string };

export function calculateQuizMetrics(answers: AnswerCheck[]) {
  const score = answers.filter((answer) => answer.selectedOption === answer.correctOption).length;
  const accuracy = answers.length ? Math.round((score / answers.length) * 100) : 0;
  return { score, accuracy };
}

export function fillQuestionPool<T>(pool: T[], size: number, random = Math.random) {
  if (!pool.length || size <= 0) return [];
  const result: T[] = [];
  while (result.length < size) {
    const shuffled = [...pool].sort(() => random() - 0.5);
    result.push(...shuffled.slice(0, Math.min(shuffled.length, size - result.length)));
  }
  return result;
}
