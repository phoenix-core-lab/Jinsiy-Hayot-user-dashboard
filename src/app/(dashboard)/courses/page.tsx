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
      <div className="w-full mx-auto h-full lg:p-2">
        <h1 className="text-[24px] font-bold mb-2">
          Sizda hali kurs yo&apos;q !
        </h1>
      </div>
    );
  }

  return null;
};

export default CoursesPage;
