import React from "react";
import clsx from "clsx";
import { FileTextIcon } from "lucide-react";
interface PdfLessonCardProps {
  title: string;

  isActive?: boolean;
  id: number;
  onClick?: () => void;
  items: string[];
}
export const PdfLessonCard = ({
  title,

  isActive,
  id,
  items,
}: PdfLessonCardProps) => {
  const handleDownload = async () => {

    // Using a placeholder API URL since we don't have the actual env variable
    const apiUrl = process.env.REACT_APP_API_URL || "https://api.example.com";
    const fileUrl = `${apiUrl}/${items[0]}`;
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrl.split("/").pop() || "document.pdf";
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
      onClick={handleDownload}
      className={clsx({
        "flex gap-3 cursor-pointer rounded-sm p-1 hover:bg-[#09005e]": true,
        "bg-[#09005e]": isActive,
      })}
    >
      <div className="min-w-[160px] h-[90px] bg-[#484848] rounded-sm relative flex items-center justify-center">
        <span className="absolute left-2 top-2">{id}</span>
        <FileTextIcon className="h-12 w-12 text-gray-300" />
        <div className="absolute bottom-2 right-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-sm">
          PDF
        </div>
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
