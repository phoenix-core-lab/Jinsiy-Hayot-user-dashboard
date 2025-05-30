"use client";
import clsx from "clsx";
import { DownloadIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

interface VideoCardProps {
  title: string;
  description: string;
  isActive?: boolean;
  id: number;
  onClick?: () => void;
  items: string[];
}

export const VideoMiniCard = ({
  title,
  description,
  isActive,
  id,
  items,
}: VideoCardProps) => {;

  const handleDownload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/${items[0]}`;
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileUrl.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  };

  return (
    <div
      className={clsx({
        "flex gap-3 cursor-pointer rounded-sm p-1 hover:bg-[#520900]": true,
        "bg-[#520900]": isActive,
      })}
    >
      <div className="w-[160px] h-[90px] bg-[#484848] rounded-sm relative">
        <span className="absolute left-2 top-2">{id}</span>
        <Image
          className="w-[160px] h-[90px] rounded-sm object-cover"
          width={160}
          height={90}
          src="/course.png"
          alt=""
        />
      </div>
      <div>
        <h3 className="text-[18px] font-medium">{title}</h3>
        <p className="leading-[100%] text-sm text-[14px] mb-2">{description}</p>
        <div className="mt-2">
          <Button
            onClick={handleDownload}
            size="sm"
            className="h-8 bg-transparent text-gray-500 hover:text-gray-400 border border-gray-500 rounded-md flex items-center gap-1.5 px-3 transition-colors cursor-pointer"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Dars materiallari</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
