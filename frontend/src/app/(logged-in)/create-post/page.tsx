"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreatePostPage() {
  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen">
      <div className="flex flex-wrap w-[70%] h-[500px] my-4">
        <Card className="w-[100%]">
          <CardHeader>
            <CardTitle>Create Post</CardTitle>
          </CardHeader>
          <div className="w-[30%]">
            <CardContent></CardContent>
          </div>
          <div className="w-[70%]">
            <CardContent className="flex flex-col py-5">
              <div className="w-full py-5">
                <Label>Project Description</Label>
                <Input type="text" placeholder="Your project description" />
              </div>
              <div>
                <Button>Create Post</Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
