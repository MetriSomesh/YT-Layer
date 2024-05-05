import AuthComp from "@/components/AuthComp";

export default function signin() {
  return (
    <div>
      <div className="flex justify-center  flex-col h-screen">
        <div className="text-center">
          <AuthComp type="signin" />
        </div>
      </div>
    </div>
  );
}
