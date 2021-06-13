import { cn } from "../../../common/utils/classes.util";
import styles from "../../../common/styles/ghost.module.scss";

export const VideoTileGhost: React.FC = () => {
  return (
    <div className={cn(styles.video_ghost, "h-48 w-5/6 2xl:h-72 relative")}>
      <div className={cn(styles.thumbnail, styles.paper_ghost)}></div>
      <div className={styles.text_ghost}>
        <span className={cn(styles.ghost_line, styles.ghost_line__tile)}></span>
        <span className={styles.ghost_line}></span>
        <span className={styles.ghost_line}></span>
      </div>
    </div>
  );
};
