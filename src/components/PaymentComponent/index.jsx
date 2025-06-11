"use client";
import { ArrowLeft, CreditCard } from "lucide-react";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const API_PATHS = {
  clickCard: `${BASE_URL}/click/card`,
  clickOtp: `${BASE_URL}/click/cardOTP`,
  paymeCard: `${BASE_URL}/payme/card`,
  paymeOtp: `${BASE_URL}/payme/cardOTP`,
};

const PaymentComponent = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    card_number: "",
    expire_date: "",
    paymentMethod: "",
  });
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [smsCode, setSmsCode] = useState("");
  // const [cookies, setCookie] = useCookies(["access_token", "isActiveUser"]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateCardDetails = () => {
    if (!/^\d{16}$/.test(formData.card_number)) {
      toast.error("Notog'ri karta raqami. 16 ta raqam kiriting.");
      return false;
    }
    if (!formData.expire_date) {
      toast.error("Expire date maydonini to'ldiring.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.paymentMethod) {
      toast.error("Iltimos, to'lov usulini tanlang.");
      return;
    }

    if (!Cookies.get("access_token")) {
      toast.error("Token mavjud emas. Iltimos, qayta kiriting.");
      return;
    }

    if (!validateCardDetails()) return;

    const formattedExpireDate = formData.expire_date.replace("/", "");

    const url =
      formData.paymentMethod === "Click"
        ? API_PATHS.clickCard
        : API_PATHS.paymeCard;

    try {
      const response = await axios.post(
        url,
        {
          card_number: formData.card_number,
          expire_date: formattedExpireDate, // Отправляем без "/"
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );

      if (response.data.error_code === -33017) {
        toast.error(
          "Karta topilmadi yoki karta muddati noto'g'ri ko'rsatilgan."
        );
        return;
      }

      console.log("Bilgilangan karta:", response.data);
      setIsOtpStep(true);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.";
      console.error("Xatolik yuz berdi:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!Cookies.get("access_token")) {
      toast.error("Token mavjud emas. Iltimos, qayta kiriting.");
      return;
    }

    const otpUrl =
      formData.paymentMethod === "Click"
        ? API_PATHS.clickOtp
        : API_PATHS.paymeOtp;

    try {
      const response = await axios.post(
        otpUrl,
        {
          card_number: formData.card_number,
          sms_code: smsCode,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("access_token")}`,
          },
        }
      );
      console.log("Оплата завершена:", response.data);
      toast.success("Tolov muvaffaqiyatli amalga oshirildi!");
      Cookies.set("isActiveUser", true, { path: "/" });
      router.push("/courses");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "Произошла ошибка при отправке OTP. Попробуйте снова.";
      console.error("Ошибка при отправке OTP:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleExpire_dateChange = (e) => {
    const { name, value } = e.target;
    if (name === "expire_date") {
      let formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(
          2,
          4
        )}`;
      }
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    if (!Cookies.get("access_token")) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <ToastContainer theme="dark" pauseOnHover={false} />
      <div className="min-h-screen text-white py-8">
        <div className="mx-auto max-w-2xl px-4">
          <nav className="mb-8">
            <button
              name="back"
              onClick={() => router.back()}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {"Orqaga qaytish"}
            </button>
          </nav>

          <div className="grid grid-cols-1 gap-8">
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-semibold">{"Tolov"}</h1>
                <div className="mt-2 text-4xl font-bold">
                  {"Jinsiy Hayot Kursi"}
                </div>
              </div>

              <div className="rounded-lg bg-[#161616] p-6 shadow-sm">
                <div className="flex justify-between border-b pb-4">
                  <div>
                    <div className="font-medium">
                      Jinsiy Hayot Premium Subscription
                    </div>
                    <div className="text-sm text-gray-500">
                      1 marotaba to'lov
                    </div>
                  </div>
                  <div>399 000 uzs</div>
                </div>

                <div className="flex justify-between border-b py-4">
                  <div className="flex items-center">
                    <span>{"Soliqlar"}</span>
                  </div>
                  <div>0,00 uzs</div>
                </div>

                <div className="flex justify-between pt-4">
                  <div className="font-medium">{"Umumiy to'lov"}</div>
                  <div className="font-medium">399 000 uzs</div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-[#161616] p-6 shadow-lg flex flex-col justify-between h-full">
              {!isOtpStep ? (
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  <h2 className="mb-4 text-lg font-medium">{"Tolov turi"}</h2>
                  <div className="grid md:grid-cols-2 gap-4 mb-4 sm:grid-cols-1">
                    <div className="">
                      <div className="flex items-center border rounded-md p-3">
                        <CreditCard className="mr-2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="card_number"
                          placeholder="1234 1234 1234 1234"
                          className="border-none focus:ring-0 focus:border-none  outline-none "
                          value={formData.card_number}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="w-full flex items-center border rounded-md p-3">
                      <input
                        type="text"
                        name="expire_date"
                        placeholder={"MM/YY"}
                        className="border-none focus:ring-0 focus:border-none  outline-none"
                        value={formData.expire_date}
                        onChange={handleExpire_dateChange}
                        maxLength={5}
                      />
                    </div>
                  </div>
                  <div className="mb-8">
                    <h2 className="mb-4 text-lg font-medium">
                      {"To'lov usuli"}
                    </h2>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Click"
                          className="hidden"
                          checked={formData.paymentMethod === "Click"}
                          onChange={handleInputChange}
                        />
                        <span
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            formData.paymentMethod === "Click"
                              ? "border-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {formData.paymentMethod === "Click" && (
                            <span className="h-2.5 w-2.5 bg-green-500 rounded-full"></span>
                          )}
                        </span>
                        <span className="text-sm font-medium">Click</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="Payme"
                          className="hidden"
                          checked={formData.paymentMethod === "Payme"}
                          onChange={handleInputChange}
                        />
                        <span
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            formData.paymentMethod === "Payme"
                              ? "border-green-500"
                              : "border-gray-300"
                          }`}
                        >
                          {formData.paymentMethod === "Payme" && (
                            <span className="h-2.5 w-2.5 bg-green-500 rounded-full"></span>
                          )}
                        </span>
                        <span className="text-sm font-medium">Payme</span>
                      </label>
                    </div>
                  </div>

                  <button
                    name="submit"
                    type="submit"
                    className="w-full rounded-md bg-[#10A37F] py-3 text-white hover:bg-[#1A7F64] transition-colors mt-auto"
                    onClick={handleSubmit}
                  >
                    {"To'lovni amalga oshirish"}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handleOtpSubmit}
                  className="flex flex-col h-full"
                >
                  <div className="mb-8">
                    <h2 className="mb-4 text-lg font-medium">
                      {"SMS kodni kiriting"}
                    </h2>
                    <input
                      type="text"
                      placeholder={"SMS kodini kiriting"}
                      className="rounded-md border p-2 w-full"
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value)}
                    />
                  </div>

                  <button
                    name="submit"
                    type="submit"
                    className="w-full rounded-md bg-[#10A37F] py-3 text-white hover:bg-[#1A7F64] transition-colors mt-auto"
                  >
                    {"SMS kodini yuborish"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentComponent;
