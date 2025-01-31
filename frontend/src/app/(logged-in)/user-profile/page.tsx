"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import styles from "./animation.module.css";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

//missing
//sort position form error
//upload photo functionality
// reponsive

const formSchema = z
  .object({
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().max(100, ""),
    phone: z
      .string()
      .length(10, "Phone Number must contain exactly to 10 characters"),
    gender: z.enum(["Male", "Female", "Non-Binary", "Other"]).optional(),
    bank_account: z.string(),
    payment_type: z.enum(["Credit/Debit", "QR_Code"], {
      required_error: "Select Your Payment Type",
    }),
    card_name: z.string().optional(),
    card_number: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .max(20, "Password must contain at most 20 characters")
      .regex(new RegExp(".*[ -/:-@[-`{-~].*"), {
        message: "Password should contain at least one special characters",
      }),
    confirmPassword: z.string(),
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
type formType = typeof formSchema;
export default function UserPage() {
  const form = useForm<z.infer<formType>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "test@test.com",
      phone: "1234567890",
      bank_account: "default",
      card_name: "default",
      card_number: "default",
      firstName: "default",
      middleName: "default",
      lastName: "default",
      password: "1234567890!",
      confirmPassword: "1234567890!",
      payment_type: "QR_Code",
    },
  });
  /*
  Image

  use axios to post into database return it back and use that image to show
  */
  const [isEdit, setIsEdit] = useState(false);
  const [click, setClick] = useState(true);
  const { toast } = useToast();
  // redux to dispatch changes
  const [paymentState, setPaymentState] = useState("");
  const handleSubmit = async () => {
    //dispatch to update each case or change only display to none else hidden
    console.log(form.getValues());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      variant: "default",
      title: "Edit Profile",
      description: "Edit Profile Successful",
    });
    setIsEdit(false);
  };
  const [img, setImageState] = useState({
    image: "",
  });

  const onImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      // setImgState(e.target.files[0])
      setImageState({
        image: URL.createObjectURL(e.target.files[0]),
      });
      // console.log(e.target.files)
    }
  };
  return (
    <main className="font-serif min-h-screen flex bg-blue-400 relative items-center justify-center">
      <div className="flex justify-around w-[60%] h-[650px]">
        <Card className="w-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-2xl font-serif font-bold flex justify-center h-[50px] items-center">
              Name
            </div>
            {/* <div className="bg-black w-[150px] h-[150px] rounded-full">
              <Image src={} alt=''/>
            </div> */}
            <Avatar className="size-60">
              <AvatarImage src={img.image} alt="" />
              <AvatarFallback className="border border-black rounded-full"></AvatarFallback>
            </Avatar>
            <div className="w-[100%] flex justify-center">
              <Input
                id="picture"
                type="file"
                className="mt-5 bg-black w-[50%]  after:content-['Upload'] cursor-pointer after:text-white after:text-xl after:absolute relative after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:top-[50%]"
                placeholder="Upload New Photo"
                onChange={onImageChange}
              />
            </div>
          </CardContent>
        </Card>
        <Card className=" relative w-[500px] flex flex-col">
          <CardHeader className="">
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="w-[500px] flex flex-col relative h-full">
            <div className="flex flex-row w-[60%] justify-between">
              <Link
                href={""}
                onClick={() => setClick(true)}
                className={` ${styles.divLine} text-nowrap  hover:after:scale-x-100 after:bg-blue-200 after:content-[''] after:w-[70px] after:h-[3px] after:absolute  after:left-[5%] after:top-[6%] ${click ? "after:scale-x-100" : "after:scale-x-0"}`}
              >
                User Info
              </Link>
              <Link
                href={""}
                onClick={() => setClick(false)}
                className={`${styles.divLines} ml-[24%] text-nowrap hover:after:scale-x-100 cursor-pointer after:bg-blue-200 after:content-[''] after:w-[150px] after:h-[3px] after:absolute after:left-[31%] after:top-[6%] ${!click ? "after:scale-x-100" : "after:scale-x-0"}`}
              >
                Billing Information
              </Link>
            </div>
            <Separator className="my-3" />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="h-[80%]"
              >
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="h-[100%] flex items-start"
                >
                  <div
                    className={`${click ? "" : "hidden"} flex flex-row w-[100%] flex-wrap justify-between `}
                  >
                    <FormField
                      name="firstName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="w-[40%]">
                          <FormLabel className="">First Name</FormLabel>
                          <FormControl>
                            <Input disabled={!isEdit} {...field} type="text" />
                          </FormControl>
                          <FormMessage  />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="middleName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="w-[40%]">
                          <FormLabel className="">Middle Name</FormLabel>
                          <FormControl>
                            <Input disabled={!isEdit} {...field} type="text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="lastName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="w-[40%]">
                          <FormLabel className="">Last Name</FormLabel>
                          <FormControl>
                            <Input disabled={!isEdit} {...field} type="text" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-[40%]">
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input disabled={!isEdit} {...field} type="text" />
                          </FormControl>
                          <FormMessage className='md:text-xs text-sm' />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="w-[40%]">
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input disabled={!isEdit} {...field} type="text" />
                          </FormControl>
                          <FormMessage className='md:text-xs text-sm' />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="gender"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className=" w-[40%]">
                          <FormLabel className="r">Gender</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger disabled={!isEdit} className="">
                                <SelectValue placeholder="Select Your Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                  <SelectItem value="Non-Binary">
                                    Non-Binary
                                  </SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className='md:text-xs text-sm' />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="password"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className=" w-[40%]">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              disabled={!isEdit}
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='md:text-xs text-sm' />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="confirmPassword"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className=" w-[40%]">
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              disabled={!isEdit}
                              type="password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem className={`pt-5 flex flex-row items-baseline w-[100%] ${!isEdit ? 'justify-end' : 'justify-between'}`}>
                      <Button
                        className={`${isEdit ? "" : "hidden"} w-[30%] text-white bg-green-400 hover:bg-green-500`}
                        type="submit"
                      >
                        Update Info
                      </Button>
                      <Button
                        variant={`${isEdit ? "destructive" : "default"}`}
                        type="reset"
                        onClick={() => setIsEdit(!isEdit)}
                        className={` w-[30%]`}
                      >
                        {isEdit ? "Cancel" : "Edit"}
                      </Button>
                    </FormItem>
                    {/* <FormItem className="flex pt-[5%] flex-col w-[100%]">
                      
                    </FormItem> */}
                  </div>
                  <div className={`${click ? "hidden" : ""} w-[100%] `}>
                    <FormField
                      name="bank_account"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Account</FormLabel>
                          <FormControl>
                            <Input disabled={!isEdit} type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="payment_type"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Payment Type</FormLabel>
                          <FormControl>
                            <Select
                              disabled={!isEdit}
                              value={field.value}
                              onValueChange={(e) => {
                                field.onChange(e);
                                setPaymentState(e);
                              }}

                              // {...form.register("payment_type")}
                            >
                              <SelectTrigger disabled={!isEdit}>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectItem value="QR_Code">
                                    QR Code
                                  </SelectItem>
                                  <SelectItem value="Credit/Debit">
                                    Credit/Debit
                                  </SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* <div>{paymentState}</div> */}
                    {paymentState === "Credit/Debit" ? (
                      <div className="  flex flex-col justify-around py-4 h-[200px]">
                        <FormField
                          name="card_name"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name on card</FormLabel>
                              <Input
                                disabled={!isEdit}
                                {...field}
                                type="text"
                              />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="card_number"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number</FormLabel>
                              <Input
                                disabled={!isEdit}
                                {...field}
                                type="text"
                              />
                            </FormItem>
                          )}
                        />
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </fieldset>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
