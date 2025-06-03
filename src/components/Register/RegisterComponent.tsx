"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserFormInput {
  phoneNumber: string;
  password: string;
  confirm_password?: string;
  fullName: string;
  agree?: boolean;
}

export default function RegisterComponent() {
  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
  } = useForm<UserFormInput>({
    defaultValues: {
      phoneNumber: "",
      password: "",
      confirm_password: "",
      fullName: "",
      agree: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const formatUzPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const trimmed = digits.startsWith("998") ? digits.slice(3) : digits;
    return (
      "+998 " +
      trimmed.replace(/^(\d{2})(\d{3})(\d{2})(\d{0,2}).*/, "$1 $2 $3 $4").trim()
    );
  };

  const handleRegister: SubmitHandler<UserFormInput> = async (data) => {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

    try {
      const submitData = { ...data };
      delete submitData.confirm_password;
      delete submitData.agree;

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        ...submitData,
        phoneNumber: submitData.phoneNumber.replace(/[^\d+]/g, ""),
      });

      toast.success("Tasdiqlash kodi yuborildi");
      setIsVerificationStep(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          "Ushbu telefon raqamiga ega foydalanuvchi allaqachon mavjud!"
        );
      } else {
        toast.error("Noma'lum xatolik");
      }
    }
  };

  const handleVerifyCode = async () => {
    try {
      const values = getValues();
      const submitData = { ...values };
      delete submitData.confirm_password;
      delete submitData.agree;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-phone-code`,
        {
          phoneNumber: submitData.phoneNumber.replace(/[^\d+]/g, ""),
          code,
        }
      );

      toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
      router.push("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Xatolik kodda");
      } else {
        toast.error("Noma'lum xatolik yuz berdi");
      }
    }
  };

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
            Ro‘yxatdan o‘tish
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mb-6 sm:mb-8">
            Akkauntingiz bormi?
            <Link href="/" className="text-[#FF3A29] hover:text-[#E62200] ml-1">
              Kirish
            </Link>
          </p>

          {!isVerificationStep ? (
            <form
              onSubmit={handleSubmit(handleRegister)}
              className="space-y-5 sm:space-y-2 w-full"
            >
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-gray-400 text-[16px]">
                  To&apos;liq ismingiz
                </label>
                <Controller
                  name="fullName"
                  control={control}
                  rules={{ required: "Ism kiritish majburiy" }}
                  render={({ field }) => (
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Ismingiz"
                      value={field.value}
                      onChange={field.onChange}
                      className="bg-[#1a0e0e] border-none text-white h-10 sm:h-12 rounded-md focus:ring-1 focus:ring-[#CC1F00] mt-1 focus:shadow-[0_0_0_2px_rgba(255,58,41,0.3)]"
                    />
                  )}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone */}
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
                    validate: (value) =>
                      value.replace(/\D/g, "").length === 12 ||
                      "To‘liq raqam kiriting",
                  }}
                  render={({ field }) => (
                    <Input
                      id="phoneNumber"
                      type="text"
                      placeholder="+998 90 123 45 67"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(formatUzPhone(e.target.value))
                      }
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

              {/* Password */}
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
                        value: 8,
                        message:
                          "Parol kamida 8 belgidan iborat bo‘lishi kerak",
                      },
                    })}
                    className="bg-[#1a0e0e] border-none text-white h-10 sm:h-12 rounded-md"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={togglePasswordVisibility}
                    className="absolute right-2 bg-transparent hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOffIcon width={24} />
                    ) : (
                      <EyeIcon width={24} />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  htmlFor="confirm_password"
                  className="text-gray-400 text-[16px]"
                >
                  Parolni tasdiqlang
                </label>
                <div className="flex relative items-center">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirm_password", {
                      required: "Parolni tasdiqlash majburiy",
                      validate: (value) =>
                        value === getValues("password") || "Parollar mos emas",
                    })}
                    className="bg-[#1a0e0e] border-none text-white h-10 sm:h-12 rounded-md"
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-2 bg-transparent hover:bg-transparent cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon width={24} />
                    ) : (
                      <EyeIcon width={24} />
                    )}
                  </Button>
                </div>
                {errors.confirm_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>

              {/* Agree to terms */}
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="agree"
                  {...register("agree", {
                    required: "Ofertaga rozilik majburiy",
                  })}
                  className="mt-1 h-4 w-4 text-[#CC1F00] bg-transparent border-gray-600 focus:ring-0 rounded-md cursor-pointer"
                />
                <label
                  htmlFor="agree"
                  className="text-sm text-gray-300 leading-snug"
                >
                  Men{" "}
                  <a
                    href="https://telegra.ph/PUBLICHNAYA-OFERTA-05-30-2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-[#FF3A29] hover:text-[#E62200]"
                  >
                    Ommaviy ofertani
                  </a>{" "}
                  o‘qidim va rozi bo‘ldim
                </label>
              </div>
              {errors.agree && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.agree.message}
                </p>
              )}

              <div className="pt-2 sm:pt-4">
                <Button className="w-full bg-[#CC1F00] hover:bg-[#B31B00] text-white h-10 sm:h-12 rounded-md font-medium cursor-pointer">
                  Davom etish
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300">
                Telefon raqamingizga yuborilgan 4 xonali kodni kiriting:
              </p>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="1234"
                className="bg-[#1a0e0e] border-none text-white h-12"
              />
              <Button
                onClick={handleVerifyCode}
                className="w-full bg-[#CC1F00] hover:bg-[#B31B00] text-white h-12 rounded-md font-medium cursor-pointer"
              >
                Ro&apos;yxatdan o&apos;tish
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Video Background */}
      <div className="fixed inset-0 lg:relative lg:w-[60%] opacity-20 lg:opacity-100 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10 lg:hidden"></div>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="top-0 left-0 w-full h-full object-cover z-[-1]"
          src="/courseVideo.mov"
        />
      </div>
    </div>
  );
}
