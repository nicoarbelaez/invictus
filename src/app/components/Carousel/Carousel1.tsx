"use client";

import Change from "./Change";
import { useState, useEffect } from "react";
import Image from "next/image";

function Body() {
  const images = ["presentation_1.jpeg", "presentation_2.jpeg", "presentation_3.jpeg"];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndex1, setSelectedIndex1] = useState(1);

  const [transLeft, setTransLeft] = useState(false);
  const [transRight, setTransRight] = useState(false);

  useEffect(() => {
    if (transLeft) {
      setTimeout(() => {
        setTransLeft(false);
        setSelectedIndex((selectedIndex + 1) % images.length);
        setSelectedIndex1((selectedIndex1 + 1) % images.length);
      }, 300);
    }
  }, [images.length, selectedIndex, selectedIndex1, transLeft]);

  const previous = () => {
    setTransLeft(false);
    setTransRight(true);

    const index = selectedIndex - 1;
    const index1 = selectedIndex1 - 1;

    setSelectedIndex(index < 0 ? images.length - 1 : index);
    setSelectedIndex1(index1 < 0 ? images.length - 1 : index1);
  };

  const next = () => {
    setTransLeft(true);
    setTransRight(false);
  };

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="relative h-[500px] w-full">
          <Image
            className={`${
              transLeft
                ? "-translate-x-full transform transition duration-300 ease"
                : transRight
                ? "animate-slideLeft"
                : ""
            } absolute z-20 h-full w-full object-contain`}
            src={`/img/${images[selectedIndex]}`}
            width={1920}
            height={1080}
            alt={images[selectedIndex]}
          />
          <Image
            className={`${
              transLeft
                ? "animate-slideRight"
                : transRight
                ? "translate-x-full transform transition duration-300 ease"
                : ""
            } absolute z-0 h-full w-full object-contain`}
            src={`/img/${images[selectedIndex1]}`}
            width={1920}
            height={1080}
            alt={images[selectedIndex1]}
          />
        </div>
        <Change funct={{ next, previous }} />
        <Change nextCarousel={false} funct={{ next, previous }} />
      </div>
    </>
  );
}

export default Body;
