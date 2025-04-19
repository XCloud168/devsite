"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// 定义气泡数据类型
interface BubbleData {
  name?: string;
  radius: number;
  color?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  imageUrl: string;
  label1?: string;
  label2?: string;
  label3?: string;
  labelColor?: string;
}

interface BubbleChartProps {
  data: BubbleData[];
  width?: number;
  height?: number;
  speed?: number;
}

const BubbleChart: React.FC<BubbleChartProps> = ({
  data,
  width = 800,
  height = 600,
  speed = 4,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!data || data.length === 0) return;

    console.log("BubbleChart useEffect triggered", { data });

    // 清空 SVG
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // 设置 SVG 属性
    svg.attr("width", width).attr("height", height);

    // 初始化气泡位置和速度
    data.forEach((d) => {
      d.x = Math.random() * width;
      d.y = Math.random() * height;
      d.vx = (Math.random() - 0.5) * speed;
      d.vy = (Math.random() - 0.5) * speed;
    });

    // 定义 clipPath 用于圆形裁剪（图片和半圆）
    const defs = svg.append("defs");
    defs
      .selectAll(".clip")
      .data(data)
      .enter()
      .append("clipPath")
      .attr("id", (d, i) => `clip-${i}`)
      .append("circle")
      .attr("r", (d) => d.radius);

    defs
      .selectAll(".semi-clip")
      .data(data)
      .enter()
      .append("clipPath")
      .attr("id", (d, i) => `semi-clip-${i}`)
      .append("circle")
      .attr("r", (d) => d.radius);

    // 创建气泡（使用 <g> 包含 circle、image、半圆和标签）
    const bubbles = svg
      .selectAll(".bubble")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bubble")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    // 添加圆形气泡
    bubbles
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => d.color || "rgba(0, 123, 255, 0.6)")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    // 添加图片（内嵌在气泡中，应用 clipPath）
    bubbles
      .append("image")
      .attr("xlink:href", (d) => {
        console.log(`Loading image: ${d.imageUrl}`);
        return d.imageUrl;
      })
      .attr("width", (d) => d.radius * 2)
      .attr("height", (d) => d.radius * 2)
      .attr("x", (d) => -d.radius)
      .attr("y", (d) => -d.radius)
      .attr("clip-path", (d, i) => `url(#clip-${i})`)
      .attr("preserveAspectRatio", "xMidYMid slice")
      .on("error", function () {
        console.warn(
          `Image failed to load: ${d3.select(this).attr("xlink:href")}`,
        );
        d3.select(this).remove();
      });

    // 添加黑色半圆区域（气泡下半部分）
    bubbles
      .append("path")
      .attr("d", (d) => {
        const r = d.radius;
        return `
          M -${r} 0
          A ${r} ${r} 0 0 0 ${r} 0
        `;
      })
      .attr("fill", "rgba(0, 0, 0, 0.5)")
      .attr("clip-path", (d, i) => `url(#semi-clip-${i})`);

    // 添加3行文本标签（10px，位于黑色半圆内）
    bubbles
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", (d) => d.labelColor || "#fff")
      .attr("font-size", "10px")
      .attr("y", 12)
      .text((d) => d.label1 || "");

    bubbles
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", (d) => d.labelColor || "#fff")
      .attr("font-size", "10px")
      .attr("y", 24)
      .text((d) => d.label2 || "");

    bubbles
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", (d) => d.labelColor || "#fff")
      .attr("font-size", "10px")
      .attr("y", 36)
      .text((d) => d.label3 || "");

    // 网格分区碰撞检测
    const gridSize = 100;
    const gridCols = Math.ceil(width / gridSize);
    const gridRows = Math.ceil(height / gridSize);

    const detectCollisions = () => {
      // 初始化网格
      const grid: BubbleData[][][] = Array.from({ length: gridRows }, () =>
        Array.from({ length: gridCols }, () => []),
      );

      // 将气泡分配到网格
      data.forEach((d) => {
        const col = Math.floor(d.x / gridSize);
        const row = Math.floor(d.y / gridSize);
        if (col >= 0 && col < gridCols && row >= 0 && row < gridRows) {
          grid[row][col].push(d);
        }
      });

      // 检查相邻网格的碰撞
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const currentGrid = grid[row][col];
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nRow = row + dr;
              const nCol = col + dc;
              if (
                nRow >= 0 &&
                nRow < gridRows &&
                nCol >= 0 &&
                nCol < gridCols
              ) {
                const neighborGrid = grid[nRow][nCol];
                currentGrid.forEach((d1) => {
                  neighborGrid.forEach((d2) => {
                    if (d1 !== d2) {
                      const dx = d2.x - d1.x;
                      const dy = d2.y - d1.y;
                      const distance = Math.sqrt(dx * dx + dy * dy);
                      const minDist = d1.radius + d2.radius;

                      if (distance < minDist) {
                        const angle = Math.atan2(dy, dx);
                        const sin = Math.sin(angle);
                        const cos = Math.cos(angle);

                        const tempVx = d1.vx;
                        const tempVy = d1.vy;
                        d1.vx = d2.vx * cos + d2.vy * sin;
                        d1.vy = d2.vy * cos - d2.vx * sin;
                        d2.vx = tempVx * cos + tempVy * sin;
                        d2.vy = tempVy * cos - tempVx * sin;

                        const overlap = minDist - distance;
                        const pushX = (overlap * dx) / distance / 2;
                        const pushY = (overlap * dy) / distance / 2;
                        d1.x -= pushX;
                        d1.y -= pushY;
                        d2.x += pushX;
                        d2.y += pushY;
                      }
                    }
                  });
                });
              }
            }
          }
        }
      }
    };

    // 动画循环（限制帧率）
    const targetFrameTime = 1000 / 30; // 30 FPS
    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTimeRef.current < targetFrameTime) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = timestamp;

      // 更新位置
      data.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;

        // 边界反弹
        if (d.x - d.radius < 0) {
          d.x = d.radius;
          d.vx = Math.abs(d.vx);
        } else if (d.x + d.radius > width) {
          d.x = width - d.radius;
          d.vx = -Math.abs(d.vx);
        }
        if (d.y - d.radius < 0) {
          d.y = d.radius;
          d.vy = Math.abs(d.vy);
        } else if (d.y + d.radius > height) {
          d.y = height - d.radius;
          d.vy = -Math.abs(d.vy);
        }
      });

      // 处理碰撞
      detectCollisions();

      // 更新气泡位置
      bubbles.attr("transform", (d) => `translate(${d.x}, ${d.y})`);

      // 更新 clipPath 位置（合并）
      defs
        .selectAll(".clip circle, .semi-clip circle")
        .data(data)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y);

      // 持续动画
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // 启动动画
    animationFrameRef.current = requestAnimationFrame(animate);

    // 清理副作用
    return () => {
      console.log("Cleaning up animation");
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [data, width, height, speed]);

  return <svg ref={svgRef} style={{ background: "transparent" }} />;
};

export default BubbleChart;
