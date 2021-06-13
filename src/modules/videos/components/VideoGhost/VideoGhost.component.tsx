import { cn } from "../../../common/utils/classes.util";
import styles from "../../../common/styles/ghost.module.scss";

export const VideoGhost: React.FC = () => {
  return (
    <div className={styles.video_ghost}>
      <div className={cn(styles.thumbnail, styles.paper_ghost)}></div>
      <div className={styles.text_ghost}>
        <span
          className={cn(styles.ghost_line, styles.ghost_line__accent)}
        ></span>
        <span className={styles.ghost_line}></span>
        <span className={styles.ghost_line}></span>
      </div>
    </div>
  );
};
