import * as Plot from "@observablehq/plot";
import * as d3Fetch from "d3-fetch";
import { utcDays, utcDay, utcWeek } from "d3-time"; // Import time functions directly


export function CanteenBarChart(brands) {
  return Plot.plot({
    marginBottom: 60,
    x: {
      tickRotate: -30,
    },
    y: {
      transform: (d) => d / 1000,
      label: "人数/天",
      grid: 5
    },
    marks: [
      Plot.ruleY([0]),
      Plot.barY(brands, {
        x: "name",
        y: "value",
        sort: { x: "y", reverse: true, limit: 20 },
        fill: "steelblue"
      }),
    ]
  });
}

export function CanteenLineChart(bls) {
  return Plot.plot({
    y: { grid: true, label: null},
    x: { label: null, axis: null},
    color: { scheme: "BuYlRd", domain: [-0.5, 0.5] },
    marks: [
      Plot.ruleY([0]),
      Plot.lineY(
        bls,
        Plot.map(
          { stroke: Plot.window({ k: 2, reduce: "difference" }) },
          { x: "date", y: "unemployment", z: "division", stroke: "unemployment" }
        )
      )
    ]
  });
}

export function CanteenBurnbownChart(issues) {
  return Plot.plot({
    width: 200,
    height: 200,
    x: { label: null },
    color: { legend: true, label: "Opened" },
    marks: [
      Plot.areaY(
        issues.flatMap((i) =>
          utcDays(i.created_at, i.closed_at ?? utcDay()) // Use utcDays and utcDay directly
            .map((at) => ({ created_at: i.created_at, at }))
        ),
        Plot.binX(
          { y: "count", filter: null },
          {
            x: "at",
            fill: (d) => utcWeek(d.created_at), // Use utcWeek directly
            reverse: true,
            curve: "step",
            tip: { format: { x: null, z: null } },
            interval: "day"
          }
        )
      )
    ]
  });
}