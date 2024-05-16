"use client";

import { UserType } from "@prisma/client";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userType =
    typeof localStorage !== "undefined" &&
    localStorage.getItem("userType") === "YOUTUBER"
      ? UserType.YOUTUBER
      : UserType.EDITOR;
  const router = useRouter();

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 ">
          <div>
            <div className="px-10">
              <div className="text-3xl font-extrabold"> Sign In</div>
            </div>
            <div className="pt-2">
              <LabelledInput
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                label="Email"
                placeholder="jhondoe@gmail.com"
              />

              <LabelledInput
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                label="Password"
                type={"password"}
                placeholder="password"
              />
              <button
                onClick={() => {
                  signIn("credentials",{
                    email,
                    password
                  });
                }}
                type="button"
                className="mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                Sign In
              </button>

              <div className="text-xs mt-2">
                Don't have an account?
                <a href={"/signup"} className="underline text-[#3430ff]">
                  {" "}
                  Signup
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
}

function LabelledInput({
  label,
  placeholder,
  type,
  onChange,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4 text-start">
        {label}
      </label>
      <input
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
        onChange={onChange}
      />
    </div>
  );
}