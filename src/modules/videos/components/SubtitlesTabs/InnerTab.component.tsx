import { cn } from "../../../common/utils/classes.util";
import styles from "../../pages/slug.module.scss";

export const InnerTab: React.FC<{
  title: string;
  index: number;
  icon: JSX.Element;
  activeTabIndex: number;
  onClick: (tabIndex: number) => void;
}> = (props) => {
  let className = `box-content
                     text-white
                     px-4
                     py-2
                     flex-1
                     justify-center
                     overflow-hidden`;

  if (props.index === props.activeTabIndex) {
    className += " " + styles.active;
  }
  return (
    <>
      <li className={cn(className, styles.tab)}>
        <p
          className="cursor-pointer w-full flex justify-center  items-center"
          onClick={() => props.onClick(props.index)}
        >
          <span className="mr-2">{props.icon}</span>
          <span className="block truncate text-xs capitalize h-4">
            {props.title}
          </span>
        </p>
      </li>
    </>
  );
};
