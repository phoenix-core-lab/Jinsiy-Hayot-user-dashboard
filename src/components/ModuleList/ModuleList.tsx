"use client";

import { VideoMiniCard } from "../VideoMiniCard/VideoMiniCard";
import { CommingSoonCard } from "../CommingSoonCard/CommingSoonCard";
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
import { PdfLessonCard } from "../PDFLessonCard/PDFLessonCard";

type ModuleListProps = {
  startIndex?: number; // Optional prop for starting index
  ModuleId: number;
  module: Module;
  lessons: Lesson[];
};

const ModuleList = ({ module, lessons, ModuleId, startIndex }: ModuleListProps) => {
  const { currentVideo, setCurrentVideo } = useCourseStore();

  function updateCurrentVideo(videoUrl: string) {
    console.log(videoUrl, "VideoUrl");

    setCurrentVideo(videoUrl);
    Cookies.set("currentVideo", videoUrl);
  }

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useLayoutEffect(() => {
    const currentVideo = Cookies.get("currentVideo") ?? "";
    if (currentVideo) {
      updateCurrentVideo(currentVideo);
    }
  }, [lessons, updateCurrentVideo]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Accordion type="single" collapsible>
        <AccordionItem value={String(ModuleId)}>
          <AccordionTrigger className="py-2 mb-2 pl-4 bg-[#a8000053]">
            <h1 className="md:text-lg font-medium">
              {module ? module.title : "Yuklanmoqda..."}
            </h1>
          </AccordionTrigger>

          <AccordionContent
            className="space-y-2"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "thin",
              scrollbarColor: "#520900 #300100",
            }}
          >
            {lessons.map(
              (item, index) =>
                module.title !== "Bonus materiallar" && (
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
                      index={startIndex !== undefined ? startIndex + index : index}
                      id={item.id}
                      title={item.title}
                      isActive={item.videoUrl === currentVideo}
                      items={item.items}
                    />
                  </motion.div>
                )
            )}

            {module.title === "Bonus materiallar" && 
              module.lessons.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="cursor-pointer"
                  role="listitem"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <PdfLessonCard
                    id={item.id}
                    title={item.title}
                    isActive={item.videoUrl === currentVideo}
                    items={item.items}
                  />
                </motion.div>
              ))
            }

            {module.title === "Bonus materiallar" && <motion.div
                  className="cursor-pointer"
                  role="listitem"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1 * 0.05, duration: 0.3 }}
                >
                  <CommingSoonCard/>
                </motion.div>
            }
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
};

export default ModuleList;
