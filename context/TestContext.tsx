"use client";
import data from "@/utils/data.json";
import {
  createContext,
  Dispatch,
  use,
  useEffect,
  useReducer,
  useState,
} from "react";

type TestState = {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  difficulty: "easy" | "medium" | "hard";
  status: "idle" | "running" | "ready" | "completed";
  score_status: "first-run" | "new-best" | "normal-run";
  mistakes: number;
  currentMistakes: number;
  mode: "timed" | "passage";
  personalBest: number;
  currentPassage: string;
  currentIndex: number;
  input: string;
};

type TestAction =
  | { type: "START_TEST" }
  | { type: "FINISH_TEST" }
  | { type: "SET_DIFFICULTY"; payload: TestState["difficulty"] }
  | { type: "SET_MODE"; payload: TestState["mode"] }
  | { type: "TICK_DOWN" }
  | { type: "TICK_UP" }
  | { type: "ADD_MISTAKE" }
  | { type: "PREPARE_TEST" }
  | { type: "UPDATE_ACCURACY" }
  | { type: "UPDATE_WPM" }
  | { type: "GENERATE_PASSAGE" }
  | { type: "BACKSPACE" }
  | { type: "SET_INPUT"; payload: string }
  | { type: "RESET" };

export type TestContextType = {
  state: TestState;
  dispatch: Dispatch<TestAction>;
};

const passages = {
  easy: [...data.easy],
  medium: [...data.medium],
  hard: [...data.hard],
};

const initialState: TestState = {
  wpm: 0,
  accuracy: 100,
  timeLeft: 60,
  difficulty: "easy",
  status: "idle",
  mistakes: 0,
  currentMistakes: 0,
  mode: "timed",
  score_status: "first-run",
  personalBest: 0,
  currentPassage: "",
  currentIndex: 0,
  input: "",
};

const TestContext = createContext<TestContextType | null>(null);

function getRandomPassage(difficulty: "easy" | "medium" | "hard") {
  const list = passages[difficulty];
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex].text;
}

const testReducer = (state: TestState, action: TestAction): TestState => {
  switch (action.type) {
    case "PREPARE_TEST":
      return { ...state, status: "ready" };

    case "START_TEST":
      return { ...state, status: "running" };

    case "TICK_DOWN":
      if (state.timeLeft <= 1) {
        return { ...state, timeLeft: 0, status: "completed" };
      }
      return { ...state, timeLeft: state.timeLeft - 1 };
    case "TICK_UP":
      return { ...state, timeLeft: state.timeLeft + 1 };

    case "ADD_MISTAKE":
      return {
        ...state,
        mistakes: state.mistakes + 1,
        currentMistakes: state.currentMistakes + 1,
      };

    case "UPDATE_ACCURACY":
      const acc =
        ((state.currentPassage.length - state.mistakes) /
          state.currentPassage.length) *
        100;

      return {
        ...state,
        accuracy: Math.round(acc * 10) / 10,
      };

    case "UPDATE_WPM": {
      const elapsedSeconds =
        state.mode === "timed" ? 60 - state.timeLeft : state.timeLeft;

      if (elapsedSeconds <= 0) return state;

      const elapsedMinutes = elapsedSeconds / 60;

      const correctCharacters = state.currentIndex - state.currentMistakes;

      const wpm = Math.round(correctCharacters / 5 / elapsedMinutes);

      return {
        ...state,
        wpm,
      };
    }
    case "SET_DIFFICULTY":
      return {
        ...initialState,
        difficulty: action.payload,
        currentPassage: getRandomPassage(action.payload),
        personalBest: state.personalBest,
        mode: state.mode,
        score_status: state.score_status,
      };

    case "SET_MODE":
      let time = 60;
      if (action.payload == "timed") {
        time = 60;
      } else {
        time = 0;
      }

      return {
        ...initialState,
        difficulty: state.difficulty,
        currentPassage: getRandomPassage(state.difficulty),
        personalBest: state.personalBest,
        mode: action.payload,
        score_status: state.score_status,
        timeLeft: time,
      };

    case "SET_INPUT":
      if (state.input.length >= state.currentPassage.length) return state;
      return {
        ...state,
        input: action.payload,
        currentIndex: state.currentIndex + 1,
      };

    case "FINISH_TEST":
      if (state.score_status === "first-run") {
        return {
          ...state,
          personalBest: state.wpm,
          status: "completed",
        };
      }

      if (state.wpm > state.personalBest) {
        return {
          ...state,
          personalBest: state.wpm,
          status: "completed",
          score_status: "new-best",
        };
      }

      return {
        ...state,
        status: "completed",
        score_status: "normal-run",
      };

    case "RESET":
      return {
        ...initialState,
        difficulty: state.difficulty,
        currentPassage: getRandomPassage(state.difficulty),
        personalBest: state.personalBest,
        timeLeft: state.mode == "timed" ? 60 : 0,
        mode: state.mode,
        score_status: state.personalBest === 0 ? "first-run" : "normal-run",
      };
    case "BACKSPACE":
      if (state.input.length === 0) return state;

      let newMistakes = state.currentMistakes;

      if (
        state.currentPassage[state.currentIndex - 1] !==
        state.input[state.input.length - 1]
      ) {
        newMistakes--;
      }

      return {
        ...state,
        input: state.input.slice(0, -1),
        currentIndex: state.currentIndex - 1,
        currentMistakes: newMistakes,
      };

    case "GENERATE_PASSAGE":
      return {
        ...state,
        currentPassage: getRandomPassage(state.difficulty),
      };
    default:
      return state;
  }
};

const init = (initial: TestState): TestState => {
  if (typeof window === "undefined") return initial;

  const saved = localStorage.getItem("typing-settings");

  if (!saved) return initial;

  const settings = JSON.parse(saved);

  return {
    ...initial,
    personalBest: settings.personalBest,
    difficulty: settings.difficulty,
    mode: settings.mode,
    timeLeft: settings.mode === "timed" ? 60 : 0,
  };
};

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(testReducer, initialState, init);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "typing-settings",
      JSON.stringify({
        personalBest: state.personalBest,
        difficulty: state.difficulty,
        mode: state.mode,
      }),
    );
  }, [state.personalBest, state.difficulty, state.mode]);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <TestContext value={{ state, dispatch }}>{children}</TestContext>;
};

export const useTestProvider = () => {
  const context = use(TestContext);
  if (!context) {
    throw new Error("UseTestProvider can only be used within a TestProvider");
  }

  return context;
};
