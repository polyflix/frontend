import React, { Children } from "react";
import { Redirect, useParams } from "react-router";
import { Link } from "react-router-dom";
import { Url } from "../../common/utils/url.util";
import { fadeOpacity } from "../../ui/animations/fadeOpacity";
import { Container } from "../../ui/components/Container/Container.component";
import { Page } from "../../ui/components/Page/Page.component";
import { MediaPlayer } from "../components/MediaPlayer/MediaPlayer.component";
import { useVideos } from "../hooks/useVideos.hook";
import { Video } from "../models/video.model";
import styles from "./slug.module.scss";
import { cn } from "../../common/utils/classes.util";
import { useTranslation } from "react-i18next";
import { ChevronDown, Paragraph, Playlist, Subtitle } from "../../ui";
import ReactPlayer from "react-player";

export const VideoDetail: React.FC = () => {
  const { t } = useTranslation();

  const isPlayingMode = Boolean(Url.hasParameter("play")) === true;

  const { slug } = useParams<{ slug: string }>();

  const {
    data: video,
    isLoading,
    alert,
  } = useVideos<Video>({
    mode: "document",
    slug,
  });

  const ghosts = new Array(5).fill(null);

  const buildContent = (_video: Video) => {
    document?.getElementById("dsefault-tab")?.click();

    return isPlayingMode ? (
      <MediaPlayer video={_video} />
    ) : (
      <Container mxAuto fluid className={styles.root}>
        <section>
          <div className={cn(styles.player_container, styles.paper)}>
            <ReactPlayer
              className={styles.player}
              width="100%"
              height="100%"
              controls
              playing={false}
              url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            />
          </div>
        </section>
        <aside>
          <TabGroup>
            <Tab
              title={t("video.view.tabs.label.playlist")}
              icon={<Playlist />}
            >
              <Paragraph className="my-1">
                {t("video.view.publishedBy")}
                <Link
                  to={`/profile/videos/${video?.publisher?.id}`}
                  className="text-nx-red font-bold"
                >
                  {` ${video?.publisher?.displayName}`}
                </Link>
              </Paragraph>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit
              illo voluptatum sint inventore quas aperiam animi incidunt
              similique laudantium, et aliquam blanditiis numquam veniam eos
              alias ipsum voluptatibus obcaecati deleniti.
            </Tab>
            <Tab
              title={t("video.view.tabs.label.subtitle")}
              icon={<Subtitle />}
            >
              Necessitatibus incidunt eveniet totam neque, itaque aliquid, quos
              corporis blanditiis quas veritatis rem illo inventore et
              laudantium ad in aut earum minus, enim sit veniam omnis tempore.
              Modi, nisi eos?
            </Tab>
          </TabGroup>
          <div className={styles.suggestion_list}>
            {ghosts.map((_, i: number) => (
              <VideoGhost key={i} />
            ))}
          </div>
        </aside>
      </Container>
    );
  };

  if (alert) return <Redirect to="/not-found" />;
  return (
    <Page
      withNavbar={isPlayingMode ? false : true}
      variants={fadeOpacity}
      isLoading={isLoading}
      title={video?.title}
    >
      {video && buildContent(video)}
    </Page>
  );
};

const VideoGhost: React.FC = () => {
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

const TabGroup: React.FC = (props) => {
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
        {Children.map(props.children, (child: any, i: number) => (
          <InnerTab
            key={i}
            title={child.props.title}
            icon={child.props.icon}
            index={i}
            activeTabIndex={activeTab}
            onClick={setActiveTab}
          />
        ))}
      </ul>
      <div className="text-white h-full p-2 overflow-y-auto overflow-x-hidden">
        {Children.map(props.children, (child: any, i: number) => {
          if (i !== activeTab) return;
          return child.props.children;
        })}
      </div>
    </div>
  );
};

const Tab: React.FC<{
  title: string;
  icon: JSX.Element;
}> = () => {
  return <div></div>;
};

const InnerTab: React.FC<{
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
