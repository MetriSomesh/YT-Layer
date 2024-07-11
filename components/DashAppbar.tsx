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
import { youtuberIdState } from "@/app/state/youtuberIdState";
import { ytnotificationState } from "@/app/state/ytnotificationState";
import { newYtNotificationState } from "@/app/state/newYtNotificationState";
import { channelInfoState } from "@/app/state/channelInfoState";
import { channelProfilePicState } from "@/app/state/channelProfilePicState";
import { channelLinkState } from "@/app/state/channelLinkState";

export const DashAppbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [youtuberId, setYoutuberId] = useRecoilState(youtuberIdState);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [newYtNotification, setNewYtNotification] = useRecoilState(
    newYtNotificationState
  );
  const [channelLink, setChannelLink] = useRecoilState(channelLinkState);
  const [channelInfo, setChannelInfo] = useRecoilState(channelInfoState);
  const [ytNotification, setYtNotification] =
    useRecoilState(ytnotificationState);
  const [profilePic, setProfilePic] = useRecoilState(channelProfilePicState);
  const Spinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
    </div>
  );

  const hasNewNotification = async () => {
    if (newYtNotification) {
      setLoading(true);
      try {
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
      } finally {
        setLoading(false);
      }
    }
    setNewYtNotification(false);
  };

  useEffect(() => {
    const createChannel = async () => {
      const newChannel = await axios.post(
        "/api/channelinfo",
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
  useEffect(() => {
    const getProfile = async () => {
      const profilePic = await axios.post(
        "/api/getYtProfilePic",
        {
          id: youtuberId,
        }
      );

      if (profilePic.status === 200) {
        setProfilePic(profilePic.data.channelPic);
        setChannelLink(profilePic.data.channelLink);
      }
    };
    getProfile();
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

  const handleOkButton = async (notificationId: number | null) => {
    const deleteNotification = await axios.post(
      "/api/deleteytnotification",
      {
        notificationId: notificationId,
      }
    );
    if (deleteNotification.status === 200) {
      console.log("notification deleted");
    }
  };

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-white text-2xl font-bold">YT-Layer</span>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu onOpenChange={hasNewNotification}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
                >
                  <Image
                    src={notificationIcon}
                    alt="Notifications"
                    className="w-6 h-6"
                  />
                  {newYtNotification && (
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-gray-900 bg-red-500"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 mt-2 bg-gray-800 rounded-md shadow-lg border border-gray-700">
                <DropdownMenuLabel className="px-4 py-2 text-lg font-semibold text-gray-200">
                  Notifications
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                {loading ? (
                  <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
                  </div>
                ) : (
                  <DropdownMenuGroup>
                    {ytNotification ? (
                      <DropdownMenuItem
                        className={`p-4 hover:bg-gray-700 ${
                          ytNotification?.viewed
                            ? "text-gray-400"
                            : "font-semibold text-gray-200"
                        }`}
                        onClick={() => {}}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage
                              src={ytNotification.editor.profile_pic || ""}
                            />
                            <AvatarFallback className="bg-gray-600 text-white">
                              ED
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm">{`Your invitation is ${ytNotification.status} by ${ytNotification.editor.country}`}</p>
                          </div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOkButton(ytNotification.id);
                              router.refresh();
                            }}
                            className="ml-auto bg-gray-700 hover:bg-gray-600 text-white"
                          >
                            Ok
                          </Button>
                        </div>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="p-4 text-gray-400">
                        No notifications
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
                >
                  <Avatar>
                    <AvatarImage src={profilePic || ""} />
                    <AvatarFallback className="bg-gray-600 text-white">
                      YT
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 bg-gray-800 rounded-md shadow-lg border border-gray-700">
                <DropdownMenuLabel className="px-4 py-2 text-lg font-semibold text-gray-200">
                  Profile
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300">
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-gray-300"
                    onClick={handleSignOut}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};
