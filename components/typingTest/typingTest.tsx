"use client";
import { useTestProvider } from "@/shared/context/TestContext";
import { Button } from "../ui/button/button";
import { Separator } from "../ui/seperator/seperator";
import { useEffect, useRef, useMemo } from "react";
import { Utility } from "./utility/utility";
import styles from "./typingTest.module.scss";

export const TypingTest = () => {
  const { state, dispatch } = useTestProvider();
  const { currentPassage, currentIndex, input, status, mode } = state;
  const inputRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const handleKeyDown = () => {
      inputRef.current?.focus();
    };

    dispatch({ type: "GENERATE_PASSAGE" });

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  useEffect(() => {
    if (status === "running" && textRef.current) {
      const currentCharElement = textRef.current.querySelector(
        `.${styles.current}`,
      );
      if (currentCharElement) {
        currentCharElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentIndex, status]);

  useEffect(() => {
    if (status !== "running") return;

    const interval = setInterval(() => {
      dispatch({ type: mode === "timed" ? "TICK_DOWN" : "TICK_UP" });
      dispatch({ type: "UPDATE_WPM" });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, dispatch, mode]);

  const { segments, currentChar, remainingText } = useMemo(() => {
    const segments: { text: string; type: "correct" | "incorrect" }[] = [];

    let currentSegment = "";
    let currentType: "correct" | "incorrect" | null = null;

    for (let i = 0; i < currentIndex; i++) {
      const isCorrect = input[i] === currentPassage[i];
      const type = isCorrect ? "correct" : "incorrect";

      if (type !== currentType) {
        if (currentSegment) {
          segments.push({ text: currentSegment, type: currentType! });
        }
        currentSegment = currentPassage[i];
        currentType = type;
      } else {
        currentSegment += currentPassage[i];
      }
    }

    if (currentSegment) {
      segments.push({ text: currentSegment, type: currentType! });
    }

    return {
      segments,
      currentChar: currentPassage[currentIndex] || "",
      remainingText: currentPassage.slice(currentIndex + 1),
    };
  }, [currentIndex, input, currentPassage]);

  return (
    <div className={styles.main}>
      <input
        ref={inputRef}
        value={input}
        inputMode="text"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className={styles["hidden-input"]}
        disabled={status === "idle"}
        onKeyDown={(e) => {
          if (e.key === "Backspace") {
            e.preventDefault();
            dispatch({ type: "BACKSPACE" });
          }
        }}
        onChange={(e) => {
          if (currentIndex === 0) {
            dispatch({ type: "START_TEST" });
          }

          const lastChar = e.target.value[e.target.value.length - 1];

          if (lastChar !== currentPassage[currentIndex]) {
            dispatch({ type: "ADD_MISTAKE" });
          }
          dispatch({ type: "UPDATE_ACCURACY" });

          if (currentIndex >= currentPassage.length - 1) {
            dispatch({ type: "FINISH_TEST" });
          }

          dispatch({ type: "SET_INPUT", payload: e.target.value });
        }}
      />
      <Utility />
      <div className={styles["typing-area"]}>
        {status === "idle" && (
          <div className={styles["start-screen"]}>
            <Button
              onClick={() => {
                dispatch({ type: "PREPARE_TEST" });
                inputRef.current?.focus();
              }}
            >
              Start Typing Test
            </Button>
            <p>Or click the text and start typing</p>
          </div>
        )}

        <p
          className={
            status === "idle"
              ? styles["blur-text"] + " " + styles.text
              : styles.text
          }
          ref={textRef}
          onClick={() => {
            if (status === "running") {
              inputRef.current?.focus();
              return;
            }
            dispatch({ type: "PREPARE_TEST" });
            inputRef.current?.focus();
          }}
        >
          {segments.map((seg, i) => (
            <span
              key={i}
              className={
                seg.type === "correct" ? styles.correct : styles.incorrect
              }
            >
              {seg.text}
            </span>
          ))}

          <span className={styles.current}>{currentChar}</span>
          <span>{remainingText}</span>
        </p>

        {status === "running" && (
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
