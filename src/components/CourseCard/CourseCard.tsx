"use client";

import { MoveRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export function CourseCard({
  id,
  title,
  description,
  imageUrl,
}: CourseCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const openCourse = () => {
    router.push(`/courses/${id}`);
  };

  return (
    <div
      className="relative overflow-hidden rounded-2xl transition-all duration-500 w-[300px] h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient background with glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3d0000] via-[#1e0000] to-[#0a0000] z-0">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/30 via-transparent to-transparent"></div>
      </div>

      {/* Red glow effect that appears on hover */}
      <div
        className={`absolute -inset-1 bg-red-500/20 blur-xl transition-opacity duration-700 ${
          isHovered ? "opacity-70" : "opacity-0"
        } z-0`}
      ></div>

      <div className="relative z-10 p-[10px] h-full flex flex-col">
        {/* Course Image with hover effect */}
        <div className="relative overflow-hidden rounded-xl mb-4 bg-gradient-to-br from-[#2a0000] to-black">
          <div
            className={`absolute inset-0 bg-red-500/10 z-10 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          ></div>
          <Image
            className="w-full object-cover transition-transform duration-700 ease-out h-[220px]"
            src={imageUrl}
            alt={title}
            width={400}
            height={300}
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />

          {/* Subtle red particles effect overlay */}
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] opacity-10 mix-blend-screen"></div>
        </div>

        {/* Course Info */}
        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-xl mb-2 text-white tracking-wide">
            {title}
          </h3>
          <p className="text-sm text-gray-300/80 mb-6 flex-grow">
            {description}
          </p>

          <div className="flex justify-between items-center mt-auto">
            <button
              className="py-2.5 px-8 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:from-red-500 hover:to-red-600 cursor-pointer"
              onClick={openCourse}
            >
              Kurs
            </button>
            <button
              className="p-2 rounded-full transition-all duration-300 hover:bg-red-900/30 group cursor-pointer"
              onClick={openCourse}
              aria-label="Открыть курс"
            >
              <MoveRight className="text-white transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
