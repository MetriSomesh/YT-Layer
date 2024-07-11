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
  const [loading, setLoading] = useState(false);
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
    <div className="min-h-screen bg-gray-900 flex justify-center items-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-extrabold text-white text-center mb-6">
            {type === "signup" ? "Sign Up" : "Sign In"}
          </h2>
          <form>
            <LabelledInput
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              placeholder="John Doe"
            />
            {type === "signup" && (
              <LabelledInput
                onChange={(e) => {
                  setEmail(e.target.value);
                  setUserEmail(e.target.value);
                }}
                label="Email"
                placeholder="johndoe@gmail.com"
              />
            )}
            <LabelledInput
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              placeholder="••••••••"
            />
            <button
              onClick={async () => {
                setLoading(true);
                const res = await axios.post("/api/signup", {
                  username,
                  email,
                  password,
                  userType,
                });
                setUserEmail(email);
                if (res.status === 201) {
                  if (userType === UserType.YOUTUBER) {
                    localStorage.setItem("userEmail", email);
                    const res = axios.get("/api/googleauth");
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
              className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-6 transition-colors duration-300"
            >
              {" "}
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-700">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <span className="opacity-0">Sign In</span>
                </div>
              ) : type === "signup" ? (
                "Continue"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
          <p className="text-sm text-gray-400 mt-4 text-center">
            {type === "signup"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <a
              href={type === "signup" ? "/signin" : "/signup"}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              {type === "signup" ? "Sign In" : "Sign Up"}
            </a>
          </p>
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
    <div className="mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        type={type || "text"}
        className="w-full px-3 py-2 text-sm text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-purple-500 focus:border-purple-500"
        placeholder={placeholder}
        required
        onChange={onChange}
      />
    </div>
  );
}
