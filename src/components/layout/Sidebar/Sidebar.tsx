"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import clsx from "clsx";
import {
  BookOpenIcon,

  LogOut,
  SettingsIcon,
  SquareArrowOutUpRight,
} from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/userStore";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, fetchUser } = useUserStore();
  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <aside
      className={clsx(
        "bg-[#911D00] transition-all duration-300 w-[320px] p-[10px] hidden  flex-col justify-between",
        pathname.startsWith("/courses")
          ? "md:hidden h-[calc(100vh-83px)]"
          : "h-[100vh] lg:flex"
      )}
    >
      <div>
        <Link className="px-4 py-2 block" href="/dashboard">
          <Image src="/logo.svg" alt="logo" width={111} height={30} />
        </Link>
        <ul className="flex flex-col gap-1 mt-4">
          {/* <li>
            <Link
              href="/dashboard"
              className={clsx(
                "px-4 py-2 rounded hover:bg-[#F73100]/30 flex items-center gap-4 font-medium",
                pathname === "/dashboard" && "bg-[#F73100]/30 font-bold"
              )}
            >
              <HomeIcon height={20} width={20} />
              Asosiy
            </Link>
          </li> */}
          <li>
            <Link
              href="/courses"
              className={clsx(
                "px-4 py-2 rounded hover:bg-[#F73100]/30 flex items-center gap-4 font-medium",
                pathname.startsWith("/courses") && "bg-[#F73100]/30 font-bold"
              )}
            >
              <BookOpenIcon width={20} height={20} />
              Kurs
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className={clsx(
                "px-4 py-2 rounded hover:bg-[#F73100]/30 flex items-center gap-4 font-medium",
                pathname === "/settings" && "bg-[#F73100]/30 font-bold"
              )}
            >
              <SettingsIcon width={20} height={20} />
              Sozlama
            </Link>
          </li>
          <li>
            <Link
              href="https://jinsiy-hayot.org"
              className={clsx(
                "px-4 py-2 rounded hover:bg-[#F73100]/30 flex items-center gap-4 font-medium"
              )}
            >
              <SquareArrowOutUpRight width={20} height={20} />
              Saytga o&apos;tish
            </Link>
          </li>
        </ul>
      </div>

      {/* Bottom user section */}
      <div className="userInfo flex items-center justify-between px-4 py-0 rounded">
        <div className="userInfoWrapper flex items-center gap-3">
          <div className="userIcon bg-[#F73100]/30 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
            {user ? getInitials(user.fullName) : "?"}
          </div>
          <div>
            <h3 className="userInfoTitle text-white text-sm font-semibold">
              {user?.fullName || "Yuklanmoqda..."}
            </h3>
            <p className="userInfoText text-gray-300 text-xs">
              {user?.phoneNumber || ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            Cookies.remove("access_token");
            router.replace("/");
          }}
          className="cursor-pointer w-8 h-8"
          title="Chiqish"
        >
          <LogOut className="hover:text-[#ce3737] text-red-100" size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
