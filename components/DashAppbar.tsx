"use client";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { userIdState } from "../app/state/userState";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import notificationIcon from "../assets/notification.svg";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { newnotificationState } from "@/app/state/newnotificationState";

export const DashAppbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [youtuberId, setYoutuberId] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [hasNewNotifications, setHasNewNotifications] =
    useRecoilState(newnotificationState);

  useEffect(() => {
    const fetchUserId = async () => {
      const session = await getSession();
      if (session && session.user && session.user.id) {
        setUserId(session.user.id);
      }
    };

    fetchUserId();
  }, []);
  const Spinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
    </div>
  );

  const hasNewNotification = async () => {
    if (hasNewNotifications) {
      setLoading(true);
      try {
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
      } finally {
        setLoading(false);
      }
    }
    setHasNewNotifications(false);
  };

  useEffect(() => {
    const fetchYoutuberId = async () => {
      const getYotuberId = await axios.post(
        "http://localhost:3000/api/getYoutuberId",
        {
          id: parseInt(userId || ""),
        }
      );
      if (getYotuberId) {
        setYoutuberId(getYotuberId.data.youtuber);
      }
    };
    fetchYoutuberId();
  }, [userId]);

  useEffect(() => {
    const createChannel = async () => {
      const newChannel = await axios.post(
        "http://localhost:3000/api/channelinfo",
        {
          youtuberId: youtuberId,
        }
      );

      if (newChannel) {
        console.log(newChannel);
      }
    };
    createChannel();
  }, [youtuberId]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  return (
    <nav className="border-gray-200 bg-gray-900 h-20 mx-auto flex items-center justify-between w-full">
      <div className="md:max-w-screen-2xl mx-auto flex items-center justify-between w-full">
        <div className="text-white text-lg">YT-Layer</div>
        <div className="items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse flex gap-5">
          <DropdownMenu onOpenChange={hasNewNotification}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Image src={notificationIcon} alt="Notifications" />

                {hasNewNotifications && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
              <DropdownMenuLabel>Invitations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {loading ? <Spinner /> : <DropdownMenuGroup></DropdownMenuGroup>}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded={dropdownVisible}
              onClick={toggleDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="/docs/images/people/profile-picture-3.jpg"
                alt="user photo"
              />
            </button>

            {dropdownVisible && (
              <div
                id="dropdownNavbar"
                className="absolute z-10 font-normal divide-y rounded-lg shadow w-44 bg-gray-700 divide-gray-600"
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-400"
                  aria-labelledby="dropdownNavbarLink"
                >
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Earnings
                    </a>
                  </li>
                </ul>
                <div className="py-1">
                  <a
                    onClick={handleSignOut}
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </a>
                </div>
              </div>
            )}

            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded={mobileMenuVisible}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
              mobileMenuVisible ? "" : "hidden"
            }`}
            id="navbar-user"
          ></div>
        </div>
      </div>
    </nav>
  );
};
