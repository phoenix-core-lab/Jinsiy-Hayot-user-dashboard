"use client";
import { CourseCard } from "@/components/CourseCard/CourseCard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/userStore";
import { motion } from "framer-motion";

type Course = {
  id: number;
  title: string;
  description: string;
  photoUrls: string[];
};

const DashboardPage = () => {
  const { user } = useUserStore();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const GetCourses = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/courses/bought`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("access_token")}`,
            },
          }
        );
        setCourses(response.data);
      } catch (error: unknown ) {
        console.error("Failed to fetch courses:", error);
      }
    };

    GetCourses();
  }, []);

  return (
    <div className="w-full mx-auto p-2">
      <div className="bg-[#911D00] p-4 rounded-lg mb-3">
        <h1 className="text-[24px] font-bold mb-2">
          Xush kelibsiz {user?.fullName || "Foydalanuvchi"}!
        </h1>
        <p className="text-[16px] font-normal text-[#9CA3AF]">
          Shaxsiy kabinetingizga hush kelibsiz. Bu yerda siz bizning barcha
          xizmatlarimizdan foydalanishingiz mumkin.
        </p>
      </div>

      <div>
        <h1 className="text-[24px] font-bold mb-2">Sotib olingan kurslar</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <motion.li
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }} // поочерёдно
              >
                <CourseCard
                  id={course.id}
                  imageUrl={course.photoUrls[0]}
                  title={course.title}
                  description={course.description}
                />
              </motion.li>
            ))
          ) : (
            <p className="text-gray-500">Sizda hali kurslar yo‘q.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
