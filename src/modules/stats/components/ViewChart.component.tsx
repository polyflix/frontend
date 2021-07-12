import React, { useEffect, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { max } from "d3-array";
import { Axis, AxisBottom } from "@visx/axis";
import { LinearGradient } from "@visx/gradient";
import { MarkerCircle } from "@visx/marker";
import { LinePath } from "@visx/shape";
import { curveCardinal as curve } from "@visx/curve";
import { Text } from "@visx/text";
import { ParentSize } from "@visx/responsive";
import { timeFormat, timeParse } from "d3-time-format";
import { useTranslation } from "react-i18next";
import { StatViewQuery } from "../types/StatView.type";
import { formatEnglish } from "../../common/utils/date.util";

type Props = {
  width: number;
  height: number;
  data: StatViewQuery[];
};

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%b %d");
const formatDate = (date: string) => format(parseDate(date) as Date);
const getDate = (d: StatViewQuery) => d.createdAt;
const y = (d: StatViewQuery) => d.viewsCount;

export const ViewChart: React.FC<Props> = ({
  height,
  width,
  data: viewData,
}) => {
  const [data, setData] = useState(viewData);
  const { t } = useTranslation();
  const padding = 30;
  const colors = {
    white: "#FFFFFF",
    black: "#1B1B1B",
    gray: "#98A7C0",
    darkGray: "#2A2A2A",
    accent: "#E50914",
    darkAccent: "#B81D24",
  };

  const yScale = scaleLinear({
    domain: [0, max(data.map(y)) === 0 ? 1 : max(data.map(y)) ?? 1],
    range: [height - padding, padding * 2],
  });

  const dateScale = scaleBand({
    domain: data.map(getDate),
    range: [padding, width - padding],
  });

  useEffect(() => {
    const d = viewData;
    d.push({
      likesCount: 0,
      viewsCount: 0,
      watchedPercentMean: 0,
      createdAt: formatEnglish(new Date(Date.now() + 86400000)),
    });
    setData(d);
  }, [viewData]);

  dateScale.rangeRound([0, width]);
  return (
    <div>
      <svg height={height} width={width}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          style={{
            fill: colors.black,
          }}
          rx={14}
        />
        <AxisBottom
          top={height - padding}
          scale={dateScale}
          tickFormat={formatDate}
          stroke={colors.darkGray}
          strokeWidth={1.5}
          tickStroke={colors.darkGray}
          tickLabelProps={() => ({
            fill: colors.gray,
            fontSize: 11,
            textAnchor: "middle",
          })}
        />

        <MarkerCircle
          id="marker-circle"
          fill={colors.gray}
          size={1.5}
          refX={2}
        />

        <LinePath
          data={data}
          x={(d) => dateScale(d.createdAt) as number}
          y={(d) => yScale(d.viewsCount)}
          stroke="url('#line-gradient')"
          fill={"url('#background-gradient')"}
          strokeWidth={3}
          curve={curve}
          markerEnd="url(#marker-circle)"
          markerMid="url(#marker-circle)"
          markerStart="url(#marker-circle)"
        />
        <Axis
          hideZero
          scale={yScale}
          numTicks={5}
          left={padding + 25}
          orientation="left"
          stroke={colors.darkGray}
          strokeWidth={1.5}
          tickStroke={colors.darkGray}
          tickLabelProps={() => ({
            fill: colors.gray,
            textAnchor: "end",
            verticalAnchor: "middle",
          })}
        />
        <LinearGradient
          id="line-gradient"
          from={colors.accent}
          to={colors.darkAccent}
        />
        <LinearGradient
          id="background-gradient"
          from={colors.darkAccent}
          to={colors.black}
        />
        <Text
          style={{
            fill: colors.white,
            fontSize: 20,
            fontWeight: 600,
          }}
          x={padding / 2}
          y={padding}
        >
          {`${t("shared.common.views")} ${t(
            "shared.common.dates.thisWeek"
          ).toLowerCase()}`}
        </Text>
      </svg>
    </div>
  );
};

export const ResponsiveViewChart: React.FC<Omit<Props, "width" | "height">> = ({
  ...rest
}) => (
  <ParentSize debounceTime={10}>
    {({ width: visWidth, height: visHeight }) => (
      <ViewChart height={visHeight} width={visWidth} {...rest} />
    )}
  </ParentSize>
);
