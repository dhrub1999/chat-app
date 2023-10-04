"use client";
import { FC, useState } from "react";
import Button from "./ui/Button";
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";

interface AddFriendButtonProps {}
type FormData = z.infer<typeof addFriendValidator>;

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccessText, setShowSuccessText] = useState<boolean>(false);

  //For the error state
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = addFriendValidator.parse({ email });

      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });
      setShowSuccessText(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError("email", {
          message: error.message,
        });
        return;
      }
      if (error instanceof AxiosError) {
        setError("email", {
          message: error.response?.data,
        });
        return;
      }

      setError("email", {
        message: "Something went wrong",
      });
    }
  };

  const onSubmit = (data: FormData) => {
    addFriend(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-small text-left">
      <label
        htmlFor="email"
        className="text-left font-raleway font-semibold text-gray-600"
      >
        Add friends by their e-mail.
      </label>
      <div className="mt-2 flex flex-col justify-center gap-4">
        <input
          {...register("email")}
          type="text"
          placeholder="you@example.com"
          className="rounded-md bg-transparent placeholder:text-slate-600 placeholder:font-raleway font-raleway font-medium text-zinc-800 focus:ring-offset-blue-700 w-full max-w-72 outline-none border-slate-600 shadow-lg text-sm leading-7 md:text-base md:leading-8"
        />
        <Button className="shadow-lg">Add your friend</Button>
      </div>
      <p className="mt-4 text-sm text-red-600">{errors.email?.message}</p>
      <p className="mt-4 text-sm text-green-600">
        {showSuccessText && "Friend request sent!"}
      </p>
    </form>
  );
};

export default AddFriendButton;
