export default function AuthComp({ type }: { type: string }) {
  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 ">
          <div>
            <div className="px-10">
              <div className="text-3xl font-extrabold">
                {" "}
                {type === "signup" ? "Sign Up" : "Sign In"}
              </div>
            </div>
            <div className="pt-2">
              <LabelledInput label="Username" placeholder="John Doe" />
              {type === "signup" ? (
                <LabelledInput label="Email" placeholder="jhondoe@gmail.com" />
              ) : null}
              <LabelledInput
                label="Password"
                type={"password"}
                placeholder="password"
              />
              <button
                type="button"
                className="mt-8 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              >
                {type === "signup" ? "Sign Up" : "Sign In"}
              </button>

              <div className="text-xs mt-2">
                {type === "signup"
                  ? "Already have an account?"
                  : "Don't have an account? "}
                <a
                  href={type === "signup" ? "/signin" : "/signup"}
                  className="underline text-[#3430ff]"
                >
                  {" "}
                  {type === "signup" ? "Signin" : "Signup"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: string;
}

function LabelledInput({ label, placeholder, type }: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4 text-start">
        {label}
      </label>
      <input
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
