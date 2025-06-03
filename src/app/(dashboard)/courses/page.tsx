"use client";
import { useCourseStore } from "@/store/courseStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CoursesPage = () => {
  const router = useRouter();
  const { course } = useCourseStore();

  if (!course?.paid) {
    return (
      <div className="w-full  mx-auto h-full lg:p-2">
        <h1 className="text-[24px] font-bold mb-2">
          Sizda hali kurs yo&apos;q !
        </h1>
      </div>
    );
  }
  useEffect(() => {
    router.push("/courses/1");
  }, [router]);
};

export default CoursesPage;
