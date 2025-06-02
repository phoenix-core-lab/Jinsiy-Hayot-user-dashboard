"use client";

import { VideoMiniCard } from "../VideoMiniCard/VideoMiniCard";
import { useCourseStore } from "@/store/courseStore";
import { Module, Lesson } from "@/store/courseStore";
import { motion, useInView } from "framer-motion";
import { useRef, useLayoutEffect } from "react";
import Cookies from "js-cookie";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BonusVideoCard } from "../BonusVideoCard/BonusVideoCard";
import { PdfLessonCard } from "../PDFLessonCard/PDFLessonCard";
type ModuleListProps = {
  ModuleId: number;
  module: Module;
  lessons: Lesson[];
};

const ModuleList = ({ module, lessons }: ModuleListProps) => {
  const { currentVideo, setCurrentVideo } = useCourseStore();

  function updateCurrentVideo(videoUrl: string) {
    setCurrentVideo(videoUrl);
    console.log(videoUrl);
    Cookies.set("currentVideo", videoUrl);
  }

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useLayoutEffect(() => {
    const currentVideo = Cookies.get("currentVideo") ?? "";
    if (currentVideo) {
      console.log(currentVideo);
      updateCurrentVideo(currentVideo);
    }
  }, [lessons]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="p-5 pt-2 pl-2 lg:pl-0">
            <h1 className="md:text-xl xl:text-2xl font-medium">
              {module ? module.title : "Yuklanmoqda..."}
            </h1>
            <p className="font-medium text-gray-400">{module.time}</p>
          </AccordionTrigger>

          <AccordionContent
            className="space-y-2"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "thin",
              scrollbarColor: "#520900 #300100",
            }}
          >
            {lessons.map((item, index) => (
              <motion.div
                key={item.id}
                onClick={() =>
                  item.videoUrl && updateCurrentVideo(item.videoUrl)
                }
                className="cursor-pointer"
                role="listitem"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <VideoMiniCard

                  id={item.id}
                  title={item.title}
                  description={item.description || "Dars haqida ma'lumot"}
                  isActive={item.videoUrl === currentVideo}
                  items={item.items}
                />
              </motion.div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
};

export default ModuleList;
