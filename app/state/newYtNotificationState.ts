// src/state/userState.ts
import { atom } from "recoil";

export const newYtNotificationState = atom<Boolean | null>({
  key: "newYtNotificationState",
  default: false,
});
