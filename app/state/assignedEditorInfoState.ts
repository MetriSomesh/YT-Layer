// src/state/userState.ts
import { atom } from "recoil";

interface Editor {
  id: number | null;
  userId: number | null;
  profile_pic: string | null;
  description: string | null;
  experience: number | null;
  phone_number: number | null;
  country: string | null;
  state: string | null;
  city: string | null;
  youtuberId: number | null;
}

export const assignedEditorInfoState = atom<Editor | null>({
  key: "assignedEditorInfoState",
  default: null,
});
