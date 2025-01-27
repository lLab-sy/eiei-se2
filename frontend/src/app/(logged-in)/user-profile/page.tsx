import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "postcss";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email().max(100, ""),
  phone: z.string().min(9).max(9),
  gender: z.enum(["Male", "Female", "Non-binary", "Other"]),
});
type formType = typeof formSchema;
export default function UserPage() {
  const form = useForm<z.infer<formType>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });
  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <fieldset disabled={form.formState.isSubmitting}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      {/* <Input {...field} type="text" /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
