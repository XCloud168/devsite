// components/RandomShapes.tsx
import { useEffect, useState } from "react";

// 生成随机颜色
const getRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
};

// 生成随机多边形的顶点
const generateRandomPolygon = (sides: number) => {
  const radius = 6; // 半径
  const centerX = 6;
  const centerY = 6;
  const points: string[] = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides; // 每个顶点的角度
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return points.join(" ");
};

// 生成多波峰的波浪线路径
const generateWavePath = () => {
  // 创建多个波峰和波谷
  let path = "M0,6"; // 起始点
  const waveCount = 3; // 波浪的数量，控制波浪的波峰波谷个数
  const waveLength = 4; // 控制每个波的宽度

  for (let i = 0; i < waveCount; i++) {
    const controlX = (i + 1) * waveLength; // 控制点X坐标
    const controlY = i % 2 === 0 ? 0 : 12; // 波峰和波谷的控制点Y坐标（交替高低）
    const endX = (i + 1) * waveLength * 2; // 波浪结束的X坐标

    // 二次贝塞尔曲线（Q）进行波浪绘制
    path += ` Q${controlX},${controlY} ${endX},6`; // 添加波浪线段
  }

  return path;
};

const RandomShapes = () => {
  const [shapes, setShapes] = useState<
    {
      x: number;
      y: number;
      type: "polygon" | "wave";
      sides?: number;
      color: string;
    }[]
  >([]);

  // 随机生成多边形或波浪线
  useEffect(() => {
    const generateRandomShapes = () => {
      const shapeCount = 20; // 随机生成10个图标
      const shapesArray: {
        x: number;
        y: number;
        type: "polygon" | "wave";
        sides?: number;
        color: string;
      }[] = [];

      for (let i = 0; i < shapeCount; i++) {
        const type = Math.random() > 0.5 ? "polygon" : "wave"; // 随机选择多边形或波浪线
        const color = getRandomColor(); // 随机颜色
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        if (type === "polygon") {
          const sides = Math.floor(Math.random() * 6) + 3; // 随机选择多边形的边数，至少3个边（三角形）
          shapesArray.push({ x, y, type, sides, color });
        } else {
          shapesArray.push({ x, y, type, color });
        }
      }

      setShapes(shapesArray);
    };

    generateRandomShapes();
  }, []);

  return shapes.map((shape, index) => {
    if (shape.type === "polygon" && shape.sides) {
      return (
        <svg
          key={`polygon-${index}`} // Add a unique key
          width="12"
          height="12"
          className="absolute z-0"
          style={{ left: `${shape.x}px`, top: `${shape.y}px` }}
        >
          <polygon
            points={generateRandomPolygon(shape.sides)}
            fill={shape.color}
          />
        </svg>
      );
    } else {
      return (
        <svg
          key={`wave-${index}`} // Add a unique key
          width="12"
          height="12"
          className="absolute z-0"
          style={{ left: `${shape.x}px`, top: `${shape.y}px` }}
        >
          <path
            d={generateWavePath()}
            fill="transparent"
            stroke={shape.color}
            strokeWidth="1"
          />
        </svg>
      );
    }
  });
};

export default RandomShapes;
