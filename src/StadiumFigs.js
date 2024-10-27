import * as Plot from "@observablehq/plot";
import * as d3 from "d3-fetch";
import { autoType } from "d3-dsv"; // Import autoType from d3-dsv

export async function CSVData(files) {
  const Data = (await Promise.all(
    files.map(async ({ symbol, file }) => {
      const data = await d3.csv(file, autoType); // Assuming d3.csv can be used directly for fetching
      return data.map(d => ({ Symbol: symbol, ...d })); // 添加Symbol字段
    })
  )).flat();
  return Data;
}

export function StadiumLine(stocks) {
  return Plot.plot({
    width: 800,
    height: 400,
    style: "overflow: visible;",
    y: { grid: true },
    marks: [
      Plot.ruleY([0]),
      Plot.lineY(stocks, { x: "Date", y: "Close", stroke: "Symbol" }),
      Plot.text(stocks, Plot.selectLast({
        x: "Date", y: "Close", z: "Symbol", text: "Symbol", textAnchor: "start", dx: 3
      }))
    ]
  });
}

export function StadiumHeatmap(seattle) {
  return Plot.plot({
    padding: 0,
    y: { tickFormat: Plot.formatMonth("en", "short") },
    marks: [
      Plot.cell(seattle, Plot.group({ fill: "max" }, {
        x: (d) => d.date.getUTCDate(),
        y: (d) => d.date.getUTCMonth(),
        fill: "temp_max",
        inset: 0.5
      }))
    ]
  });
}

export function StadiumBarChart(data) {
  return Plot.plot({
    x: { axis: null },
    y: { tickFormat: "s", grid: true },
    color: { scheme: "spectral", legend: true },
    marks: [
      Plot.barY(data, {
        x: "key",
        y: "population",
        fill: "key",
        fx: "state",
        sort: { x: null, color: null, fx: { value: "-y", reduce: "sum" } }
      }),
      Plot.ruleY([0])
    ]
  });
}
