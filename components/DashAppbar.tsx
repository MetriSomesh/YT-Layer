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
  useEffect(() => {
    const getProfile = async () => {
      const profilePic = await axios.post(
        "http://localhost:3000/api/getYtProfilePic",
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
      "http://localhost:3000/api/deleteytnotification",
      {
        notificationId: notificationId,
      }
    );
    if (deleteNotification.status === 200) {
      console.log("notification deleted");
    }
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

                {newYtNotification && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {loading ? (
                <Spinner />
              ) : (
                <DropdownMenuGroup>
                  {ytNotification ? (
                    <DropdownMenuItem
                      className={`gap-4 ${
                        ytNotification?.viewed
                          ? "text-gray-500"
                          : "font-bold text-white"
                      }`}
                      onClick={() => {}}
                    >
                      <Avatar>
                        <AvatarImage
                          src={ytNotification.editor.profile_pic || ""}
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{`Your invitation is ${ytNotification.status} by ${ytNotification.editor.country}`}</span>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();

                          handleOkButton(ytNotification.id);
                          router.refresh();
                        }}
                        className="ml-auto"
                      >
                        Ok
                      </Button>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>No notifications</DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative bg-transparent"
              >
                <Avatar>
                  <AvatarImage src={profilePic || ""} />
                  <AvatarFallback>YT</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Profile</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};
