import * as Plot from "@observablehq/plot";
import { ticks } from 'd3-array';
import * as d3Fetch from 'd3-fetch';
import * as d3 from 'd3';        // 导入 d3 库
import * as htl from 'htl';      // 导入 htl 库用于 HTML 模板

export function LibraryLineChart(sftemp) {
  return Plot.plot({
    y: { nice: true },
    color: { domain: [450, 750], scheme: "turbo", legend: true, ticks: 7, label: "当日到馆人数最值" },
    marks: [
      Plot.line(sftemp, {
        x: "date",
        y: "high",
        stroke: "url(#gradient)",
        curve: "step-before",
      }),



      (_index, { y, color }) => htl.svg`<defs>
   <linearGradient id="gradient" gradientUnits="userSpaceOnUse"
     x1=0 x2=0 y1=${y(450)} y2=${y(750)}>${d3.ticks(0, 1, 10).map(
        (t) =>
          htl.svg`<stop
                  offset=${t * 100}%
                  stop-color=${color(450 * (1 - t) + 750 * t)} />`
      )}`
    ]
  });
}

export function LibraryDotChart(temps, {width, height}) {
  const delta = (d) => d.temp_max - d.temp_min;
  return Plot.plot({
    width: width*0.2,
    height: height*0.2,
    x: { label: "Daily low temperature (°F) →", nice: true },
    y: { label: "↑ Daily temperature variation (Δ°F)", zero: true },
    aspectRatio: 1,
    color: {
      type: "cyclical",
      legend: true,
      tickFormat: Plot.formatMonth()
    },
    marks: [
      Plot.ruleY([0]),
      Plot.dot(temps, {
        fill: (d) => d.date.getUTCMonth(),
        x: "temp_min",
        y: delta
      }),
      Plot.dot(temps, Plot.selectMaxY({ x: "temp_min", y: delta, r: 5 })),
      Plot.text(
        temps,
        Plot.selectMaxY({
          x: "temp_min",
          y: delta,
          text: "date",
          lineAnchor: "bottom",
          dy: -10
        })
      )
    ]
  });
}

export function LibraryBarChart(alphabet) {
  return Plot.plot({
    x: {
      label: "", // 设置横坐标标签
      domain: alphabet.map(d => d.letter), // 确保横坐标显示正常

    },
    y: {
      axis: "left",
      grid: true,
      percent: true,
    },
    marks: [
      Plot.ruleY([0]), // 添加Y轴的参考线
      Plot.barY(alphabet, {
        x: "letter", // 现在将字母作为X轴
        y: "frequency", // 频率作为Y轴
        sort: { x: "y", reverse: true },
        fill: "skyblue" // 设置图表的颜色为天蓝色
      })
    ],
  });
}

