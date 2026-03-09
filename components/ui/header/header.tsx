import Image from "next/image";
import styles from "./header.module.css";

export const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.top}>
        <div className={styles.title}>
          <Image
            src="/assets/images/logo-small.svg"
            alt="logo"
            width={35}
            height={35}
          />
          <div>
            <h1>Typing Speed Test</h1>
            <span>Type as fast as you can in 60 seconds</span>
          </div>
        </div>
        <div className={styles["personal-best"]}>
          <Image
            src="/assets/images/icon-personal-best.svg"
            alt="trophy-icon"
            width={25}
            height={25}
          />
          <div>
            Personal best: <span> 92 WPM</span>
          </div>
        </div>
      </div>
    </div>
  );
};
