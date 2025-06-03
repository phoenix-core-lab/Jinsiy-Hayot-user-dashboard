"use client";
import { SettingsForm } from "@/components/SettingForm/SettingForm";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { User } from "@/store/userStore";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [profile, setProfile] = useState<User>();
  const router = useRouter();
  // Fetch user data
  useEffect(() => {
    const GetProfile = async () => {
      const token = Cookies.get("access_token");

      if (!token) {
        router.replace("/");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfile(response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Axios error:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    GetProfile();
  }, [router]);

  return (
    <div className="text-white  w-full mx-auto p-2">
      {/* Main Content */}
      <div className="">
        {/* Welcome Section */}
        <div className="bg-[#911D00] p-4 rounded-lg mb-3">
          <h1 className="text-[24px] font-bold mb-2">
            Shaxsiy ma&apos;lumotlar
          </h1>
          <p className="text-[16px] font-normal text-[#FFD6D6]">
            Shaxsiy kabinetingizga hush kelibsiz. Bu yerda siz bizning barcha
            ma&apos;lumotlaringizni kuztib borishingiz mumkin
          </p>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-auto ">
          <div className="bg-[#911D00] rounded-lg p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {profile ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <SettingsForm initialData={profile} />
                </motion.div>
              ) : (
                <motion.div
                  key="skeleton"
                  className="animate-pulse flex flex-col md:flex-row gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex-1 space-y-4">
                    <div className="h-10 bg-[#F73100]/30 rounded-[9px]"></div>
                    <div className="h-10 bg-[#F73100]/30 rounded-[9px]"></div>
                    <div className="h-10 bg-[#F73100]/30 rounded-[9px]"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
