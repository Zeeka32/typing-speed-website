import { useTestProvider } from "@/context/TestContext";
import { Button } from "../ui/button/button";
import { Separator } from "../ui/seperator/seperator";
import { useEffect, useRef } from "react";
import { Utility } from "./utility/utility";
import styles from "./typingTest.module.scss";

export const TypingTest = () => {
  const { state, dispatch } = useTestProvider();
  const { currentPassage, currentIndex, input, status, mode } = state;
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = () => {
      inputRef.current?.focus();
    };

    dispatch({ type: "GENERATE_PASSAGE" });

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  useEffect(() => {
    if (status !== "running") return;

    let interval;
    if (mode == "timed") {
      interval = setInterval(() => {
        dispatch({ type: "TICK_DOWN" });
        dispatch({ type: "UPDATE_WPM" });
      }, 1000);
    } else {
      interval = setInterval(() => {
        dispatch({ type: "TICK_UP" });
        dispatch({ type: "UPDATE_WPM" });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [status, dispatch, mode]);

  return (
    <div className={styles.main}>
      <input
        ref={inputRef}
        value={input}
        className={styles["hidden-input"]}
        disabled={state.status == "idle"}
        onKeyDown={(e) => {
          if (e.key === "Backspace") {
            e.preventDefault();
            dispatch({ type: "BACKSPACE" });
          }
        }}
        onChange={(e) => {
          if (currentIndex == 0) {
            dispatch({ type: "START_TEST" });
          }

          if (
            e.target.value[e.target.value.length - 1] !==
            currentPassage[currentIndex]
          ) {
            dispatch({ type: "ADD_MISTAKE" });
            dispatch({ type: "UPDATE_ACCURACY" });
          }

          if (currentIndex >= currentPassage.length - 1) {
            dispatch({ type: "FINISH_TEST" });
          }

          dispatch({ type: "SET_INPUT", payload: e.target.value });
        }}
      />
      <Utility />
      <div className={styles["typing-area"]}>
        {state.status == "idle" && (
          <div className={styles["start-screen"]}>
            <Button
              onClick={() => {
                dispatch({ type: "PREPARE_TEST" });
                inputRef.current?.focus();
              }}
            >
              Start Typing Test
            </Button>
            <p>Or click the the text and start typing</p>
          </div>
        )}
        <span
          className={state.status == "idle" ? styles["blur-text"] : ""}
          onClick={() => {
            dispatch({ type: "PREPARE_TEST" });
            inputRef.current?.focus();
          }}
        >
          {currentPassage.split("").map((char, index) => {
            let className = "";
            if (index < currentIndex) {
              className =
                char == input[index] ? styles.correct : styles.incorrect;
            } else if (index == currentIndex) {
              className = styles.current;
            }

            return (
              <span key={index} className={className}>
                {char}
              </span>
            );
          })}
        </span>
        {state.status == "running" && (
          <div className={styles.bottom}>
            <Separator orientation="horizontal" />
            <Button
              onClick={() => dispatch({ type: "RESET" })}
              className={styles["button"]}
              icon="/assets/images/icon-restart.svg"
            >
              Restart Test
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
