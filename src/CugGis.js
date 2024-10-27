import React, { useEffect, useRef, useState } from "react";
import { StadiumLine, StadiumHeatmap, StadiumBarChart, CSVData } from './StadiumFigs';
import { CanteenBarChart, CanteenLineChart, CanteenBurnbownChart } from './CanteenFigs';
import { LibraryLineChart, LibraryDotChart, LibraryBarChart } from './LibraryFigs';
export default function CugGis() {

  const [issues, setIssues] = useState([]);
  const containerRef = useRef(null); // 用于存放图表的容器引用

  useEffect(() => {
    async function fetchAndRenderChart() {

      const StadiumStockData = await CSVData([
        { symbol: "游泳馆", file: "/data/pool.csv" },
        { symbol: "羽毛球馆", file: "/data/badhall.csv" },
        { symbol: "乒乓球馆", file: "/data/tabletennis.csv" },
        { symbol: "健身房", file: "/data/gym.csv" },
      ]);

      const StadiumHeatmapData = await CSVData([
        { file: "./data/stadiumheatmap.csv" },
      ]);
      const StadiumBarchartData = await CSVData([
        { file: "./data/stadiumbarchart.csv" },
      ]);
      const CanteenBarChartData = await CSVData([
        { file: "./data/canteenbarchart.csv" },
      ]);
      const CanteenLineChartData = await CSVData([
        { file: "./data/canteenlinechart.csv" },
      ]);
      const LibraryLineChartData = await CSVData([
        { file: "./data/librarylinechart.csv" },
      ]);
      const LibraryDotChartData = await CSVData([
        { file: "./data/librarydotchart.csv" },
      ]);
      const LibrarybarChartData = await CSVData([
        { file: "./data/librarybarchart.csv" },
      ]);

      // 食堂部分数据使用  
      fetch(`./framework-issues.json`)
        .then((response) => response.text())
        .then((text) => {
          const parsedData = JSON.parse(text, (key, value) =>
            /_at$/.test(key) && value ? new Date(value) : value
          );
          setIssues(parsedData); // 将数据存储到组件状态
        })

      if (containerRef.current) {
        containerRef.current.innerHTML = "";

        const titleElement0 = document.createElement("h3");
        titleElement0.innerText = "体育馆线型图";
        containerRef.current.appendChild(titleElement0);

        containerRef.current.appendChild(StadiumLine(StadiumStockData)); // 体育馆线型图

        const titleElement1 = document.createElement("h3");
        titleElement1.innerText = "体育馆温度时间热图";
        containerRef.current.appendChild(titleElement1);

        containerRef.current.appendChild(StadiumHeatmap(StadiumHeatmapData));

        const titleElement2 = document.createElement("h3");
        titleElement2.innerText = "不同年龄段体育器材的使用情况";
        containerRef.current.appendChild(titleElement2);

        containerRef.current.appendChild(StadiumBarChart(StadiumBarchartData));

        const titleElement3 = document.createElement("h3");
        titleElement3.innerText = "食堂餐饮使用人数统计";
        containerRef.current.appendChild(titleElement3);

        containerRef.current.appendChild(CanteenBarChart(CanteenBarChartData));

        const titleElement4 = document.createElement("h3");
        titleElement4.innerText = "食堂餐饮人员流动情况";
        containerRef.current.appendChild(titleElement4);

        containerRef.current.appendChild(CanteenLineChart(CanteenLineChartData));

        const titleElement5 = document.createElement("h3");
        titleElement5.innerText = "食堂燃料使用情况";
        containerRef.current.appendChild(titleElement5);

        containerRef.current.appendChild(CanteenBurnbownChart(issues));
        const titleElement6 = document.createElement("h3");
        titleElement6.innerText = "图书馆温度变化-折线图";
        containerRef.current.appendChild(titleElement6);

        containerRef.current.appendChild(LibraryLineChart(LibraryLineChartData));

        const titleElement7 = document.createElement("h3");
        titleElement7.innerText = "图书馆温度变化-散点图";
        containerRef.current.appendChild(titleElement7);

        containerRef.current.appendChild(LibraryDotChart(LibraryDotChartData));

        const titleElement8 = document.createElement("h3");
        titleElement8.innerText = "图书馆图书使用情况";
        containerRef.current.appendChild(titleElement8);

        containerRef.current.appendChild(LibraryBarChart(LibrarybarChartData));
      }
    }

    fetchAndRenderChart();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div>
      <h3>大学食堂</h3>
      <div ref={containerRef} style={{ width: "100%", height: "500px" }} />
    </div>
  );
}
