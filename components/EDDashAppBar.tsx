"use client";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { userIdState } from "../app/state/userState";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import notificationIcon from "../assets/notification.svg";
import profile from "../assets/user.svg";
import Image from "next/image";
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
import { notificationState } from "@/app/state/notificationState";
import { newnotificationState } from "@/app/state/newnotificationState";
import axios from "axios";
import { editorIdState } from "@/app/state/editorIdState";

const Spinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
  </div>
);

interface Channel {
  id: number;
  youtuberId: number;
  channelId: string;
  title: string;
  ChannelPic: string;
  description: string;
  viewCount: string;
  subscriberCount: string;
  hiddenSubsCount: boolean;
  videoCount: string;
}

interface InvitationDetail {
  id: number;
  youtuberId: number;
  editorId: number;
  channelId: number;
  message: string;
  status: string;
  viewed: boolean;
  channel: Channel;
}

interface Invitation {
  id: number;
  userId: number;
  profile_pic: string;
  description: string;
  experience: string;
  phone_number: string;
  country: string;
  state: string;
  city: string;
  youtuberId: number | null;
  invitation: InvitationDetail[];
}

export const EDashAppbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [notificationMenuVisible, setNotificationMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[] | null>(null);
  const [hasNewNotifications, setHasNewNotifications] =
    useRecoilState(newnotificationState);
  const [userId, setUserId] = useRecoilState(userIdState);
  const [editorId, setEditorId] = useRecoilState(editorIdState);
  const [notification, setNotification] = useRecoilState(notificationState);
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      const session = await getSession();
      if (session && session.user && session.user.id) {
        setUserId(session.user.id);
      }
    };

    fetchUserId();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuVisible(!mobileMenuVisible);
  };

  const hasNewNotification = async () => {
    if (hasNewNotifications) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3000/api/getinvitation",
          {
            editorId: editorId,
          }
        );
        if (response.status === 200) {
          setInvitations(response.data.invitation);
        }
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
      } finally {
        setLoading(false);
      }
    }
    setHasNewNotifications(false);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  const navigateToInvitation = (channelId: string) => {
    // Implement navigation logic here
    console.log("Navigating to invitation with channelId:", channelId);
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
              {loading ? (
                <Spinner />
              ) : (
                <DropdownMenuGroup>
                  {invitations && invitations.length > 0 ? (
                    invitations.map((inv, index) =>
                      inv.invitation.map((detail, subIndex) => (
                        <DropdownMenuItem
                          className="gap-4"
                          key={`${index}-${subIndex}`}
                          onClick={() =>
                            navigateToInvitation(detail.channel.channelId)
                          }
                        >
                          <Avatar>
                            <AvatarImage src={detail.channel.ChannelPic} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{detail.message}</span>
                          </div>
                          <Button
                            onClick={() =>
                              navigateToInvitation(detail.channel.channelId)
                            }
                            className="ml-auto"
                          >
                            View
                          </Button>
                        </DropdownMenuItem>
                      ))
                    )
                  ) : (
                    <DropdownMenuItem>No invitations</DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Profile Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Image src={profile} alt="profile" />
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
