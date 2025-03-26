"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import lightGallery from "lightgallery";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

type GalleryProps = {
  images: string[];
  columns?: number;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  className?: string;
};

export default function Gallery({
  images,
  columns = 3,
  className = "",
}: GalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const lgInstance = useRef<any>(null);

  useEffect(() => {
    if (galleryRef.current && !lgInstance.current) {
      lgInstance.current = lightGallery(galleryRef.current, {
        plugins: [lgThumbnail, lgZoom],
        speed: 500,
        thumbnail: true,
        actualSize: false,
        dynamic: false,
      });
    }

    return () => {
      lgInstance.current?.destroy();
      lgInstance.current = null;
    };
  }, []);

  return (
    <div
      ref={galleryRef}
      className={`grid grid-cols-${columns} gap-4 ${className}`}
    >
      {images.map((image, index) => (
        <a key={index} href={image}>
          <img
            src={image}
            alt={"Gallery Image"}
            className="cursor-pointer rounded-lg object-cover shadow-md"
          />
        </a>
      ))}
    </div>
  );
}
