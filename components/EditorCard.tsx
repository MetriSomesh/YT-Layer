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
     <Card className="w-full max-w-md rounded-2xl border border-border bg-card text-center shadow-none transition-colors hover:border-primary">
       <CardHeader className="mt-2">
         <div className="mb-4 flex justify-center">
           <FaUserPlus className="text-4xl text-primary" />
         </div>
         <CardTitle className="font-display justify-center text-2xl font-bold">
           Add Editor
         </CardTitle>
         <CardDescription className="mt-2">
           Select editor of your choice for your youtube channel. Send
           invitation to an editor.
         </CardDescription>
       </CardHeader>
       <CardContent className="flex justify-center">
         <Button
           className="mt-2 w-[160px] rounded-full bg-primary font-bold text-white transition-transform hover:scale-[1.03] hover:bg-primary"
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
