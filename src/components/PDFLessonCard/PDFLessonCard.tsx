import React from "react";
import clsx from "clsx";
import { DownloadIcon, FileTextIcon } from "lucide-react";
interface PdfLessonCardProps {
  title: string;
  description: string;
  isActive?: boolean;
  id: number;
  onClick?: () => void;
  items: string[];
}
export const PdfLessonCard = ({
  title,
  description,
  isActive,
  id,
  items,
}: PdfLessonCardProps) => {
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
      className={clsx({
        "flex gap-3 cursor-pointer rounded-sm p-1 hover:bg-[#09005e]": true,
        "bg-[#09005e]": isActive,
      })}
    >
      <div className="w-[160px] h-[90px] bg-[#484848] rounded-sm relative flex items-center justify-center">
        <span className="absolute left-2 top-2">{id}</span>
        <FileTextIcon className="h-12 w-12 text-gray-300" />
        <div className="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-sm">
          PDF
        </div>
      </div>
      <div>
        <h3 className="text-[18px] font-medium">{title}</h3>
        <p className="leading-[100%] text-sm text-[14px] mb-2">{description}</p>
        <div className="mt-2">
          <button
            onClick={handleDownload}
            className="h-8 bg-transparent text-gray-500 hover:text-gray-400 border border-gray-500 rounded-md flex items-center gap-1.5 px-3 transition-colors cursor-pointer"
          >
            <DownloadIcon className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">PDF yuklab olish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
