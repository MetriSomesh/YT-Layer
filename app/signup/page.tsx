import AuthComp from "@/components/AuthComp";

export default function signup() {
  return (
    <div>
      <div className="flex justify-center  flex-col h-screen">
        <div className="text-center">
          <AuthComp type="signup" />
        </div>
      </div>
    </div>
  );
}
