// src/store/courseStore.ts
import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

export type Lesson = {
  id: number;
  title: string;
  time: string;
  price: number;
  videoUrl?: string;
  description?: string; // For VideoMiniCard
  items: string[];
};

export type Module = {
  id: number;
  title: string;
  time: string;
  price: number;
  lessons: Lesson[];
};

export type CourseSingle = {
  id: number;
  title: string;
  description: string;
  photoUrls: string[];
  time: string;
  price: number;
  author: string;
  modules: Module[];
  paid: boolean;
};

type CourseState = {
  course: CourseSingle | null;
  currentVideo: string;
  error: string | null;
  fetchCourse: (id: string) => Promise<void>;
  setCurrentVideo: (videoUrl: string) => void;
};
// const mockCourse: CourseSingle = {
//   id: 1,
//   title: "Пример курса",
//   description: "Это демонстрационный курс с модулями и уроками.",
//   photoUrls: ["/course-image.jpg"],
//   time: "70 ч.",
//   price: 199,
//   author: "Иван Иванов",
//   paid: true,
//   modules: Array.from({ length: 7 }, (_, moduleIndex) => ({
//     id: moduleIndex + 1,
//     title: `Modul ${moduleIndex + 1}`,
//     time: "10 ч.",
//     price: 29,
//     lessons: Array.from({ length: 10 }, (_, lessonIndex) => ({
//       id: lessonIndex + 1,
//       title: `Урок ${lessonIndex + 1}`,
//       time: "1 ч.",
//       price: 5,
//       videoUrl: `/videos/module${moduleIndex + 1}_lesson${lessonIndex + 1}.mp4`,
//       description: `Описание для урока ${lessonIndex + 1}`,
//       items: ["Материал 1", "Материал 2", "Материал 3"],
//     })),
//   })),
// };

export const useCourseStore = create<CourseState>((set) => ({
  course: null,
  currentVideo: "/",
  error: null,
  fetchCourse: async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/bought/${id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      set({
        course: response.data,
        currentVideo: response.data.modules?.[0]?.lessons?.[0]?.videoUrl || "/",
        error: null,
      });
    } catch (error: unknown) {
      console.error("Failed to fetch course", error);
      set({ error: "Failed to load course data. Please try again." });
    }
    // set({
    //   course: mockCourse,
    //   currentVideo: mockCourse.modules[0].lessons[0].videoUrl || "/",
    //   error: null,
    // });
  },
  setCurrentVideo: (videoUrl: string) => set({ currentVideo: videoUrl }),
}));
