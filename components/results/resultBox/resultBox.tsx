import styles from "./resultBox.module.scss";

type ResultProps = {
  text: "WPM" | "Accuracy" | "Characters" | "";
  value: string;
  color?: string;
};

export const ResultBox = ({ text = "", value = "0" }: ResultProps) => {
  return (
    <div className={styles["result-box"]}>
      <div>
        {text} <span>{value}</span>
      </div>
    </div>
  );
};
