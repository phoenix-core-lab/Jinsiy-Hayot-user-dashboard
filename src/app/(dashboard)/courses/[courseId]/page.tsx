import CourseDashboard from "@/components/CourseDashboard/CourseDashboard";
import React from "react";
import { NextPage } from "next";

// Определяем интерфейс с учётом асинхронных параметров
interface Params {
  params: Promise<{ courseId: string }>;
}

// Используем NextPage для типизации компонента и async для обработки Promise
const CoursePage: NextPage<Params> = async ({ params }) => {
  const { courseId } = await params; // Разрешаем Promise
  return <CourseDashboard id={courseId} />;
};

export default CoursePage;