"use client";;
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState("TOP");
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const rotateDirection = currentDirection => {
    const directions = ["TOP", "LEFT", "BOTTOM", "RIGHT"];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const highlightColor = isLight ? "#000000" : "hsl(0, 0%, 100%)";
  const transparentColor = isLight ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)";
  const movingMap = {
    TOP: `radial-gradient(20.7% 50% at 50% 0%, ${highlightColor} 0%, ${transparentColor} 100%)`,
    LEFT: `radial-gradient(16.6% 43.1% at 0% 50%, ${highlightColor} 0%, ${transparentColor} 100%)`,
    BOTTOM:
      `radial-gradient(20.7% 50% at 50% 100%, ${highlightColor} 0%, ${transparentColor} 100%)`,
    RIGHT:
      `radial-gradient(16.2% 41.199999999999996% at 100% 50%, ${highlightColor} 0%, ${transparentColor} 100%)`,
  };

  const highlight =
    `radial-gradient(75% 181.15942028985506% at 50% 50%, ${isLight ? '#000000' : '#3275F8'} 0%, ${transparentColor} 100%)`;

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);
  return (
    <Tag
      onMouseEnter={(event) => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border  content-center bg-black/20 hover:bg-black/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}>
      <div
        className={cn(`w-auto z-10 px-4 py-2 rounded-[inherit] ${isLight ? 'text-black' : 'text-white'}`, className)}>
        {children}
      </div>
      <motion.div
        className={cn("flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]")}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered
            ? [movingMap[direction], highlight]
            : movingMap[direction],
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }} />
      <div className={`absolute z-1 flex-none inset-[2px] rounded-[100px] ${isLight ? 'bg-white' : 'bg-black'}`} />
    </Tag>
  );
}
