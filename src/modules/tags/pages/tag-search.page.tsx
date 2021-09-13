import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Container, Page } from "../../ui";
import { Video, VideoListItem } from "../../videos";
import { Jumbotron } from "../../ui/components/Jumbotron/Jumbotron.component";
import { useVideos } from "../../videos/hooks/useVideos.hook";
import {
  CollectionListItem,
  CollectionsWithPagination,
  useCollections,
} from "../../collections";

export const TagSearchPage: React.FC = () => {
  const { tags } = useParams<{ tags: string }>();
  const { t } = useTranslation();
  const { data: videos } = useVideos({ tags });
  const { data: collections } = useCollections<CollectionsWithPagination>({
    mode: "collection",
    tags,
  });

  return (
    <Page
      className="h-full flex items-start justify-center"
      title={t("search.title")}
    >
      <Container mxAuto fluid className="flex flex-col p-4 box-border">
        <Jumbotron
          withGoBack
          content={
            videos &&
            collections &&
            [...videos.items, ...collections.items].length === 0
              ? t("search.descriptionNoData")
              : t("search.description")
          }
          title={t("search.title")}
        />
      </Container>
      <Container
        mxAuto
        fluid
        className="flex flex-col p-4 box-border text-nx-white"
      >
        {videos &&
          collections &&
          [...videos.items, ...collections.items]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((e) => {
              if (e instanceof Video) {
                return (
                  <VideoListItem
                    key={e.id}
                    video={e}
                    onDelete={undefined}
                    ownerItems={false}
                    links={true}
                    tags={e.tags}
                  />
                );
              } else {
                return (
                  <CollectionListItem
                    key={e.id}
                    collection={e}
                    ownerItems={false}
                    tags={e.tags}
                  />
                );
              }
            })}
      </Container>
    </Page>
  );
};
