import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "../components/index";
import { Loading, CustomButton } from "../components/index";
import { apiRequest } from "../utils";
const ResetPassword = () => {
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  const handleResetSubmit = async (data) => {
    
    setIsSubmitting(true);
    try {
      const res = await apiRequest({
        url: "/users/request-passwordreset",
        data: data,
        method: "POST",
      });
      if (res?.status === "failed") {
        setErrMsg(res);
      } else {
        setErrMsg(res);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="w-full h-[100vh] bg-bgColor flex items-center justify-center p-6">
      <div className="bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg">
        <p className="text-ascent-1 text-lg font-semibold">Email Address</p>
        <span className="text-sm text-ascent-2">
          Enter email address used during registration
        </span>

        <form
          onSubmit={handleSubmit(handleResetSubmit)}
          className="py-4 flex flex-col gap-5"
        >
          <TextInput
            name="email"
            placeholder="email@example.com"
            label="Email Address"
            type="email"
            register={register("email", {
              required: "Email Address is required",
            })}
            styles="w-full rounded-full "
            labelStyle="ml-2"
            error={errors.email ? errors.email.message : ""}
          />
          {errMsg?.message && (
            <span
              className={`text-sm ${
                errMsg?.status === "failed"
                  ? "text-[#f64949fe]"
                  : "text-[2ba150fe]"
              } mt-0.5`}
            >
              {errMsg?.message}
            </span>
          )}
          {isSubmitting ? (
            <Loading />
          ) : (
            <CustomButton
              type="submit"
              containerStyles={`inline-flex mt-3 justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
              title="Submit"
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
