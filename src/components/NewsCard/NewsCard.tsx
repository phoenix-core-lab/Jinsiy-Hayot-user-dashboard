import { MoveDownRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { News } from "../layout/NewsSidebar/NewsSidebar";
import Link from "next/link";

const NewsCard = ({ description, photoUrl, createdAt, mainUrl }: News) => {
  const registerDate = new Date(createdAt).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tashkent",
  });
  return (
    <div className="bg-[#300100] rounded-lg  border-gray-500 p-[10px] w-[270px]">
      <div className="mb-2">
        <Image
          className="w-[100%] h-[130px] rounded-lg object-cover"
          width={200}
          height={200}
          src={`${process.env.NEXT_PUBLIC_API_URL}/${photoUrl}`}
          alt=""
        />
      </div>
      <h3 className="text-sm mb-1">{description}</h3>
      <p className="text-sm font-light text-gray-400 mb-1">{registerDate}</p>
      <Link href={mainUrl} className="flex items-center justify-between">
        <span className="text-[#F20700]">Tomosha qilish</span>
        <MoveDownRight color="#F20700" width={20} height={20} />
      </Link>
    </div>
  );
};

export default NewsCard;
