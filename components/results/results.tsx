import Image from "next/image";
import styles from "./results.module.css";
import { Button } from "../ui/button/button";
import { ResultBox } from "./resultBox/resultBox";

type ResultsProps = {
  mainText: string;
  subText: string;
  icon: string;
  buttonText: string;
};

export const Results = ({
  mainText,
  subText,
  icon,
  buttonText,
}: ResultsProps) => {
  return (
    <div className={styles.main}>
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
      <Image
        src="assets/images/pattern-confetti.svg"
        alt="confetti"
        width={4000}
        height={40}
        className={styles.confetti}
      />
      <div className={styles["success-icon"]}>
        <Image src={icon} alt="completed-icon" width={70} height={70} />
      </div>
      <div className={styles.text}>
        <div className={styles["main-text"]}>{mainText}</div>
        <div className={styles["sub-text"]}>{subText}</div>
      </div>
      <div className={styles.results}>
        <ResultBox text="WPM" value="85" />
        <ResultBox text="Accuracy" value="90%" />
        <ResultBox text="Characters" value="125/5" />
      </div>
      <Button className={styles.button} icon="/assets/images/icon-restart.svg">
        {buttonText}
      </Button>
    </div>
  );
};
