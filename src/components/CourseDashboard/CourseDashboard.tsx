"use client";

import { useEffect, useState } from "react";
import ModuleList from "../ModuleList/ModuleList";
import { useCourseStore } from "@/store/courseStore";
import { motion } from "framer-motion"; // ✅ Framer Motion
import { CommentsSection } from "../CommentsSection/CommentsSection";
import { MobileComments } from "../MobileComments/MobileComments";

const CourseDashboard = ({ id }: { id: string }) => {
  const { course, currentVideo, error, fetchCourse } = useCourseStore();
  const [viewers, setViewers] = useState(0);
  useEffect(() => {
    fetchCourse(id);
  }, [id, fetchCourse]);

  useEffect(() => {
    const updateViewers = () => {
      const min = 2700;
      const max = 3100;
      const randomViewers = Math.floor(Math.random() * (max - min + 1)) + min;
      setViewers(randomViewers);
    };

    updateViewers(); // начальное значение
    const interval = setInterval(updateViewers, 5000); // обновлять каждые 5 секунд

    return () => clearInterval(interval); // очистка при размонтировании
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!course) {
    return <div className="p-4">Yuklanmoqda...</div>;
  }

  return (
    <div className="flex flex-col w-full gap-3 lg:flex-row mx-auto h-full lg:p-2">
      <div className="lg:w-[75%]">
        <motion.div
          className="sticky top-0 z-50 bg-black lg:static lg:rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="aspect-video w-full">
            <video
              src={`${process.env.NEXT_PUBLIC_API_URL}/${currentVideo}`}
              key={currentVideo}
              controlsList="nodownload"
              onContextMenu={(e) => e.preventDefault()}
              poster={course.photoUrls?.[0] || "/placeholder.jpg"}
              controls
              className="w-full h-full lg:rounded-lg object-cover bg-[#911D00]"
            >
              <source
                src={`${process.env.NEXT_PUBLIC_API_URL}/${currentVideo}`}
                type="video/mp4"
              />
            </video>
          </div>
        </motion.div>

        <motion.div
          className="mb-0 pl-2 pb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="mb-1 md:mb-4 flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-medium ">
              Dars nomi: {course.modules?.[0]?.title || "N/A"}
            </h2>
            <div className="flex items-center gap-2  px-4 py-2 rounded-full text-white shadow-lg">
              <div className="flex items-center gap-2">
                <span className="font-medium">{viewers}</span>
                <span className="text-sm text-gray-300">tomoshabinlar</span>
              </div>
              <div className="relative ml-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                <div className="absolute -inset-0.5 rounded-full bg-red-500/30 animate-[ping_1.5s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
          {/* <h3 className="text-lg md:text-xl font-medium mb-2 text-[#B0B0B0]">
            Kurs nomi: {course.title}
          </h3> */}
          <p className="text-[#B0B0B0]">Muallif: {course.author}</p>
          <p className="mb-2 lg:mb-4 text-[#B0B0B0]">
            Davomiyligi: {course.time}
          </p>
          <p className="text-[#B0B0B0]">{course.description}</p>
        </motion.div>

        <div className="pl-[8px] hidden lg:block">
          <CommentsSection videoId={"video-1"} />
        </div>
        <MobileComments videoId={"video-1"} />
        <div className="lg:hidden mt-3 mb-3 flex flex-col gap-1 px-2">
          {course.modules.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <ModuleList
                ModuleId={item.id}
                module={item}
                lessons={item.lessons}
                defaultOpen={index === 0}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div
        className="hidden lg:flex lg:w-[25%] h-full  text-white overflow-y-auto  flex-col gap-1"
        style={{
          scrollBehavior: "smooth",
          scrollbarWidth: "thin",
          scrollbarColor: "#520900 #300100",
        }}
      >
        {course.modules.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <ModuleList
              ModuleId={item.id}
              module={item}
              lessons={item.lessons}
              defaultOpen={index === 0}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CourseDashboard;
