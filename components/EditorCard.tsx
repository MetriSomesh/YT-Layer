import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaUserPlus } from "react-icons/fa";

export const EditorCard = () => {
   return (
     <Card className="w-[400px] text-center bg-gray-800 border-gray-700 shadow-xl hover:shadow-2xl transition-shadow duration-300">
       <CardHeader className="mt-2">
         <div className="flex justify-center mb-4">
           <FaUserPlus className="text-4xl text-green-500" />
         </div>
         <CardTitle className="justify-center mb-2 text-2xl font-bold text-white">
           Add Editor
         </CardTitle>
         <CardDescription className="mt-2 text-gray-400">
           Select editor of your choice for your youtube channel. Send
           invitation to an editor.
         </CardDescription>
       </CardHeader>
       <CardContent className="flex justify-center">
         <Button
           className="mt-2 w-[120px] bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300"
           onClick={() => {
             window.location.href = "/addeditor";
           }}
         >
           Add Editor
         </Button>
       </CardContent>
     </Card>
   );
};
