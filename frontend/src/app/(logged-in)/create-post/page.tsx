"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Form,
  FormControl,
  FormDescription,
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

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(1000, { message: "Description must not exceed 1000 characters." }),
  //mock type, roles -> will need API to be updatable
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

export default function CreatePostPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const [loading, setLoading] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(JSON.stringify(values));
  }
  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen">
      <div className="flex flex-wrap w-[70%] h-[500px] my-4">
        <Card className="w-[100%]">
          <CardHeader>
            <CardTitle>Create Post</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col py-5 w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="field-sizing-fixed"
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
                        {/* <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose roles required for your project"/>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value='producer'>Producer</SelectItem>
                                  <SelectItem value='camera operator'>Camera Operator</SelectItem>
                                  <SelectItem value='director'>Director</SelectItem>
                                  <SelectItem value='cinematographer'>Cinematographer</SelectItem>
                                  <SelectItem value='editor'>Editor</SelectItem>
                                  <SelectItem value='sound mixer'>Sound Mixer</SelectItem>
                                  <SelectItem value='prop master'>Prop Master</SelectItem>
                                  <SelectItem value='audio technician'>Audio Technician</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select> */}
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
                />
                <Button type="submit">Create Post</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
