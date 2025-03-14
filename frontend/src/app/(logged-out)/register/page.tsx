"use client";
import {
  CardContent,
  Card,
  CardDescription,
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
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createUser } from "./action";

const formSchema = z
  .object({
    username: z
      .string()
      .min(5, "Username must contain at least 5 characters")
      .max(50, "Username must contain at most 50 characters")
      // .regex(new RegExp("^[^0-9]*$"), "Username must not contain number"),
    ,password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .max(20, "Password must contain at most 20 characters")
      .regex(new RegExp(".*[ -/:-@[-`{-~].*"), {
        message: "Password should contain at least one special characters",
      }),
    confirmPassword: z.string(),
    option: z.enum(["producer", "production professional"], {
      required_error: "You need to select your role",
    }),
  })
  .superRefine((val, ctx) => {
    if (val.password != val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Password do not match",
      });
    }
  });

type formFields = typeof formSchema;
export default function RegisterPage() {
  // console.log('process',process.env.NEXT_PUBLIC_BASE_URL)
  const form = useForm<z.infer<formFields>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      option: 'producer'
    },
  });
  const { toast } = useToast()
  const handleSubmit = async (data: z.infer<formFields>) => {
    const params = {
      username : data.username,
      password: data.password,
      role : data.option
    }

    const res = await createUser(params)
    
    if(res.data.status == 'error'){
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: res.data.message ?? "Failed to sign up"
      })
    }
    else{
      toast({
          variant: 'default',
          title: 'Sign Up',
          description: "Sign Up Successful"
      })
      form.resetField('password')
      form.resetField('confirmPassword')
      form.resetField('username')
      form.setValue('option', 'producer')
    }
  };
  return (
    <main className="flex justify-center items-center min-h-screen bg-slate-200">
      <Card className="w-[400px] shadow-lg">
        <CardHeader className='relative'>
        {/* <div className='absolute right-[-23%] top-2'>
              <div className="w-[150px] flex">
                <svg height={50} width={50} xmlns="http://www.w3.org/2000/svg">
                  <circle r={22.5} cx={25} cy={25} fill="blue" />
                  <circle
                    r={16}
                    cx={27.5}
                    cy={22.5}
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <circle
                    r={10}
                    cx={29.5}
                    cy={21}
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  <circle
                    r={4}
                    cx={32}
                    cy={19}
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
                
              </div>
          </div> */}
          <CardTitle className="flex justify-center relative">
            <span>Sign up to EiEi</span>
            
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          
          <Form {...form}>
            <form
              action=""
              className="flex flex-col"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <fieldset disabled={form.formState.isSubmitting}>
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
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="option"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="text-sm">
                        <div className='h-[30px] flex items-center'>
                            Select your role
                        </div>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className=" flex gap-5 h-[40px]"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem
                              id="radio-producer"
                              value="producer"
                            />
                            <Label htmlFor="radio-producer">Producer</Label>
                          </div>

                          <div className=" flex items-center gap-2">
                            <RadioGroupItem
                              id="radio-professional"
                              value="production professional"
                            />
                            <Label htmlFor="radio-professional">
                              Professional
                            </Label>
                          </div>
                          
                        </RadioGroup>
                        <FormMessage className="items-end" />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Register</Button>
              </fieldset>
            </form>
          </Form>
          
          
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
