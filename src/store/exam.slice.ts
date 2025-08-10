// src/store/exam.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Step = 1 | 2 | 3;

export type ExamAnswer = {
  questionId: string;
  selectedIndex: number;
  elapsedMs: number; // time user spent on that question
};

export type ExamStatus = "idle" | "active" | "submitted" | "cancelled";

export type ExamState = {
  sessionId: string | null;
  step: Step | null;
  deadlineAt: string | null;
  status: ExamStatus;

  questionIds: string[]; // ordered for this attempt
  currentIndex: number; // 0-based
  answers: Record<string, ExamAnswer>;

  startedAt: number | null; // epoch ms
  currentShownAt: number | null; // epoch ms (for elapsedMs per question)
};

const initialState: ExamState = {
  sessionId: null,
  step: null,
  deadlineAt: null,
  status: "idle",
  questionIds: [],
  currentIndex: 0,
  answers: {},
  startedAt: null,
  currentShownAt: null,
};

const slice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    begin(
      state,
      action: PayloadAction<{
        sessionId: string;
        step: Step;
        deadlineAt: string;
        questionIds: string[];
      }>,
    ) {
      const { sessionId, step, deadlineAt, questionIds } = action.payload;
      state.sessionId = sessionId;
      state.step = step;
      state.deadlineAt = deadlineAt;
      state.status = "active";
      state.questionIds = questionIds;
      state.currentIndex = 0;
      state.answers = {};
      state.startedAt = Date.now();
      state.currentShownAt = Date.now();
    },
    recordAnswer(
      state,
      action: PayloadAction<{ questionId: string; selectedIndex: number }>,
    ) {
      const { questionId, selectedIndex } = action.payload;
      const now = Date.now();
      const elapsedMs = Math.max(
        0,
        (state.currentShownAt ?? now) ? now - (state.currentShownAt ?? now) : 0,
      );
      state.answers[questionId] = { questionId, selectedIndex, elapsedMs };
    },
    goNext(state) {
      if (state.currentIndex < state.questionIds.length - 1) {
        state.currentIndex += 1;
        state.currentShownAt = Date.now();
      }
    },
    goPrev(state) {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentShownAt = Date.now();
      }
    },
    setSubmitted(state) {
      state.status = "submitted";
    },
    reset() {
      return initialState;
    },
    setIndex(state, action: PayloadAction<number>) {
      const i = action.payload;
      if (i >= 0 && i < state.questionIds.length) {
        state.currentIndex = i;
        state.currentShownAt = Date.now();
      }
    },
  },
});

export const {
  begin,
  recordAnswer,
  goNext,
  goPrev,
  setSubmitted,
  reset,
  setIndex,
} = slice.actions;
export default slice.reducer;
