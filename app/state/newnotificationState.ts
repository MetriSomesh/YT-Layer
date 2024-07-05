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
//   invitation: Invitation;
//   // Add other properties as needed
// }

// interface Invitation {
//   [x: string]: any;
//   id: number | null;
//   youtuberId: number | null;
//   editorId: number | null;
//   message: string;
//   status: string | null;
// }

export const newnotificationState = atom<Boolean | null>({
  key: "newnotificationState",
  default: false,
});
