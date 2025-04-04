"use client";

import {
  CardContent,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { userLogin } from "./action";
import Image from "next/image";

const formSchema = z.object({
  username: z
    .string()
    .min(5, "Username must contain at least 5 characters")
    .max(50, "Username must contain at most 50 characters"),
  // .regex(new RegExp("^[^0-9]*$"), "Username must not contain number"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(20, "Password must contain at most 20 characters")
    .regex(new RegExp(".*[ -/:-@[-`{-~].*"), {
      message: "Password should contain at least one special character",
    }),
});

type FormFields = z.infer<typeof formSchema>;

export default function LoginPage() {
  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { toast } = useToast();

  const handleSubmit = async (data: FormFields) => {
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // console.log("Login attempt with username:", data.username);
    // toast({
    //   variant: "default",
    //   title: "Login",
    //   description: "Login Successful",
    // });
    await userLogin(data);
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-slate-200">
      <Card className="w-[100vw] h-[100vh] flex flex-col justify-start md:h-full md:w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center flex-col">
            <div className="relative size-40 flex md:hidden">
              <Image
                src="/image/logo-preview.png"
                alt="BualoiDev Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className='mt-5 md:mt-0'>Login to EiEi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <fieldset disabled={form.formState.isSubmitting}>
            <Form {...form}>
              <form
                className="flex flex-col space-y-4"
                onSubmit={form.handleSubmit(handleSubmit)}
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w- md:w-[25%]">
                  Login
                </Button>
              </form>
            </Form>
          </fieldset>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
