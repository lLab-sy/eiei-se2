import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  postname: z
    .string()
    .trim()
    .min(4, { message: "Project name must be at least 4 characters." })
    .max(100, { message: "Project name must not exceed 100 characters." }),
  description: z
    .string()
    .trim()
    .min(50, { message: "Description must be at least 50 characters." })
    .max(1000, { message: "Description must not exceed 1000 characters." }),
  type: z.enum(["media", "short", "drama", "ads"], {
    required_error: "Please select your media type",
  }),
  roles: z
    .array(optionSchema)
    .min(1, { message: "Please choose at least one role." }),
});

const OPTIONS: Option[] = [
  { label: "Producer", value: "producer" },
  { label: "Camera Operator", value: "camera operator" },
  { label: "Director", value: "director" },
  { label: "Cinematographer", value: "cinematographer" },
  { label: "Editor", value: "editor" },
  { label: "Sound Mixer", value: "sound mixer" },
  { label: "Prop Master", value: "prop master" },
  { label: "Audio Technician", value: "audio technician" },
];

export default function EditPostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [img, setImg] = useState<string[]>([]);
  const [mostRecentImg, setMostRecentImg] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postname: "",
      description: "",
      type: "media",
      roles: [],
    },
  });

  useEffect(() => {
    if (id) {
      // ดึงข้อมูลโพสต์จาก API
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          form.reset({
            postname: data.postName,
            description: data.description,
            type: data.type,
            roles: data.roles.map((role: string) => ({ label: role, value: role })),
          });
          setImg(data.images);
        })
        .catch((error) => console.error('Error fetching post:', error));
    }
  }, [id, form]);

  const onImgChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const files: File[] = Array.from(e.target.files);
      const filenames = files.map((file) => URL.createObjectURL(file));
      setMostRecentImg(filenames[filenames.length - 1]);
      const newImg = [...img, ...filenames];
      setImg(newImg);
    }
  };

  const removeImg = (imgSrc: string) => {
    setImg(img.filter((img) => img !== imgSrc));
    if (mostRecentImg === imgSrc) setMostRecentImg(img[img.length - 2]);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const postData = {
      postProjectRoles: values.roles.map((obj) => obj.value),
      postName: values.postname,
      postMediaType: values.type,
      postDescription: values.description,
      images: img,
    };
    console.log(postData);
    // TODO: ส่งข้อมูลไปยัง API เพื่ออัปเดตโพสต์
  }

  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen">
      <div className="flex flex-wrap flex-row sm:w-[70%] w-[100%] my-12 px-18">
        <Card className="w-[100%]">
          <CardHeader>
            <CardTitle className="justify-center flex">Edit Post</CardTitle>
          </CardHeader>
          <div className="flex flex-row">
            <CardContent className="flex flex-col py-5 w-[60%]">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Form fields เหมือนกับหน้า Create Post */}
                </form>
              </Form>
            </CardContent>
            <CardContent className="w-[40%] py-5">
              {/* Image upload section เหมือนกับหน้า Create Post */}
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}