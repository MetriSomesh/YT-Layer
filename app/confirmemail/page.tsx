import ConfirmEmail from "@/components/ConfirmEmail";
import axios from "axios";
import { useEffect } from "react";

export default function pleasewait() {
  return (
    <div>
      <div className="flex justify-center  flex-col h-screen">
        <div className="text-center">
          <ConfirmEmail/>
        </div>
      </div>
    </div>
  );
}
