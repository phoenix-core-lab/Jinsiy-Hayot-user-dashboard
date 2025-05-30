"use client";

import NewsCard from "@/components/NewsCard/NewsCard";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // ✅ импорт анимации

export type News = {
  id: number;
  title: string;
  description: string;
  photoUrl: string;
  mainUrl: string;
  createdAt: string;
};

export const NewsSidebar = () => {
  const [news, setNews] = useState<News[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const GetNews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/news`
        );
        setNews(response.data);
      } catch (error: unknown ) {
        console.error("Failed to fetch news:", error);
      }
    };

    GetNews();
  }, []);

  if (!pathname.startsWith("/dashboard")) return null;

  return (
    <div className="h-full overflow-y-visible transition-all duration-300 pr-[10px] py-[10px]">
      <div className="space-y-2 grid justify-center grid-cols-1 sm:grid-cols-2 gap-3 md:grid-cols-3 lg:block">
        {news.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative"
          >
            <NewsCard {...item} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
