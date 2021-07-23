import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import React from "react";
import SwiperCore, { Mousewheel, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Title, Typography } from "../../../ui";
import { Group } from "../../models/group.model";
import { GroupSliderItem } from "../GroupSliderItem/GroupSliderItem.component";
import { useTranslation } from "react-i18next";
import SliderControl from "../../../videos/components/VideoSlider/SliderControl.component";

type Props = {
  title: string;
  text_no_data?: string;
  button_text?: string;
  groups: Group[] | null;
  updateMethod?: () => void;
  isJoined: boolean;
};

SwiperCore.use([Navigation, Mousewheel]);
export const GroupSlider: React.FC<Props> = ({
  groups,
  title,
  isJoined,
  updateMethod,
}) => {
  const { t } = useTranslation();
  if (groups?.length === 0 || groups === null)
    return isJoined ? (
      <div className="text-white">{t("groupManagement.nodata")}</div>
    ) : (
      <div className="text-white">{t("groupManagement.no-exist")}</div>
    );
  return (
    <div>
      <Title className="flex items-center mb-3">
        <Typography as="h4" className="text-xl pl-3" bold>
          {title}
        </Typography>
        <ChevronRightIcon className="w-5 pt-1 text-nx-white" />
      </Title>
      <Swiper
        navigation={{ nextEl: ".control-next", prevEl: ".control-previous" }}
        slidesPerView={1}
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        mousewheel
        spaceBetween={10}
        freeMode
      >
        <SliderControl direction="previous">
          <ChevronLeftIcon className="w-10" />
        </SliderControl>
        {groups.map((group) => (
          <SwiperSlide key={group.id}>
            <GroupSliderItem
              updateMethod={updateMethod}
              isJoined={isJoined}
              group={group}
            />
          </SwiperSlide>
        ))}
        <SliderControl direction="next">
          <ChevronRightIcon className="w-10" />
        </SliderControl>
      </Swiper>
    </div>
  );
};
