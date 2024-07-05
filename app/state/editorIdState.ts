// src/state/userState.ts
import { atom } from "recoil";

export const editorIdState = atom<number | null>({
  key: "editorIdState",
  default: null,
});
