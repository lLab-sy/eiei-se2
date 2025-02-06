"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useState, useEffect } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  postname: z
    .string()
    .trim()
    .min(4, { message: "Post name must be at least 4 characters." })
    .max(100, { message: "Post name must not exceed 100 characters." }),
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

// Mock options -> Replace with API call if necessary
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

// Mock function to fetch post data for editing
const fetchPostData = async (postId: string) => {
  return {
    postname: "My Amazing Short Film",
    description: "This is a short film about life, dreams, and reality.",
    type: "short",
    roles: [
      { label: "Director", value: "director" },
      { label: "Editor", value: "editor" },
    ],
    images: [
      { imgSrc: "/image/mock1.jpg", imgFile: null },
      { imgSrc: "/image/mock2.jpg", imgFile: null },
    ],
  };
};

export default function EditPostPage({ postId }: { postId: string }) {
  const { toast } = useToast();
  const [img, setImg] = useState<{ imgSrc: string; imgFile: File | null }[]>(
    []
  );
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
    const loadPostData = async () => {
      const postData = await fetchPostData(postId);
  
      // Validate the type value against the expected enums
      const validTypes = ["media", "short", "drama", "ads"] as const;
  
      const postType = validTypes.includes(postData.type as typeof validTypes[number])
        ? (postData.type as "media" | "short" | "drama" | "ads")
        : "media"; // Default to "media" if the type is invalid
  
      form.reset({
        postname: postData.postname,
        description: postData.description,
        type: postType, // Use the validated value
        roles: postData.roles.map((role) => ({
          label: role.label,
          value: role.value,
          disable: false,
          //disable: role.disable ?? false, // Ensure compatibility with your schema
        })),
      });
    };
  
    loadPostData();
  }, [postId, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const postImage = img.map((img) => img.imgSrc);
    const updatedPostData = {
      postName: values.postname,
      postDescription: values.description,
      postMediaType: values.type,
      postProjectRoles: values.roles.map((role) => role.value),
      postImages: postImage,
    };

    console.log("Updated Post Data: ", updatedPostData);
    // API call to update post here
  };

  const onImgChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const files: File[] = Array.from(e.target.files);
      if (files.length + img.length > 3) {
        toast({
          variant: "destructive",
          title: "Picture count limit",
          description: "Only up to 3 pictures are allowed.",
        });
        return;
      }

      const newImages = files.map((file) => ({
        imgSrc: URL.createObjectURL(file),
        imgFile: file,
      }));
      setMostRecentImg(newImages[newImages.length - 1]?.imgSrc || "");
      setImg([...img, ...newImages]);
    }
  };

  const removeImg = (imgSrc: string) => {
    setImg(img.filter((img) => img.imgSrc !== imgSrc));
    if (mostRecentImg === imgSrc && img.length > 1)
      setMostRecentImg(img[img.length - 2]?.imgSrc || "");
  };

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
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="postname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Post Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Post Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Description of the project"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select media type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="media">Media</SelectItem>
                                <SelectItem value="short">Short</SelectItem>
                                <SelectItem value="drama">Drama</SelectItem>
                                <SelectItem value="ads">Ads</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role Requirements</FormLabel>
                        <FormControl>
                          <MultipleSelector
                            {...field}
                            defaultOptions={OPTIONS}
                            placeholder="Select roles required"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Update Post</Button>
                </form>
              </Form>
            </CardContent>
            <CardContent className="w-[40%] py-5">
              <CardTitle className="text-sm">Post Images</CardTitle>
              <div className="flex flex-col items-center">
                <div className="h-1/2">
                  {img.length !== 0 ? (
                    <Image
                      src={mostRecentImg}
                      alt="Post Image"
                      width={parent.innerWidth}
                      height={parent.innerHeight}
                      className="max-h-48 object-scale-down aspect-square"
                      priority
                      placeholder="empty"
                    />
                  ) : (
                    <Image
                      src="/image/logo.png"
                      alt="Post Image"
                      width={parent.innerWidth}
                      height={parent.innerHeight}
                      className="max-h-48 object-scale-down"
                      priority
                      placeholder="empty"
                    />
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  className="file:text-mainyellow-light file:font-medium bg-mainblue my-5 cursor-pointer hover:bg-mainblue-light text-white"
                  onChange={onImgChange}
                  multiple
                  disabled={img.length >= 3}
                />
                <div className="w-[80%] justify-center flex">
                  <Carousel>
                    <CarouselContent>
                      {img.map((image) => (
                        <CarouselItem
                          key={image.imgSrc}
                          className="relative pt-1 justify-center inline-flex flex-col group"
                        >
                          <Image
                            src={image.imgSrc}
                            alt="Post Image"
                            width={parent.innerWidth}
                            height={parent.innerHeight}
                            className="max-h-48 object-contain aspect-square cursor-pointer bg-maingrey"
                            onClick={() => setMostRecentImg(image.imgSrc)}
                          />
                          <X
                            className="absolute top-1 right-1 hidden group-hover:block bg-mainblue-lightest cursor-pointer"
                            onClick={() => removeImg(image.imgSrc)}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <Label>Total: {img.length}</Label>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
