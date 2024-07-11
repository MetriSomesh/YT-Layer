"use client";

import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let userType = "YOUTUBER";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Sign In
          </h2>
          <form>
            <LabelledInput
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              placeholder="johndoe@gmail.com"
            />
            <LabelledInput
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              type="password"
              placeholder="••••••••"
            />
            <button
              disabled={loading}
              onClick={async () => {
                await setLoading(true);
                userType = await axios.post("/api/getUserType", { email });

                if (userType === "YOUTUBER") {
                  const login = await signIn("credentials", {
                    email,
                    password,
                    callbackUrl: "/ytdashboard",
                    redirect: false,
                  });
                  if (login?.ok) {
                    router.push(login.url || "");
                  }
                } else {
                  const login = await signIn("credentials", {
                    email,
                    password,
                    callbackUrl: "/eddashboard",
                    redirect: false,
                  });
                  if (login?.ok) {
                    router.push(login.url || "");
                  }
                }
              }}
              type="button"
              className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-6 transition-colors duration-300 relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-700">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <span className="opacity-0">Sign In</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          <p className="text-sm text-gray-400 mt-4 text-center">
            {"Don't have an account?"}{" "}
            <a
              href={"/signup"}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              {"Sign Up"}
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
