import { useTestProvider } from "@/context/TestContext";
import { Button } from "../../ui/button/button";
import { Separator } from "../../ui/seperator/seperator";
import styles from "./utility.module.css";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export const Utility = () => {
  const { state, dispatch } = useTestProvider();
  const { difficulty, mode } = state;
  return (
    <div className={styles.utility}>
      <div className={styles.top}>
        <div className={styles.data}>
          <div>
            WPM: <span>{state.wpm}</span>
          </div>
          <Separator orientation="vertical" />
          <div>
            Accuracy:{" "}
            <span
              style={
                state.status == "ready" || state.status == "idle"
                  ? { color: "white" }
                  : state.accuracy >= 80
                    ? { color: "hsl(140, 63%, 57%)" }
                    : state.accuracy >= 50
                      ? { color: "hsl(49, 85%, 70%)" }
                      : { color: "hsl(354, 63%, 57%)" }
              }
            >
              {state.accuracy}%
            </span>
          </div>
          <Separator orientation="vertical" />
          <div>
            Time:
            <span
              style={
                state.status == "running" ? { color: "hsl(49, 85%, 70%)" } : {}
              }
            >
              {formatTime(state.timeLeft)}
            </span>
          </div>
        </div>
        <div className={styles.settings}>
          <div className={styles.difficulty}>
            <div>Difficulty:</div>
            <Button
              className={
                difficulty == "easy"
                  ? styles.button + " " + styles.selected
                  : styles.button
              }
              onClick={() =>
                dispatch({ type: "SET_DIFFICULTY", payload: "easy" })
              }
            >
              Easy
            </Button>
            <Button
              className={
                difficulty == "medium"
                  ? styles.button + " " + styles.selected
                  : styles.button
              }
              onClick={() =>
                dispatch({ type: "SET_DIFFICULTY", payload: "medium" })
              }
            >
              Medium
            </Button>
            <Button
              className={
                difficulty == "hard"
                  ? styles.button + " " + styles.selected
                  : styles.button
              }
              onClick={() =>
                dispatch({ type: "SET_DIFFICULTY", payload: "hard" })
              }
            >
              Hard
            </Button>
          </div>
          <Separator orientation="vertical" />
          <div className={styles.mode}>
            <div>Mode:</div>
            <Button
              className={
                mode == "timed"
                  ? styles.button + " " + styles.selected
                  : styles.button
              }
              onClick={() => dispatch({ type: "SET_MODE", payload: "timed" })}
            >
              Timed (60s)
            </Button>
            <Button
              className={
                mode == "passage"
                  ? styles.button + " " + styles.selected
                  : styles.button
              }
              onClick={() => dispatch({ type: "SET_MODE", payload: "passage" })}
            >
              Passage
            </Button>
          </div>
        </div>
      </div>
      <Separator orientation="horizontal" />
    </div>
  );
};
