import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import {
  Alert,
  fadeOpacity,
  GhostText,
  GhostTile,
  GhostTitle,
  Title,
  Typography,
} from "../../../ui";
import { Container } from "../../../ui/components/Container/Container.component";
import { Page } from "../../../ui/components/Page/Page.component";
import { useAuth } from "../../../authentication/hooks";
import { useUser } from "../../hooks";
import { useSubtitlesImprovements } from "../../../subtitles/hooks/use-subtitles-improvements.hook";
import { SubtitleImprovement } from "../../../subtitles/models/subtitle-improvement.model";
import * as _ from "lodash";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../common";
import { SubtitleImprovementStatus } from "../../../subtitles/types/subtitle-improvement.type";
import { EyeIcon } from "@heroicons/react/outline";

export const UserSubtitleImprovementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useTranslation();
  const isOwnPage = user?.id === id;

  const { data: fetchedUser, isLoading: isLoadingUser } = useUser({
    id,
  });

  return (
    <Page
      isLoading={isLoadingUser}
      variants={fadeOpacity}
      title={
        isOwnPage
          ? t("userSubtitleImprovement.seo.ownTitle")
          : t("userSubtitleImprovement.seo.userTitle", {
              user: fetchedUser?.displayName,
            })
      }
    >
      <Container mxAuto className="px-5 flex flex-col pb-10">
        <UserSubtitleImprovement />
        {isOwnPage && <UserSubtitleImprovementVideo />}
      </Container>
    </Page>
  );
};

