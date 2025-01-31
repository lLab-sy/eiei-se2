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
//Multiselect: https://shadcnui-expansions.typeart.cc/docs/multiple-selector
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { useState } from "react";
import Image from "next/image";
// import { useRouter } from "next/navigation"; //for renavigation after finishing

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  postname: z
    .string()
    .trim() //prevent case of PURELY whitespace
    .min(4, { message: "Project name must be at least 4 characters." })
    .max(100, { message: "Project name must not exceed 100 characters." }),
  description: z
    .string()
    .trim() //prevent case of PURELY whitespace
    .min(50, { message: "Description must be at least 50 characters." })
    .max(1000, { message: "Description must not exceed 1000 characters." }),
  //mock type, roles -> will need API to be updatable
  type: z.enum(["media", "short", "drama", "ads"], {
    required_error: "Please select your media type",
  }),
  roles: z
    .array(optionSchema)
    .min(1, { message: "Please choose at least one role." }),
});
//mock options -> will need API to be updatable
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

export default function CreatePostPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postname: "",
      description: "",
      type: "media",
    },
  });
  /*  TODO: wait for the need to use renavigate
  const router = useRouter(); */

  function onSubmit(values: z.infer<typeof formSchema>) {
    const postData = {
      roles: values.roles.map((obj) => obj.value),
      postname: values.postname,
      type: values.type,
      desc: values.description,
      image: img.image
    };
    const formdata = new FormData();
    console.log(postData);
    console.log(JSON.stringify(postData));
    /*  TODO: await for API to finish then renavigate
    router.push(`/my-post`); */
  }
  const [img,setImg] = useState({image:""});
  const onImgChange = (e:any) => {
    console.log(e.target.files)
    console.log(e.target.files.length)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 2048*2048){
        return
      }
      setImg({ image: URL.createObjectURL(file)})
    }
  }
  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen">
      <div className="flex flex-wrap flex-row sm:w-[70%] w-[100%] h-[500px] my-4">
        <Card className="w-[100%]">
          <CardHeader>
            <CardTitle>Create Post</CardTitle>
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
                      <FormLabel>Post name</FormLabel>
                      <FormControl>
                        <Input placeholder="Help Required" {...field} />
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
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="I'm making a short film."
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
                            <SelectValue placeholder="Choose your media type." />
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
                      <FormLabel>Role Requirement</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          {...field}
                          defaultOptions={OPTIONS}
                          placeholder="Choose roles required for your project"
                          hidePlaceholderWhenSelected
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              No result found.
                            </p>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  // still lacking picture but uncertain if needed
                />
                <Button type="submit">Create Post</Button>
              </form>
            </Form>
          </CardContent>
          <CardContent className="w-[40%]">
            <CardTitle className="text-sm">Your Post Picture</CardTitle>
            <div>
                <Image src={img.image ? img.image:"/image/logo.png"} 
                alt="Post Image Here" 
                width={parent.innerWidth}
                height={parent.innerHeight}
                className="max-h-48 object-scale-down" 
                priority
                placeholder= "empty"/>
              <Input 
                type="file"
                className="file:text-mainyellow-light file:font-medium bg-mainblue my-5 cursor-pointer hover:bg-mainblue-light text-white"
                placeholder= "Your post picture"
                onChange={onImgChange}
                />
            </div>
          </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
