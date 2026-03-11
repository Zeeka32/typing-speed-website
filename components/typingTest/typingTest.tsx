import { Button } from "../ui/button/button";
import { Separator } from "../ui/seperator/seperator";
import styles from "./typingTest.module.scss";

export const TypingTest = () => {
  return (
    <div className={styles.main}>
      <div className={styles.utility}>
        <div className={styles.top}>
          <div className={styles.data}>
            <div>
              WPM: <span>0</span>
            </div>
            <Separator orientation="vertical" />
            <div>
              Accuracy: <span>100%</span>
            </div>
            <Separator orientation="vertical" />
            <div>
              Time: <span>0:60</span>
            </div>
          </div>
          <div className={styles.settings}>
            <div className={styles.difficulty}>
              <div>Difficulty:</div>
              <Button className={styles.button}>Easy</Button>
              <Button className={styles.button}>Medium</Button>
              <Button className={styles.button}>Hard</Button>
            </div>
            <Separator orientation="vertical" />
            <div className={styles.mode}>
              <div>Mode:</div>
              <Button className={styles.button}>Timed (60s)</Button>
              <Button className={styles.button}>Passage</Button>
            </div>
          </div>
        </div>
        <Separator orientation="horizontal" />
      </div>
      <div className={styles["typing-area"]}></div>
    </div>
  );
};
