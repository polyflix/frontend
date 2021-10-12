import React from "react";
import { WithClassname } from "../../../common";

type Props = WithClassname;

export const YoutubeLogo: React.FC<Props> = ({ className = "" }) => (
  <svg version="1.1" viewBox="0 0 71.412065 50" className={className}>
    <g id="g5" transform="scale(0.58823529,0.58823529)">
      <path
        fill="#ffffff"
        fill-opacity="1"
        d="M 35.705078 0 C 35.705078 0 13.35386 0.0001149 7.765625 1.4707031 C 4.765625 2.2942325 2.2942325 4.7653952 1.4707031 7.8242188 C 0.0001149 13.412454 -2.9605947e-016 25 0 25 C 0 25 0.0001149 36.64637 1.4707031 42.175781 C 2.2942325 45.234605 4.7068015 47.647174 7.765625 48.470703 C 13.412684 50.000115 35.705078 50 35.705078 50 C 35.705078 50 58.058249 49.999885 63.646484 48.529297 C 66.705308 47.705767 69.117877 45.293199 69.941406 42.234375 C 71.411994 36.64614 71.412109 25.058594 71.412109 25.058594 C 71.412109 25.058594 71.470818 13.412454 69.941406 7.8242188 C 69.117877 4.7653952 66.705308 2.3528263 63.646484 1.5292969 C 58.058249 -0.000114879 35.705078 2.9605947e-016 35.705078 0 z M 28.587891 14.294922 L 47.175781 25 L 28.587891 35.705078 L 28.587891 14.294922 z "
        transform="scale(1.7,1.7)"
        id="path7"
      />
    </g>
  </svg>
);