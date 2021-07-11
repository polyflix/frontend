import React from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { max } from "d3-array";
import { Axis, AxisBottom } from "@visx/axis";
import { LinearGradient } from "@visx/gradient";
import { MarkerCircle } from "@visx/marker";
import { LinePath } from "@visx/shape";
import { curveNatural } from "@visx/curve";
import { Text } from "@visx/text";
import { ParentSize } from "@visx/responsive";
import { timeFormat, timeParse } from "d3-time-format";
import { useTranslation } from "react-i18next";

type Props = {
  width: number;
  height: number;
};

type Data = {
  date: string;
  occurrence: number;
};

const data: Data[] = [
  { date: "2020-03-01", occurrence: 0 },
  { date: "2020-03-02", occurrence: 10 },
  { date: "2020-03-03", occurrence: 30 },
  { date: "2020-03-04", occurrence: 5 },
  { date: "2020-03-05", occurrence: 16 },
  { date: "2020-03-06", occurrence: 23 },
  { date: "2020-03-07", occurrence: 48 },
  { date: "2020-03-08", occurrence: 80 },
  { date: "2020-03-09", occurrence: 38 },
  { date: "2020-03-10", occurrence: 0 },
];

const parseDate = timeParse("%Y-%m-%d");
const format = timeFormat("%b %d");
const formatDate = (date: string) => format(parseDate(date) as Date);
const getDate = (d: Data) => d.date;
const y = (d: Data) => d.occurrence;

export const ViewChart: React.FC<Props> = ({ height, width }) => {
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
    domain: [0, max(data.map(y)) ?? 100],
    range: [height - padding, padding * 2],
  });

  const dateScale = scaleBand({
    domain: data.map(getDate),
    range: [padding, width - padding],
  });

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
          x={(d) => dateScale(d.date) as number}
          y={(d) => yScale(d.occurrence)}
          stroke="url('#line-gradient')"
          fill={"url('#background-gradient')"}
          strokeWidth={3}
          curve={curveNatural}
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

export const ResponsiveViewChart: React.FC = () => (
  <ParentSize debounceTime={10}>
    {({ width: visWidth, height: visHeight }) => (
      <ViewChart height={visHeight} width={visWidth} />
    )}
  </ParentSize>
);
