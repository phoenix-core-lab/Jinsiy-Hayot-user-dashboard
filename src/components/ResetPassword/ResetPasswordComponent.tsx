"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserFormInput {
  phoneNumber: string;
  newPassword: string;
  code: string;
}

export default function ResetPasswordComponent() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormInput>({
    defaultValues: {
      phoneNumber: "",
      newPassword: "",
      code: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [sendPhoneCode, setSendPhoneCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const formatUzPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const trimmed = digits.startsWith("998") ? digits.slice(3) : digits;
    const formatted =
      "+998 " +
      trimmed
        .replace(/^(\d{2})(\d{3})(\d{2})(\d{0,2}).*/, "$1 $2 $3 $4")
        .trim();
    return formatted;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const sendCodeSubmit: SubmitHandler<UserFormInput> = async (data) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/send-phone-code`,
        { phoneNumber: data.phoneNumber }
      );
      setSuccessMessage("Kod telefon raqamingizga yuborildi.");
      setSendPhoneCode(true);
      setErrorMessage(null);
    } catch (error) {
      console.error(error);
      setErrorMessage("Kod yuborilmadi. Qayta urinib ko‘ring.");
    }
  };

  const resetPasswordSubmit: SubmitHandler<UserFormInput> = async (data) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          phoneNumber: data.phoneNumber,
          code: data.code,
          newPassword: data.newPassword,
        }
      );
      setSuccessMessage("Parol muvaffaqiyatli o'zgartirildi!");
      setErrorMessage(null);
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Noto‘g‘ri kod yoki server xatosi. Qayta urinib ko‘ring."
      );
    }
  };

  // Показывать toast только когда сообщения обновляются
  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) toast.success(successMessage);
  }, [successMessage]);

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-black overflow-hidden">
      <div className="w-full lg:w-[40%] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col relative z-10">
        <div className="mb-8 md:mb-16">
          <div className="w-[100px] h-[54px] md:w-[159px]">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={159}
              height={54}
              className="brightness-200"
            />
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-center max-w-md mx-auto w-full">
          <h1 className="text-white text-xl sm:text-2xl font-medium mb-2">
            Parolni qayta tiklash
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8">
            Yangi foydalanuvchi? /
            <Link
              href="/register"
              className="text-[#FF3A29] hover:text-[#E62200] ml-1"
            >
              Ro‘yxatdan o‘tish
            </Link>
          </p>

          {!sendPhoneCode ? (
            <form
              onSubmit={handleSubmit(sendCodeSubmit)}
              className="space-y-5 sm:space-y-6 w-full"
            >
              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="text-gray-400 text-xs text-[16px]"
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
                        const formatted = formatUzPhone(e.target.value);
                        field.onChange(formatted);
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

              <div className="pt-2 sm:pt-4">
                <Button
                  type="submit"
                  className="w-full bg-[#CC1F00] hover:bg-[#B31B00] text-white h-10 sm:h-12 rounded-md font-medium cursor-pointer"
                >
                  Kod yuborish
                </Button>
              </div>
            </form>
          ) : (
            <form
              onSubmit={handleSubmit(resetPasswordSubmit)}
              className="space-y-5 sm:space-y-6 w-full"
            >
              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="text-gray-400 text-xs text-[16px]"
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
                        const formatted = formatUzPhone(e.target.value);
                        field.onChange(formatted);
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
                <label
                  htmlFor="newPassword"
                  className="text-gray-400 text-xs text-[16px]"
                >
                  Yangi parol
                </label>
                <div className="flex relative items-center">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("newPassword", {
                      required: "Parol majburiy",
                      minLength: {
                        value: 8,
                        message:
                          "Parol kamida 8 belgidan iborat bo‘lishi kerak",
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
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="code"
                  className="text-gray-400 text-xs text-[16px]"
                >
                  Kod
                </label>
                <Input
                  id="code"
                  type="text"
                  {...register("code", { required: "Kod majburiy" })}
                  className="bg-[#1a0e0e] border-none text-white h-10 sm:h-12 rounded-md focus:ring-1 focus:ring-[#CC1F00] mt-1 focus:shadow-[0_0_0_2px_rgba(255,58,41,0.3)]"
                />
                {errors.code && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.code.message}
                  </p>
                )}
              </div>
              <div className="pt-2 sm:pt-4">
                <Button
                  type="submit"
                  className="w-full bg-[#CC1F00] hover:bg-[#B31B00] text-white h-10 sm:h-12 rounded-md font-medium cursor-pointer"
                >
                  Parolni o&apos;zgartirish
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right side - Video */}
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
          <source src="/courseVideo.mov" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    </div>
  );
}
