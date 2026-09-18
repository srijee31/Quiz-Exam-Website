import { describe, expect, it } from "vitest";
import { calculateQuizMetrics, fillQuestionPool } from "./vaoLogic";

describe("VAO quiz logic", () => {
  it("calculates score and rounded accuracy from selected answers", () => {
    expect(calculateQuizMetrics([
      { selectedOption: "A", correctOption: "A" },
      { selectedOption: "B", correctOption: "C" },
      { selectedOption: null, correctOption: "D" },
    ])).toEqual({ score: 1, accuracy: 33 });
  });

  it("fills every supported quiz length from a smaller active bank without an empty result", () => {
    const pool = ["q1", "q2", "q3"];
    for (const size of [25, 50, 75, 100]) {
      expect(fillQuestionPool(pool, size, () => 0.5)).toHaveLength(size);
    }
  });
});
