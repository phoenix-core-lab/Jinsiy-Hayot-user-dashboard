"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { formatUzPhone } from "@/utils/formatUzPhone";

interface UserFormInput {
  login: string;
  password: string;
}

// Функция для проверки, является ли введенный текст номером телефона
// const isPhoneNumber = (value: string): boolean => {
//   const cleanValue = value.replace(/\s/g, "");
//   return cleanValue.startsWith("+998") && /^\+998\d{9}$/.test(cleanValue.replace(/\s/g, ""));
// };

// Функция для проверки, начинает ли пользователь вводить номер телефона
const looksLikePhoneStart = (value: string): boolean => {
  const clean = value.replace(/\s/g, "");
  // Проверяем только если значение точно соответствует началу номера телефона
  return (clean.startsWith("+998") && clean.length > 4) || 
         (clean.startsWith("998") && clean.length > 3) || 
         clean === "+";
};

export default function LoginComponent() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormInput>({
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  // const loginValue = watch("login");

  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    const isValidToken = (token: string) =>
      /^[a-zA-Z0-9._-]{20,300}$/.test(token || "");

    if (token && isValidToken(token)) {
      Cookies.set("access_token", token, {
        expires: 7,
        path: "/",
      });

      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, "", cleanUrl);
      router.push("/courses");
    }
  }, [router]);

  const onSubmit: SubmitHandler<UserFormInput> = async (data) => {
    try {
      // Подготавливаем данные для отправки
      let loginData = data.login;
      
      // Если это номер телефона, очищаем от лишних символов
      if (looksLikePhoneStart(data.login)) {
        loginData = data.login.replace(/[^\d+]/g, "");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          phoneNumber: loginData, // Отправляем под ключом phoneNumber, даже если это логин
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.access_token;
      Cookies.set("access_token", token, { expires: 7, path: "/" });

      router.push("/courses");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.status === 401) {
          toast.error("Parolda xatolik!");
        }
        toast.error("Bunday foydalanuvchi yo'q yoki server xatoligi!");
      } else {
        console.error("Unexpected error:", error);
        toast("Nomaʼlum xatolik yuz berdi.");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-black overflow-hidden relative">
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
                Ro&apos;yxatdan o&apos;tish
              </Link>
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6 w-full"
            >
              <div className="space-y-2">
                <label
                  htmlFor="login"
                  className="text-gray-400 text-[16px]"
                >
                  Login yoki telefon raqami
                </label>
                <Controller
                  name="login"
                  control={control}
                  rules={{
                    required: "Login majburiy",
                    validate: (value) => {
                      // Если это выглядит как номер телефона, проверяем его полноту
                      if (looksLikePhoneStart(value)) {
                        const digits = value.replace(/\D/g, "");
                        return digits.length === 12 || "To'liq telefon raqam kiriting";
                      }
                      // Для обычного логина минимальная длина
                      return value.length >= 3 || "Login kamida 3 ta belgidan iborat bo'lishi kerak";
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="login"
                      placeholder="Login yoki +998 90 123 45 67"
                      type="text"
                      value={field.value}
                      onChange={(e) => {
                        const input = e.target.value;
                        
                        // Если пользователь начинает вводить номер телефона
                        if (looksLikePhoneStart(input)) {
                          // Применяем форматирование для телефонных номеров
                          field.onChange(formatUzPhone(input));
                        } else {
                          // Для обычного логина просто сохраняем как есть
                          // Позволяем пользователю удалить +998 и переключиться на обычный логин
                          field.onChange(input);
                        }
                      }}
                      onKeyDown={(e) => {
                        // Позволяем удалять +998 при нажатии Backspace или Delete
                        if ((e.key === 'Backspace' || e.key === 'Delete') && field.value === '+998 ') {
                          e.preventDefault();
                          field.onChange('');
                        }
                      }}
                      className="bg-[#1a0e0e] border-none text-white h-10 sm:h-12 rounded-md focus:ring-1 focus:ring-[#CC1F00] mt-1 focus:shadow-[0_0_0_2px_rgba(255,58,41,0.3)]"
                    />
                  )}
                />
                {errors.login && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.login.message}
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
                          "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
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

      {/* Telegram Support Link */}
      <div className="absolute bottom-4 left-4 z-20">
        <a
          href="https://t.me/your_support_bot" // Замените на ваш Telegram бот или канал
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 bg-[#1a0e0e] hover:bg-[#2a1515] text-gray-400 hover:text-white border border-gray-800 hover:border-[#FF3A29] px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium shadow-2xl backdrop-blur-sm hover:shadow-[0_0_20px_rgba(255,58,41,0.3)] hover:scale-105"
        >
          <div className="p-2 bg-[#FF3A29] group-hover:bg-[#CC1F00] rounded-lg transition-colors duration-300">
            <MessageCircle size={16} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors duration-300">
              Savollar bormi?
            </span>
            <span className="font-medium">
              Yordam olish
            </span>
          </div>
        </a>
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