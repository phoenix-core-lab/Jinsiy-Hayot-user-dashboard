import React from "react";
import clsx from "clsx";
import { DownloadIcon, StarIcon } from "lucide-react";
import Image from "next/image";
interface BonusVideoCardProps {
  title: string;
  description: string;
  isActive?: boolean;
  id: number;
  onClick?: () => void;
  items: string[];
}
export const BonusVideoCard = ({
  title,
  description,
  isActive,
  id,
  items,
}: BonusVideoCardProps) => {
  const handleDownload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // Using a placeholder API URL since we don't have the actual env variable
    const apiUrl = process.env.REACT_APP_API_URL || "https://api.example.com";
    const fileUrl = `${apiUrl}/${items[0]}`;
    try {
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
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  return (
    <div
      className={clsx({
        "flex gap-3 cursor-pointer rounded-sm p-1 hover:bg-[#005209]": true,
        "bg-[#005209]": isActive,
      })}
    >
      <div className="w-[160px] h-[90px] bg-[#484848] rounded-sm relative">
        <div className="absolute left-2 top-2 flex items-center gap-1">
          <StarIcon className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          <span>{id}</span>
        </div>
        <div className="absolute top-0 right-0 bg-yellow-500 text-xs font-bold px-2 py-0.5 rounded-bl-sm">
          BONUS
        </div>
        <Image
          width={160}
          height={90}
          className="w-[160px] h-[90px] rounded-sm object-cover"
          src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
          alt="Bonus video thumbnail"
        />
      </div>
      <div>
        <h3 className="text-[18px] font-medium">{title}</h3>
        <p className="leading-[100%] text-sm text-[14px] mb-2">{description}</p>
 
      </div>
    </div>
  );
};
