"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { formatUzPhone } from "@/utils/formatUzPhone";

interface UserFormInput {
  phoneNumber: string;
  password: string;
}

export default function LoginComponent() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormInput>({
    defaultValues: {
      phoneNumber: "+998 ",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const router = useRouter();
  const onSubmit: SubmitHandler<UserFormInput> = async (data) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          ...data,
          phoneNumber: data.phoneNumber.replace(/[^\d+]/g, ""),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.access_token;

      Cookies.set("access_token", token, { expires: 7, path: "/" });

      console.log("Login successful:", token);
      router.push("/courses");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (axios.isAxiosError(error)) {
          if (error.status === 401) {
            toast.error("Parolda xatolik!");
          }
          toast.error("Bunday foydalanuvchi yo'k yoki server xatoligi!");
        } else {
          console.error("Unexpected error:", error);
          toast("Nomaʼlum xatolik yuz berdi.");
        }
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-black overflow-hidden">
      <div className="w-full lg:w-[40%] p-4 sm:p-6 md:p-8 lg:p-12 flex justify-center items-center h-screen relative z-10">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="w-[159px] h-[54px] mb-6">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={159}
              height={54}
              className="brightness-200"
            />
          </div>

          <div className="w-full">
            <h1 className="text-white text-xl sm:text-2xl font-medium mb-2 text-center">
              Platformaga kirish!
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8 text-center">
              Yangi foydalanuvchi? /
              <Link
                href="/register"
                className="text-[#FF3A29] hover:text-[#E62200] ml-1"
              >
                Ro‘yxatdan o‘tish
              </Link>
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6 w-full"
            >
              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="text-gray-400 text-[16px]"
                >
                  Telefon raqami
                </label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  rules={{
                    required: "Telefon raqam majburiy",
                    validate: (value) => {
                      const digits = value.replace(/\D/g, "");
                      return digits.length === 12 || "To‘liq raqam kiriting";
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="phoneNumber"
                      placeholder="+998 90 123 45 67"
                      type="text"
                      value={field.value}
                      onChange={(e) => {
                        let input = e.target.value;

                        // Гарантируем, что +998 остаётся в начале
                        if (!input.startsWith("+998 ")) {
                          input = "+998 ";
                        }

                        field.onChange(formatUzPhone(input));
                      }}
                      className="bg-[#1a0e0e] border-none text-white h-10 sm:h-12 rounded-md focus:ring-1 focus:ring-[#CC1F00] mt-1 focus:shadow-[0_0_0_2px_rgba(255,58,41,0.3)]"
                    />
                  )}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-gray-400 text-[16px]">
                  Parol
                </label>
                <div className="flex relative items-center">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password", {
                      required: "Parol majburiy",
                      minLength: {
                        value: 6,
                        message:
                          "Parol kamida 6 ta belgidan iborat bo‘lishi kerak",
                      },
                    })}
                    className="bg-[#1a0e0e] border-none text-white h-10 sm:h-12 rounded-md focus:ring-1 focus:ring-[#CC1F00] mt-1 focus:shadow-[0_0_0_2px_rgba(255,58,41,0.3)]"
                  />
                  <Button
                    className="absolute right-2 bg-transparent hover:bg-transparent cursor-pointer focus:ring-0 shadow-none"
                    type="button"
                    size="icon"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOffIcon width={30} height={30} />
                    ) : (
                      <EyeIcon width={30} height={30} />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="pt-2 sm:pt-4">
                <Button
                  type="submit"
                  className="w-full bg-[#CC1F00] hover:bg-[#B31B00] text-white h-10 sm:h-12 rounded-md font-medium cursor-pointer"
                >
                  Kirish
                </Button>
              </div>

              <div className="text-center">
                <Link
                  href="/reset-password"
                  className="text-gray-400 text-xs hover:text-[#FF3A29]"
                >
                  Parolni unutdingizmi?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 lg:relative lg:w-[60%] opacity-20 lg:opacity-100 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10 lg:hidden"></div>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="top-0 left-0 w-full h-full object-cover z-[-1]"
          src="/courseVideo.mov"
        >
          <source src="/courseVideo.mov" type="video/quicktime" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    </div>
  );
}
