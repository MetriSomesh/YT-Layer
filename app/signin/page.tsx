import AuthComp from "@/components/AuthComp";
import Signin from "@/components/Signin";

export default function signin() {
  return (
    <div>
      <div className="flex justify-center  flex-col h-screen">
        <div className="text-center">
          <Signin />
        </div>
      </div>
    </div>
  );
}
