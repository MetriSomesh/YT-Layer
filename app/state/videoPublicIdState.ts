// src/state/userState.ts
import { atom } from "recoil";

export const videoPublicIdState = atom<string | null>({
  key: "editorIdState",
  default: null,
});
