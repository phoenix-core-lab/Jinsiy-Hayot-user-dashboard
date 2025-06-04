"use client";
import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import useSidebarStore from "@/store/sidebar-store";
import { usePathname } from "next/navigation";
import { useCourseStore } from "@/store/courseStore";

const Header = () => {
  const { setOpen } = useSidebarStore();
  const pathname = usePathname();
  const { course, fetchCourse } = useCourseStore();

  useEffect(() => {
    fetchCourse("1");
  }, [fetchCourse]);
  return (
    <header
      className={`bg-[#911D00] ${
        pathname.startsWith("/courses") ? "block" : "block lg:hidden"
      }  `}
    >
      <div className="p-4">
        <div className="flex md:items-center justify-between ">
          <button
            onClick={() => setOpen(true)}
            className=" bg-transparent cursor-pointer hover:bg-transparent"
          >
            <MenuIcon width={25} height={25} />
          </button>
          <Link href="/courses">
            <Image src="/logo.svg" alt="logo" width={111} height={30} />
          </Link>
          <h3 className="hidden lg:block text-lg font-semibold">
            Kurs: {course?.title || "Yuklanmoqda..."}
          </h3>
        </div>
      </div>
    </header>
  );
};

export default Header;
