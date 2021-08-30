import { cn } from '../../../../common/utils/classes.util';
import styles from './GhostVideo.module.scss';
import { GhostText } from '../GhostText.component';
import { GhostTitle } from '../GhostTitle.component';

export const GhostVideo: React.FC = () => (
  <div className={cn(styles.video_ghost, 'pr-4 gap-2')}>
    <GhostTitle className={cn(styles.thumbnail, 'h-3 mb-2')} />
    <div className="flex flex-col gap-2">
      <GhostText className="h-2" />
      <GhostText className="h-2" />
      <GhostText className="h-2" />
    </div>
  </div>
);
