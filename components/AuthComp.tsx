"use client";

import { userEmailState } from "@/states/userState";
import { UserType } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRecoilState } from "recoil";

export default function AuthComp({ type }: { type: string }) {
  const [username, setUsername] = useState("");
  const [userEmail, setUserEmail] = useRecoilState(userEmailState);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const userType =
    typeof localStorage !== "undefined" &&
    localStorage.getItem("userType") === "YOUTUBER"
      ? UserType.YOUTUBER
      : UserType.EDITOR;
  const router = useRouter();
  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-type": "application/json",
    },
  };
  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 ">
          <div>
            <div className="px-10">
              <div className="text-3xl font-extrabold">
                {" "}
                {type === "signup" ? "Sign Up" : "Sign In"}
              </div>
            </div>
            <div className="pt-2">
              <LabelledInput
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                label="Username"
                placeholder="John Doe"
              />
              {type === "signup" ? (
                <LabelledInput
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  label="Email"
                  placeholder="jhondoe@gmail.com"
                />
              ) : null}
              <LabelledInput
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                label="Password"
                type={"password"}
                placeholder="password"
              />
              <button
                onClick={async () => {
                  const res = await axios.post(
                    "http://localhost:3000/api/signup",
                    {
                      username,
                      email,
                      password,
                      userType,
                    }
                  );
                  setUserEmail(email);
                  if (res.status === 201) {
                    if (userType === UserType.YOUTUBER) {
                      localStorage.setItem("userEmail", email);
                      //push to anoter route
                      const res = axios.get(
                        "http://localhost:3000/api/googleauth"
                      );
                      const url = (await res).data.authUrl;
                      router.push(url);
                    } else {
                      localStorage.setItem("userEmail", email);
                      localStorage.setItem("userId", res.data.user.id);
                      router.push("/account");
                    }
                  }
                }}
                type="button"
                className="mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                {type === "signup" ? "Continue" : "Sign In"}
              </button>

              <div className="text-xs mt-2">
                {type === "signup"
                  ? "Already have an account?"
                  : "Don't have an account? "}
                <a
                  href={type === "signup" ? "/signin" : "/signup"}
                  className="underline text-[#3430ff]"
                >
                  {" "}
                  {type === "signup" ? "Signin" : "Signup"}
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
