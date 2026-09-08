import Image from "next/image";
import styles from "./results.module.css";
import { Button } from "../ui/button/button";
import { ResultBox } from "./resultBox/resultBox";
import { useTestProvider } from "@/shared/context/TestContext";
import { splashConfetti } from "@/utils/confetti";
import { useEffect } from "react";

export const Results = () => {
  const { state, dispatch } = useTestProvider();

  useEffect(() => {
    if (state.score_status === "new-best") {
      splashConfetti();
    }
  }, [state.score_status]);

  return (
    <div className={styles.main}>
      {state.score_status == "first-run" ||
        (state.score_status == "normal-run" && (
          <>
            <Image
              src="assets/images/pattern-star-1.svg"
              alt="star1"
              width={75}
              height={75}
              className={styles.star1}
            />
            <Image
              src="assets/images/pattern-star-2.svg"
              alt="star2"
              width={40}
              height={40}
              className={styles.star2}
            />
          </>
        ))}
      {(state.score_status == "first-run" ||
        state.score_status == "normal-run") && (
        <div className={styles["success-icon"]}>
          <Image
            src="/assets/images/icon-completed.svg"
            alt="completed-icon"
            width={70}
            height={70}
          />
        </div>
      )}
      {state.score_status == "new-best" && (
        <div className={styles["pb-icon"]}>
          <Image
            src="/assets/images/icon-new-pb.svg"
            alt="confetti-icon"
            width={70}
            height={70}
          />
        </div>
      )}
      <div className={styles.text}>
        <div className={styles["main-text"]}>
          {state.score_status == "first-run" && "Baseline Established!"}
          {state.score_status == "new-best" && "High Score Smashed!"}
          {state.score_status == "normal-run" && "Test Complete!"}
        </div>
        <div className={styles["sub-text"]}>
          {state.score_status == "first-run" &&
            "You've set the bar. Now the real challenge begins - time to beat it."}
          {state.score_status == "new-best" &&
            "you're getting faster. That was incredible typing."}
          {state.score_status == "normal-run" &&
            "Solid run. Keep pusing to beat your high score."}
        </div>
      </div>
      <div className={styles.results}>
        <ResultBox text="WPM">{state.wpm}</ResultBox>
        <ResultBox text="Accuracy">
          <span
            style={
              state.accuracy >= 80
                ? { color: "hsl(140, 63%, 57%)" }
                : state.accuracy >= 50
                  ? { color: "hsl(49, 85%, 70%)" }
                  : { color: "hsl(354, 63%, 57%)" }
            }
          >
            {state.accuracy}%
          </span>
        </ResultBox>
        <ResultBox text="Characters">
          <span style={{ color: "hsl(140, 63%, 57%)" }}>
            {state.currentIndex - state.mistakes}
          </span>
          {" / "}
          <span style={{ color: "hsl(354, 63%, 57%)" }}>{state.mistakes}</span>
        </ResultBox>
      </div>
      <Button
        className={styles.button}
        icon="/assets/images/icon-restart.svg"
        onClick={() => {
          dispatch({ type: "RESET" });
        }}
      >
        {state.score_status == "first-run" || state.score_status == "new-best"
          ? "Beat This Score"
          : "Go Again"}
      </Button>
    </div>
  );
};
