// src/state/userState.ts
import { atom } from "recoil";

// interface Notification {
//   id: number;
//   userId: number;
//   profile_pic: string;
//   description: string;
//   experience: string;
//   phone_number: string;
//   country: string;
//   state: string;
//   city: string;
//   youtuberId: number | null;
//   invitation: Invitation[]; // Change this to an array of Invitation
// }
// interface Invitation {
//   [x: string]: any;
//   id: number | null;
//   youtuberId: number | null;
//   editorId: number | null;
//   message: string;
//   status: string | null;
//   viewed: boolean | null;
//   channel: Channel;
// }
interface Channel {
  ChannelPic: string | null;
  channelId: string | null;
  videoCount: string | null;
  viewCount: string | null;
  title: string | null;
  description: string | null;
  subscriberCount: string | null;
  hiddenSubsCount: boolean | null;
}

export const channelInfoState = atom<Channel | null>({
  key: "channelInfoState",
  default: null,
});
