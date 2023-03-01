import { useEffect, useRef } from "react";
import * as d3 from "d3";

import { ChartPoint } from "./ChartPoint";

type Props = {
  data: ChartPoint[];
  color: string;
};

export function LineChart({ data, color }: Props) {
  const svgRef = useRef<SVGElement>(null);

  useEffect(() => {
    // defining a chart svg
    const width = 1000;
    const height = 300;
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // creating X and Y scales
    const xScale = d3.scaleLinear().domain([0, 180]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 2]).range([height, 0]);

    // creating the auxiliary lines
    const xAxisLine = svg
      .append("g")
      .append("rect")
      .attr("class", "dotted")
      .attr("stroke-width", "1px");
    const yAxisLine = svg
      .append("g")
      .append("rect")
      .attr("class", "dotted")
      .attr("stroke-height", "1px");

    // defining line generator
    const lineGenerator = d3
      .line<ChartPoint>()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    // adding the line chart
    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("d", lineGenerator)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    let xAxis = d3.axisBottom(xScale).ticks(10);
    let yAxis = d3.axisLeft(yScale).ticks(5);

    svg.append("g").call(xAxis).attr("transform", `translate(0, ${height})`);
    svg.append("g").call(yAxis);

    // creating data point
    const dataPoint = svg.append("g");

    // adding data points to the chart
    dataPoint
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", function (d, i) {
        return xScale(d.x);
      })
      .attr("cy", function (d, i) {
        return yScale(d.y);
      })
      .attr("r", 5)
      .style("fill", "black")
      // adding on hover event to project auxiliary lines
      .on("mouseenter", (e, d) => {
        xAxisLine
          .attr("width", xScale(d.x))
          .attr("height", "1px")
          .attr("x", 0)
          .attr("y", yScale(d.y));

        yAxisLine
          .attr("width", "1px")
          .attr("height", height - yScale(d.y))
          .attr("x", xScale(d.x))
          .attr("y", yScale(d.y));
      })
      .on("mouseleave", (_, d) => {
        xAxisLine.attr("width", 0).attr("height", 0).attr("x", 0).attr("y", 0);
        yAxisLine.attr("width", 0).attr("height", 0).attr("x", 0).attr("y", 0);
      });

    // creating grids
    const yGridLines = d3
      .axisBottom(xScale)
      .tickFormat(() => "")
      .tickSize(height)
      .ticks(5);

    const xGridLines = d3
      .axisLeft(yScale)
      .tickFormat(() => "")
      .tickSize(-width)
      .ticks(5);

    // adding grids
    svg.append("g").attr("class", "main-grid").call(yGridLines);
    svg.append("g").attr("class", "main-grid").call(xGridLines);

  }, [data]);

  return (
    <div
      className="wrapper"
      style={{
        backgroundColor: color,
        transition: "background-color 0.5s ease",
      }}
    >
      <svg className="svg" ref={svgRef as any}></svg>
    </div>
  );
}
