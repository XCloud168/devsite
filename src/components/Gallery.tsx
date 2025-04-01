"use client";

import React, { useState } from "react";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

type GalleryProps = {
  images: string[];
  imageHeight?: number;
  className?: string;
};

export default function ImageGallery({
  images,
  imageHeight = 200,
  className = "",
}: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null);

  // 响应式 Masonry 网格
  const breakpointColumns = {
    default: 4, // 默认 4 列
    1024: 3, // 1024px 以下 3 列
    768: 2, // 768px 以下 2 列
    480: 1, // 480px 以下 1 列
  };

  return (
    <div className={className}>
      {/* 瀑布流布局 */}
      <Masonry breakpointCols={breakpointColumns} className="flex gap-4">
        {images.map((image, idx) => (
          <div key={idx} className="mb-4" onClick={() => setIndex(idx)}>
            <img
              src={image}
              alt={`Thumbnail ${idx}`}
              className="cursor-pointer rounded-lg object-cover shadow-md"
              style={{ height: `${imageHeight}px`, width: "100%" }}
            />
          </div>
        ))}
      </Masonry>

      {/* 预览 Lightbox */}
      {index !== null && (
        <Lightbox
          slides={images.map((src) => ({ src }))}
          open={true}
          index={index}
          close={() => setIndex(null)}
          plugins={[Thumbnails]}
        />
      )}
    </div>
  );
}