export const UserSubtitleImprovement: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const isOwnPage = user?.id === id;
  const { data: fetchedUser, isLoading: isLoadingUser } = useUser({
    id,
  });
  const [myImprovementsGroup, setMyImprovementsGroup] = useState<any>();
  const { t } = useTranslation();
  const { data: myImprovements, isLoading: myImprovementsLoading } =
    useSubtitlesImprovements({
      userId: id,
    });

  useEffect(() => {
    setMyImprovementsGroup(
      _.groupBy(myImprovements, (elm) => elm.subtitle.video?.slug)
    );
  }, [myImprovements]);

  return (
    <>
      {!isLoadingUser && !myImprovementsLoading ? (
        <>
          <Title className="my-5">
            {isOwnPage
              ? t("userSubtitleImprovement.seo.ownTitle")
              : t("userSubtitleImprovement.seo.userTitle", {
                  user: fetchedUser?.displayName,
                })}
          </Title>
          {myImprovementsGroup &&
          Object.keys(myImprovementsGroup).length > 0 ? (
            Object.keys(myImprovementsGroup).map((key: string, i: number) => (
              <div
                key={i}
                className="rounded-md flex flex-col lg:flex-row gap-4 p-2"
              >
                <div className="flex flex-col gap-4 justify-start">
                  <img
                    className="h-32 w-64 rounded object-cover"
                    src={myImprovementsGroup[key][0].subtitle.video?.thumbnail}
                    alt={myImprovementsGroup[key][0].subtitle.video?.title}
                  />
                  <Typography as="h4">
                    {myImprovementsGroup[key][0].subtitle.video?.title}
                  </Typography>
                  <Link
                    className={cn(
                      " bg-nx-red-dark hover:bg-nx-red hover:bg-opacity-80 bg-opacity-90 px-2 py-1 box-border rounded flex flex-row gap-2 justify-center items-center"
                    )}
                    to={`/watch?v=${myImprovementsGroup[key][0]?.subtitle?.video.slug}`}
                  >
                    <EyeIcon className="h-5 w-5 text-white" />
                    <Typography as="p">
                      {t("shared.common.actions.view")}
                    </Typography>
                  </Link>
                </div>
                <div className="flex flex-col  gap-4 w-full">
                  {myImprovementsGroup[key]?.map(
                    (subtitleImprovement: SubtitleImprovement, i: number) => (
                      <div
                        key={i}
                        className={cn(
                          "p-2 flex gap-2 bg-darkgray rounded",
                          setBorder(subtitleImprovement)
                        )}
                      >
                        <Typography
                          as="span"
                          className="ml-2 mr-4 w-14 lg:block"
                        >
                          {formatMilis(subtitleImprovement.timestamp)}
                        </Typography>
                        <Typography as="p" className="overflow-ellipsis">
                          {subtitleImprovement.comment}
                        </Typography>
                        <span className="flex-1"></span>
                        <Typography as="p">
                          {new Date(
                            subtitleImprovement?.createdAt
                          )?.toLocaleDateString()}
                        </Typography>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))
          ) : (
            <Alert type="info" className="w-1/3">
              {t("shared.common.errors.noData")}
            </Alert>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4 mt-5">
          <GhostTitle className="w-11/12 lg:w-1/3 mb-4 h-6" />
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col gap-4 justify-start">
              <GhostTile
                aspectRatio={false}
                className="h-32 w-64 rounded object-cover"
              />
              <GhostText />
            </div>
            <div className="flex flex-col gap-4 w-full">
              {new Array(3).fill(0).map((_, i: number) => (
                <div className="flex gap-4 items-center" key={i}>
                  <GhostText className="w-12" />
                  <GhostText className="w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const UserSubtitleImprovementVideo: React.FC = () => {
  const { t } = useTranslation();
  const { data: improvementOnMyVideo, isLoading: improvementOnMyVideoLoading } =
    useSubtitlesImprovements({
      myVideo: true,
    });

  const [improvementOnMyVideoGroup, setImprovementOnMyVideoGroup] =
    useState<any>();

  useEffect(() => {
    setImprovementOnMyVideoGroup(
      _.groupBy(improvementOnMyVideo, (elm) => elm.subtitle.video?.slug)
    );
  }, [improvementOnMyVideo]);

  return (
    <>
      {!improvementOnMyVideoLoading ? (
        <>
          <Title className="my-5 mt-16">
            {t("userSubtitleImprovement.content.onMyVideo")}
          </Title>
          {improvementOnMyVideoGroup &&
          Object.keys(improvementOnMyVideoGroup).length > 0 ? (
            Object.keys(improvementOnMyVideoGroup).map(
              (key: string, i: number) => (
                <div
                  key={i}
                  className="rounded-md flex flex-col lg:flex-row gap-4 p-2"
                >
                  <div className="flex flex-col gap-4 justify-start">
                    <img
                      className="h-32 w-64 rounded object-cover"
                      src={
                        improvementOnMyVideoGroup[key][0].subtitle.video
                          ?.thumbnail
                      }
                      alt={
                        improvementOnMyVideoGroup[key][0].subtitle.video?.title
                      }
                    />
                    <Typography as="h4">
                      {improvementOnMyVideoGroup[key][0].subtitle.video?.title}
                    </Typography>
                    <Link
                      className={cn(
                        " bg-nx-red-dark hover:bg-nx-red hover:bg-opacity-80 bg-opacity-90 px-2 py-1 box-border rounded flex flex-row gap-2 justify-center items-center"
                      )}
                      to={`/watch?v=${improvementOnMyVideoGroup[key][0]?.subtitle?.video.slug}`}
                    >
                      <EyeIcon className="h-5 w-5 text-white" />
                      <Typography as="p">
                        {t("shared.common.actions.view")}
                      </Typography>
                    </Link>
                  </div>
                  <div className="flex flex-col gap-4 w-full">
                    {improvementOnMyVideoGroup[key]?.map(
                      (subtitleImprovement: SubtitleImprovement, i: number) => (
                        <div
                          key={i}
                          className={cn(
                            "p-2 flex gap-2 bg-darkgray rounded",
                            setBorder(subtitleImprovement)
                          )}
                        >
                          <Typography
                            as="span"
                            className="ml-2 mr-4 w-14 lg:block"
                          >
                            {formatMilis(subtitleImprovement.timestamp)}
                          </Typography>
                          <Link
                            to={`/profile/videos/${subtitleImprovement?.createdBy?.id}`}
                            className="mr-2"
                          >
                            <img
                              className="cursor-pointer w-6 h-6 rounded-3xl mr-3"
                              src="https://picsum.photos/50"
                              alt="avatar"
                            />
                          </Link>
                          <Typography as="p" className="overflow-ellipsis">
                            {subtitleImprovement.comment}
                          </Typography>
                          <span className="flex-1"></span>
                          <Typography as="p">
                            {new Date(
                              subtitleImprovement?.createdAt
                            )?.toLocaleDateString()}
                          </Typography>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )
            )
          ) : (
            <Alert type="info" className="w-1/3">
              {t("shared.common.errors.noData")}
            </Alert>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4 mt-16">
          <GhostTitle className="w-11/12 lg:w-1/3 mb-4 h-6" />
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col gap-4 justify-start">
              <GhostTile
                aspectRatio={false}
                className="h-32 w-64 rounded object-cover"
              />
              <GhostText />
            </div>
            <div className="flex flex-col gap-4 w-full">
              {new Array(3).fill(0).map((_, i: number) => (
                <div className="flex gap-4 items-center" key={i}>
                  <GhostText className="w-12" />
                  <GhostText className="w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const setBorder = (subtitleImprovement: SubtitleImprovement): string => {
  if (subtitleImprovement.status === SubtitleImprovementStatus.REVIEWED) {
    return subtitleImprovement.isApproved
      ? "border-l-4 border-green-500"
      : "border-l-4 border-nx-red-dark";
  }
  return "pl-3";
};

const formatMilis = (milis: number): string => {
  const minutes = Math.round(milis / 1000 / 60);
  const secondes = Math.round((milis / 1000) % 60);

  const parsedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const parsedSeconds = secondes < 10 ? `0${secondes}` : `${secondes}`;

  return `${parsedMinutes}:${parsedSeconds}`;
};
