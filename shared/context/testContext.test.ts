import {
  initialState,
  testReducer,
  calculateAccuracy,
  type TestState,
} from "./TestContext";

describe("typing test reducer", () => {
  it("starts the test", () => {
    const state = testReducer(initialState, { type: "START_TEST" });

    expect(state.status).toBe("running");
  });

  it("prepares the test", () => {
    const state = testReducer(initialState, { type: "PREPARE_TEST" });

    expect(state.status).toBe("ready");
  });

  it("ticks down time in timed mode", () => {
    const state = testReducer(
      { ...initialState, timeLeft: 60 },
      { type: "TICK_DOWN" },
    );

    expect(state.timeLeft).toBe(59);
  });

  it("completes the test when time reaches zero", () => {
    const state = testReducer(
      { ...initialState, timeLeft: 1, status: "running" },
      { type: "TICK_DOWN" },
    );

    expect(state.timeLeft).toBe(0);
    expect(state.status).toBe("completed");
  });

  it("increments time in passage mode", () => {
    const state = testReducer(
      { ...initialState, mode: "passage", timeLeft: 0 },
      { type: "TICK_UP" },
    );

    expect(state.timeLeft).toBe(1);
  });

  it("adds a mistake", () => {
    const state = testReducer(initialState, { type: "ADD_MISTAKE" });

    expect(state.mistakes).toBe(1);
    expect(state.currentMistakes).toBe(1);
  });

  it("adds a mistake then user corrects it", () => {
    const state = testReducer({...initialState, currentIndex: 2, currentPassage: "Cat", input: "Cs"}, { type: "ADD_MISTAKE" });
    const nextState = testReducer(state, {type: "BACKSPACE" })

    expect(nextState.mistakes).toBe(1);
    expect(nextState.currentMistakes).toBe(0);
  });

  it("sets input and increments current index", () => {
    const state = testReducer(
      { ...initialState, currentPassage: "hello" },
      { type: "SET_INPUT", payload: "h" },
    );

    expect(state.input).toBe("h");
    expect(state.currentIndex).toBe(1);
  });

  it("does not type past the passage length", () => {
    const state = testReducer(
      {
        ...initialState,
        currentPassage: "h",
        input: "h",
        currentIndex: 1,
      },
      { type: "SET_INPUT", payload: "he" },
    );

    expect(state.input).toBe("h");
    expect(state.currentIndex).toBe(1);
  });

  it("handles backspace", () => {
    const state = testReducer(
      {
        ...initialState,
        currentPassage: "hello",
        input: "he",
        currentIndex: 2,
      },
      { type: "BACKSPACE" },
    );

    expect(state.input).toBe("h");
    expect(state.currentIndex).toBe(1);
  });
});

describe("calculateAccuracy", () => {
  it("returns 100 when nothing is typed", () => {
    expect(calculateAccuracy(initialState)).toBe(100);
  });

  it("calculates accuracy with mistakes", () => {
    const state: TestState = {
      ...initialState,
      currentIndex: 10,
      mistakes: 2,
    };

    expect(calculateAccuracy(state)).toBe(80);
  });

  it("does not go below zero", () => {
    const state: TestState = {
      ...initialState,
      currentIndex: 5,
      mistakes: 10,
    };

    expect(calculateAccuracy(state)).toBe(0);
  });
});

describe("WPM calculation", () => {
  it("calculates WPM in timed mode", () => {
    const state = testReducer(
      {
        ...initialState,
        mode: "timed",
        timeLeft: 30,
        currentIndex: 50,
        currentMistakes: 0,
      },
      { type: "UPDATE_WPM" },
    );

    // 50 chars / 5 = 10 words
    // 30 seconds = 0.5 minutes
    // 10 / 0.5 = 20 WPM
    expect(state.wpm).toBe(20);
  });

  it("does not update WPM when elapsed time is zero", () => {
    const state = testReducer(
      {
        ...initialState,
        mode: "timed",
        timeLeft: 60,
        currentIndex: 50,
      },
      { type: "UPDATE_WPM" },
    );

    expect(state.wpm).toBe(0);
  });
});