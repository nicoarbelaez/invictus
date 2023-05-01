'use client';

import ArrowCarousel from "./Change";
import {useState} from "react";
import Image from "next/image";

function Body() {
  const images = ["presentation_1.jpeg", "presentation_2.jpeg", "presentation_3.jpeg"];

  const [loadImage, setLoadImage] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const selectedNesImage = (index: number, images: string[], next = true) => {
    setLoadImage(false);
    setTimeout(() => {
      const condition = next ? selectedIndex < images.length - 1 : selectedIndex > 0;
      const nextIndex = next
        ? condition
          ? selectedIndex + 1
          : 0
        : condition
        ? selectedIndex - 1
        : images.length - 1;
      setSelectedImage(images[nextIndex]);
      setSelectedIndex(nextIndex);
    }, 200);
  };

  const previous = () => {
    selectedNesImage(selectedIndex, images, false);
  };

  const next = () => {
    selectedNesImage(selectedIndex, images, true);
  };

  return (
    <>
      <div className="relative overflow-hidden">
        <div
          className={`${
            loadImage ? "opacity-100" : "opacity-0"
          } h-[500px] w-full object-cover transition-all duration-200`}>
          <Image
            src={`/img/${selectedImage}`}
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
            alt={selectedImage}
            onLoad={() => setLoadImage(true)}
          />
        </div>
        <ArrowCarousel funct={{next, previous}}/>
        <ArrowCarousel nextCarousel={false} funct={{next, previous}}/>
      </div>
    </>
  );
}

export default Body;
