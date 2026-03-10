"use client";
import { createContext, Dispatch, use, useReducer } from "react";

type TestState = {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  difficulty: "easy" | "medium" | "hard";
  status: "idle" | "running" | "completed";
  score_status: "first-run" | "new-best" | "normal-run";
  mistakes: number;
  mode: "timed" | "passage";
  personalBest: number;
};

type TestAction =
  | { type: "START_TEST" }
  | { type: "FINISH_TEST"; payload: { wpm: number; accuracy: number } }
  | { type: "SET_DIFFICULTY"; payload: TestState["difficulty"] }
  | { type: "SET_MODE"; payload: TestState["mode"] }
  | { type: "TICK" }
  | { type: "ADD_MISTAKE" }
  | { type: "RESET" };

export type TestContextType = {
  state: TestState;
  dispatch: Dispatch<TestAction>;
};

const initialState: TestState = {
  wpm: 0,
  accuracy: 100,
  timeLeft: 60,
  difficulty: "easy",
  status: "idle",
  mistakes: 0,
  mode: "timed",
  score_status: "first-run",
  personalBest: 0,
};

const TestContext = createContext<TestContextType | null>(null);

const testReducer = (state: TestState, action: TestAction): TestState => {
  switch (action.type) {
    case "START_TEST":
      return { ...state, status: "running" };

    case "TICK":
      return { ...state, timeLeft: state.timeLeft - 1 };

    case "ADD_MISTAKE":
      return { ...state, mistakes: state.mistakes + 1 };

    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.payload };

    case "SET_MODE":
      return { ...state, mode: action.payload };

    case "FINISH_TEST":
      return {
        ...state,
        status: "completed",
        wpm: action.payload.wpm,
        accuracy: action.payload.accuracy,
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(testReducer, initialState);

  return <TestContext value={{ state, dispatch }}>{children}</TestContext>;
};

export const useTestProvider = () => {
  const context = use(TestContext);
  if (!context) {
    throw new Error("UseTestProvider can only be used within a TestProvider");
  }

  return context;
};
