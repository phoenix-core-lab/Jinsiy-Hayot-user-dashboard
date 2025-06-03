"use client";

import { User } from "@/store/userStore";
import type React from "react";

interface SettingsFormProps {
  initialData: User;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const registerDate = new Date(initialData.createdAt).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tashkent",
  });
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            To&apos;liq ism
          </label>
          <p className="w-full bg-[#F73100]/30 border-none rounded-[9px] p-2 text-white">
            {initialData.fullName}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Raqam</label>
          <p className="w-full bg-[#F73100]/30 border-none rounded-[9px] p-2 text-white">
            {initialData.phoneNumber}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Planformada ro&apos;yxatdan o&apos;tilgan sana
          </label>
          <p className="w-full bg-[#F73100]/30 border-none rounded-[9px] p-2 text-white">
            {registerDate}
          </p>
        </div>

        {/* <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <p className="w-full bg-[#F73100]/30 border-none rounded-[9px] p-2 text-white">
            {initialData.email}
          </p>
        </div> */}
      </div>
    </div>
  );
}
