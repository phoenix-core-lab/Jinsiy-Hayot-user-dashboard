"use client";
import { useCourseStore } from "@/store/courseStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CoursesPage = () => {
  const router = useRouter();
  const { course } = useCourseStore();

  useEffect(() => {
    if (course?.paid) {
      router.push("/courses/1");
    }
  }, [course, router]);

  if (!course?.paid) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-center mt-10">
          Siz kursni sotib olmadingiz
        </h1>
        <p className="text-center mt-4">
          Kursga kirish uchun avval uni sotib olishingiz kerak.
        </p>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push("https://jinsiy-hayot.org/payment")}
            type="button"
            className="px-6 py-2 bg-[#730000] text-white rounded hover:bg-[#CC1F00] transition"
          >
            Kursni sotib olish
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CoursesPage;
