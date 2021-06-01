import React, { Children, PropsWithChildren } from "react";

import { cn } from "../../../common/utils/classes.util";

import { ChevronDown } from "../../../ui";
import { InnerTab } from "./InnerTab.component";
import styles from "../../pages/slug.module.scss";

export const TabGroup: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [isVisible, setIsVisible] = React.useState<boolean>(true);

  return (
    <div
      className={cn(
        "flex flex-col w-full",
        styles.tab_group,
        styles.paper,
        isVisible ? styles.state_visible : styles.state_hide
      )}
    >
      <ul className="flex justify-center w-full">
        <button
          className={cn(styles.toggle_btn, "p-2")}
          onClick={() => setIsVisible(!isVisible)}
        >
          <ChevronDown />
        </button>
        {Children.map(
          children,
          (child: any, i: number) =>
            child && (
              <InnerTab
                key={i}
                title={child.props.title}
                icon={child.props.icon}
                index={i}
                activeTabIndex={activeTab}
                onClick={setActiveTab}
              />
            )
        )}
      </ul>
      <div className="text-white h-full p-2 overflow-y-auto overflow-x-hidden">
        {Children.map(children, (child: any, i: number) => {
          if (i !== activeTab) return;
          return child.props.children;
        })}
      </div>
    </div>
  );
};
