"use client";
import clsx from "clsx";
import Image from "next/image";
import React from "react";


interface VideoCardProps {
  title: string;
  isActive?: boolean;
  id: number;
  onClick?: () => void;
  items: string[];
}

export const VideoMiniCard = ({
  title,
  isActive,
}: VideoCardProps) => {

  return (
    <div
      className={clsx({
        "flex gap-3 cursor-pointer rounded-sm p-1 hover:bg-[#911D00]": true,
        "bg-[#911D00]": isActive,
      })}
    >
      <div className="min-w-[150px] h-[90px] bg-[#484848] rounded-sm relative">
        {/* <span className="absolute left-2 top-2">{id}</span> */}
        <Image
          className="w-[150px] h-[90px] rounded-sm object-cover"
          width={150}
          height={90}
          src="/course.png"
          alt=""
        />
      </div>
      <h3
        className="text-[16px] font-medium  overflow-hidden text-ellipsis"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {title}
      </h3>
    </div>
  );
};
