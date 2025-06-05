"use client";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import useSidebarStore from "@/store/sidebar-store";
import { cn } from "@/lib/utils"; // если у тебя есть функция объединения классов
import Image from "next/image";
import {
  BookOpenIcon,
  LogOut,
  SettingsIcon,
  SquareArrowOutUpRight,
  XIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";


const MobileDrawer = () => {
  const { setOpen, isOpen } = useSidebarStore();
  const pathname = usePathname();
  const { user, fetchUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Drawer open={isOpen} onOpenChange={setOpen} direction="left">
      {/* <DrawerTrigger asChild>
        <Button variant="outline">Open Sidebar</Button>
      </DrawerTrigger> */}
      <DrawerContent
        className={cn(
          "right-0 top-0 h-full w-[300px] rounded-none  bg-[#911D00]",
          "fixed shadow-lg animate-in slide-in-from-left duration-300 border-none"
        )}
      >
        <DrawerHeader className="flex items-center justify-between flex-row border-b border-[#9CA3AF]">
          <Image src="/logo.svg" alt="logo" width={111} height={30} />
          <button
            onClick={() => setOpen(false)}
            className="bg-transparent cursor-pointer"
          >
            <XIcon width={20} height={20} />
          </button>
        </DrawerHeader>
        <div className="flex-1 overflow-auto p-4">
          <DrawerTitle className="sr-only">Drawer Title</DrawerTitle>
          <ul className="flex flex-col gap-1">
            {/* <li>
              <Link
                href="/dashboard"
                className={clsx(
                  "px-4 py-2 rounded  hover:bg-[#F73100]/30 flex items-center gap-4 font-medium",
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
                  "px-4 py-2 rounded  hover:bg-[#F73100]/30 flex items-center gap-4 font-medium",
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
                  "px-4 py-2 rounded  hover:bg-[#F73100]/30 flex items-center gap-4 font-medium",
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
        <DrawerFooter>
          <div className="userInfo">
            <div className="userInfoWrapper">
              <div className="userIcon bg-[#F73100]/30">
                <span className="spanIcon">
                  {user ? getInitials(user.fullName) : "?"}
                </span>
              </div>
              <div>
                <h3 className="userInfoTitle">{user?.fullName}</h3>
                <p className="userInfoText">{user?.phoneNumber}</p>
              </div>
            </div>
            <button
              name="exit"
              onClick={() => {
                useUserStore.getState().logout(); // обнуляем user и удаляем токен
                router.replace("/");
              }}
              className="cursor-pointer w-8 h-8"
            >
              <LogOut className="hover:text-[#ce3737] text-red-100" size={20} />
            </button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;
