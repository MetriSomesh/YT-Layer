// src/state/userState.ts
import { atom } from "recoil";

export const userIdState = atom<string | null>({
  key: "currentUserIdState",
  default: null,
});
