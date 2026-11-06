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
    <div className="min-h-screen bg-background px-4 py-12 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-border bg-card">
        <div className="px-6 py-8 sm:px-10">
          <p className="font-label text-xs tracking-[0.3em] text-primary">
            EDITOR PROFILE
          </p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight">
            Set up your account
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Tell channels who you are, what you cut, and where you work from.
          </p>
          {error && (
            <div className="mb-4 mt-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <p>{error}</p>
            </div>
          )}
          <form className="mt-8 space-y-6">
            <div>
              <label className="font-label block text-xs tracking-widest text-muted-foreground">
                PROFILE PICTURE <span className="text-primary">*</span>
              </label>
              <div className="mt-2 flex items-center">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="profile-picture"
                />
                <label
                  htmlFor="profile-picture"
                  className="inline-flex cursor-pointer items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground transition duration-300 hover:bg-muted"
                >
                  <svg
                    className="mr-2 h-5 w-5"
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
                  <span className="ml-3 text-sm text-muted-foreground">
                    {profilePicture.name}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="font-label block text-xs tracking-widest text-muted-foreground">
                DESCRIPTION ABOUT EDITING SKILLS
              </label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Describe your editing skills"
                rows={4}
              />
            </div>

            <div>
              <label className="font-label block text-xs tracking-widest text-muted-foreground">
                EXPERIENCE IN YEARS
              </label>
              <input
                onChange={(e) => setExperience(e.target.value)}
                type="number"
                className="mt-2 block w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter your experience in years"
              />
            </div>

            <div>
              <label className="font-label block text-xs tracking-widest text-muted-foreground">
                PHONE NUMBER <span className="text-primary">*</span>
              </label>
              <input
                onChange={(e) => setPhoneNumber(e.target.value)}
                type="text"
                className="mt-2 block w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="font-label block text-xs tracking-widest text-muted-foreground">
                COUNTRY <span className="text-primary">*</span>
              </label>
              <input
                onChange={(e) => setCountry(e.target.value)}
                type="text"
                className="mt-2 block w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter your country"
                required
              />
            </div>

            <div>
              <label className="font-label block text-xs tracking-widest text-muted-foreground">
                STATE <span className="text-primary">*</span>
              </label>
              <input
                onChange={(e) => setState(e.target.value)}
                type="text"
                className="mt-2 block w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter your state"
                required
              />
            </div>

            <div>
              <label className="font-label block text-xs tracking-widest text-muted-foreground">
                CITY <span className="text-primary">*</span>
              </label>
              <input
                onChange={(e) => setCity(e.target.value)}
                type="text"
                className="mt-2 block w-full rounded-lg border border-input bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Enter your city"
                required
              />
            </div>

            <div>
              {buttonLoading ? (
                <button
                  disabled
                  type="button"
                  className="flex w-full justify-center rounded-full bg-primary px-4 py-3 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
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
                  className="flex w-full justify-center rounded-full bg-primary px-4 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary"
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
