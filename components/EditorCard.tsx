import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const EditorCard = () => {
  return (
    <Card className="w-[400px] text-center">
      <CardHeader className="mt-2">
        <CardTitle className="justify-center mb-2">Add Editor</CardTitle>
        <CardDescription className="mt-2">
          Select editor of your choice for your youtube channel. Send invitation
          to an editor.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button
          className="mt-2 w-[90px]"
          onClick={() => {
            window.location.href = "http://localhost:3000/addeditor";
          }}
        >
          Add
        </Button>
      </CardContent>
    </Card>
  );
};
