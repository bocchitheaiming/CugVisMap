import * as Plot from "@observablehq/plot";
import { createElement as h } from "react";

export default function PlotFigure({ options }) {
  return Plot.plot({ ...options, document: new Document() }).toHyperScript();
}

export const Histogram = Plot.plot({
  marks: [
    Plot.barY(
      [
        { name: 'A', value: 30 },
        { name: 'B', value: 80 },
        { name: 'C', value: 45 },
        { name: 'D', value: 60 },
        { name: 'E', value: 20 },
        { name: 'F', value: 90 },
        { name: 'G', value: 55 }
      ],
      { x: "name", y: "value" }
    )
  ],
  y: { label: "Value" },
  x: { label: "Category" },
  height: 300,
  width: 500,
});

export function BuildHistogram(option1) {
  return Plot.plot({
    marks: [
      Plot.barY(
        option1,
        { x: "name", y: "value" }
      )
    ],
    y: { label: "人数" },
    x: { label: "楼层" },
    height: 300,
    width: 500,
    title: "各楼层人数统计"
  });
}