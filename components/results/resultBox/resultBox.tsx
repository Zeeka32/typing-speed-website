import styles from "./resultBox.module.scss";
import { ReactNode } from "react";

type ResultProps = {
  text: "WPM" | "Accuracy" | "Characters" | "";
  children: ReactNode;
};

export const ResultBox = ({ text = "", children }: ResultProps) => {
  return (
    <div className={styles["result-box"]}>
      <div>
        {text} <span>{children}</span>
      </div>
    </div>
  );
};
