"use client";

import React, { useState } from "react";
import Masonry from "react-masonry-css";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

type GalleryProps = {
  images: string[];
  className?: string;
};

export default function ImageGallery({ images, className = "" }: GalleryProps) {
  const [index, setIndex] = useState<number | null>(null);

  const breakpointColumns = {
    default: 4,
    1024: 3,
    768: 2,
    480: 1,
  };

  return (
    <div className={className}>
      <Masonry breakpointCols={breakpointColumns} className="flex gap-4">
        {images.map((image, idx) => (
          <div key={idx} className="mb-4" onClick={() => setIndex(idx)}>
            <img
              src={image}
              alt={`Thumbnail ${idx}`}
              className="max-h-[200px] w-full cursor-pointer rounded-lg object-cover shadow-md"
            />
          </div>
        ))}
      </Masonry>
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
