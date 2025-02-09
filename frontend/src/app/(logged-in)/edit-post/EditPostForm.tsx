import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import MultipleSelector, { Option } from "@/components/ui/multiselect";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  postname: z.string().trim().min(4).max(100),
  description: z.string().trim().min(50).max(1000),
  type: z.enum(["media", "short", "drama", "ads"]),
  roles: z.array(optionSchema).min(1),
});

const OPTIONS: Option[] = [
  { label: "Producer", value: "producer" },
  { label: "Camera Operator", value: "camera operator" },
  { label: "Director", value: "director" },
];

export default function EditPostForm({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postname: "",
      description: "",
      type: "media",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="postname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Help Required"
                  {...field}
                  onChange={(event) => field.onChange(event.target.value)} // ✅ แก้ตรงนี้
                />
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
                  placeholder="Describe your project..."
                  {...field}
                  onChange={(event) => field.onChange(event.target.value)} // ✅ แก้ตรงนี้
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({
            field,
          }: {
            field: { value: string; onChange: (value: string) => void };
          }) => (
            <FormItem>
              <FormLabel>Media Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose type" />
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
          render={({
            field,
          }: {
            field: { value: Option[]; onChange: (value: Option[]) => void };
          }) => (
            <FormItem>
              <FormLabel>Roles Required</FormLabel>
              <FormControl>
                <MultipleSelector
                  {...field}
                  defaultOptions={OPTIONS}
                  placeholder="Select roles"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}
