import React, { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';

export const ObHistogramPlot = ({ Xlabel, Ylabel, Title, data }) => {
  const plotRef = useRef(null);

  useEffect(() => {
    if (plotRef.current) {
      // 使用 Observable Plot 创建直方图
      const plot = Plot.plot({
        marks:[
          Plot.barY(
              data,
              {x:"name",y:"value"}
          )
        ],
        y:{label:Ylabel},
        x:{label:Xlabel},
        height:300,
        width:500,
        title:Title
      });

      // 将图表渲染到ref中
      plotRef.current.appendChild(plot);
      
      // 添加鼠标悬停事件
      const svg = d3.select(plotRef.current).select('svg');
      const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'absolute')
        .style('background', '#f9f9f9')
        .style('padding', '5px')
        .style('border', '1px solid #d9d9d9')
        .style('border-radius', '5px')
        .style('pointer-events', 'none')
        .style('display', 'none');

      svg.selectAll('rect')
        .on('mouseover', function(event, d) {
          d3.select(this).attr('fill', 'orange');
          tooltip.style('display', 'inline')
            .html(`${Ylabel}: ${data[d]['value']}`)
            .style('left', (event.pageX + 5) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          d3.select(this).attr('fill', 'steelblue');
          tooltip.style('display', 'none');
        });

      return () => {
        // 清理旧的图表
        plot.remove();
        tooltip.remove();
      };
    }
  }, [data]);

  return <div ref={plotRef}></div>;
};