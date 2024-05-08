"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function () {
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const email =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  const [channelName, setChannelName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const router = useRouter();
  return (
    <div className="h-screen flex justify-center flex-col ">
      <div className="flex justify-center">
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
          <div>
            <div className="px-10">
              <div className="text-2xl font-extrabold text-center">
                Set up your account
              </div>

              <div className="">
                {loading ? (
                  <div className="mt-10">
                    <label className="block mb-2 text-sm font-medium text-gray-900 ">
                      Channel Name
                    </label>
                    <input
                      onChange={(e) => {
                        setChannelName(e.target.value);
                      }}
                      type="text"
                      id="first_name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                      placeholder="Enter your channel name"
                      required
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-green-700 ">
                      Channel name
                    </label>
                    <input
                      onChange={(e) => {}}
                      type="text"
                      id="success"
                      className="bg-green-50 border border-green-500 text-green-900  placeholder-green-700  text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 "
                      placeholder="Success input"
                    />
                    <p className="mt-2 text-sm text-green-600 dark:text-green-500">
                      <span className="font-medium">Well done!</span> Some
                      success message.
                    </p>
                  </div>
                )}

                <div className="mt-5">
                  <label className="block mb-2 text-sm font-medium text-gray-900 ">
                    Api Key
                  </label>
                  <input
                    onChange={(e) => {
                      setApiKey(e.target.value);
                    }}
                    type="text"
                    id="first_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Enter your api key"
                    required
                  />
                </div>
                <div className="mt-5 text-center">
                  {buttonLoading ? (
                    <button
                      disabled
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-3 text-center me-2 "
                    >
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 me-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      Loading...
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        setButtonLoading(true);
                        const channel = await axios.post(
                          "http://localhost:3000/api/setupaccount",
                          {
                            email,
                            channelName,
                            apiKey,
                          }
                        );
                        if (channel) {
                          setButtonLoading(false);
                          // router.push("/dashboard");
                        }
                      }}
                      type="button"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-10 py-3 me-2 mb-2 "
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}