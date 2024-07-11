"use client";
import { userEmailState } from "@/states/userState";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

export default function SetupAccount() {
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const userEmail = useRecoilValue(userEmailState);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [profilePicURL, setProfilePicURL] = useState("");

  const router = useRouter();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/picupload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok && data.imageUrl) {
          setProfilePicURL(data.imageUrl.toString());
        } else {
          throw new Error(data.message || "Error uploading image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setError(
       
            "Image size must be less than 10mb or choose a different image"
        );
      }
    }
  };


  const handleSubmit = async () => {
    if (!profilePicture || !phoneNumber || !country || !state || !city) {
      setError("Please fill out all required fields.");
      return;
    }

    setButtonLoading(true);

    const formData = new FormData();
    if (profilePicURL) {
      formData.append("profilePicture", profilePicURL);
    }
    formData.append("email", userEmail);
    formData.append("description", description);
    formData.append("experience", experience);
    formData.append("phoneNumber", phoneNumber);
    formData.append("country", country);
    formData.append("state", state);
    formData.append("city", city);

    try {
      const response = await axios.post(
        "/api/setupaccount",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setButtonLoading(false);
        router.push("/signin");
      }
    } catch (error) {
      console.error("Error setting up account:", error);
      setButtonLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-3xl font-extrabold text-center text-white mb-8">
            Set up your account
          </h2>
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p>{error}</p>
            </div>
          )}
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Profile Picture <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="profile-picture"
                />
                <label
                  htmlFor="profile-picture"
                  className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md inline-flex items-center transition duration-300"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  Choose File
                </label>
                {profilePicture && (
                  <span className="ml-3 text-sm text-gray-400">
                    {profilePicture.name}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Description about editing skills
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your editing skills"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Experience in years
              </label>
              <input
                onChange={(e) => setExperience(e.target.value)}
                type="number"
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your experience in years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="text"
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => setCountry(e.target.value)}
                type="text"
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your country"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                State <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => setState(e.target.value)}
                type="text"
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your state"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                City <span className="text-red-500">*</span>
              </label>
              <input
                onChange={(e) => setCity(e.target.value)}
                type="text"
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your city"
                required
              />
            </div>

            <div>
              {buttonLoading ? (
                <button
                  disabled
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300"
                >
                  Continue
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
