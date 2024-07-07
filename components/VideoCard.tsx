import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function VideoCard() {
  return (
    <Card className="w-[400px] text-center">
      <CardHeader className="mt-2">
        <CardTitle className="justify-center mb-2">Video Controller</CardTitle>
        <CardDescription className="mt-2">
          Watch video edited by editor and take actions according to the
          expectations
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button className="mt-2 w-[90px]">View</Button>
      </CardContent>
    </Card>
  );
}
