"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import styles from "./animation.module.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { ScrollArea } from "@/components/ui/scroll-area";
import Rating from "@mui/material/Rating";
import axios from "axios";
import { setUser } from "@/redux/user/user.slice";

//missing
//sort position form error
//upload photo functionality

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
    bankName: z.string().optional(),
    accountHolderName: z.string().optional(),
    accountNumber: z.string().optional(),
    payment_type: z.enum(["creditDebit", "qrCode"], {
      required_error: "Select Your Payment Type",
    }),
    card_name: z.string().optional(),
    card_number: z.string().optional(),
    company: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .max(20, "Password must contain at most 20 characters")
      .regex(new RegExp(".*[ -/:-@[-`{-~].*"), {
        message: "Password should contain at least one special characters",
      }),
    confirmPassword: z.string(),
    occupation: z.string().optional(),
    skill: z.array(z.any()).optional(),
    experience: z.coerce.number().optional(),
    rating: z
      .array(
        z.object({
          ratingScore: z.number().optional(),
          comment: z.string().optional(),
        }),
      )
      .optional(),
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

type formType = z.infer<typeof formSchema>;
export default function UserPage() {
  // Redux State
  const user: any = useSelector<RootState>((state) => state.user);
  const dispatch = useDispatch<AppDispatch>()

  const userData : any = user.user
  console.log('userData' ,userData)
  
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userData?.email ?? "test@test.com",
      phone: userData?.phoneNumber ?? "1234567890",
      bankName: userData?.bankAccount?.bankName ??"default",
      accountHolderName: userData?.bankAccount?.accountHolderName ??"Tien",
      accountNumber: userData?.bankAccount?.accountNumber ?? "12345678",
      card_name: userData?.nameOnCard ?? "default",
      card_number: userData?.cardNumber ?? "default",
      firstName: userData?.firstName ?? "default",
      middleName: userData?.middleName ?? "default",
      lastName: userData?.lastName ?? "default",
      password: userData?.password ?? "12345678!",
      confirmPassword: userData?.password ?? "12345678!",
      payment_type: userData?.paymentType ?? "qrCode",
      occupation: userData?.occupation ?? "TestOccupation",
      skill: userData?.skill ?? [],
      experience: userData?.experience ?? 0,
      company: userData?.company ??"Ayodia",
      gender: userData.gender
    },
  });
  useEffect(() => {
    if (userData) {
      form.reset({
        email: userData.email ?? "test@test.com",
        phone: userData.phoneNumber ?? "1234567890",
        bankName: userData.bankAccount?.bankName ?? "default",
        accountHolderName: userData.bankAccount?.accountHolderName ?? "Tien",
        accountNumber: userData.bankAccount?.accountNumber ?? "12345678",
        card_name: userData.nameOnCard ?? "default",
        card_number: userData.cardNumber ?? "default",
        firstName: userData.firstName ?? "default",
        middleName: userData.middleName ?? "default",
        lastName: userData.lastName ?? "default",
        password: "12345678!",
        confirmPassword: "12345678!",
        payment_type: userData.paymentType ?? "qrCode",
        occupation: userData.occupation ?? "TestOccupation",
        skill: userData.skill ?? [],
        experience: userData.experience ?? 0,
        company: userData.company ?? "Ayodia",
        gender: userData.gender
      });
    }
  }, [userData, form.reset]);
  /*
  Image

  use axios to post into database return it back and use that image to show
  */
  const [isEdit, setIsEdit] = useState(false);
  const [click, setClick] = useState(0);
  const { toast } = useToast();
  // redux to dispatch changes
  const [paymentState, setPaymentState] = useState(userData?.paymentType ?? "");
  const handleSubmit = async (data: formType) => {
    //dispatch to update each case or change only display to none else hidden
    // console.log(form.getValues());
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    const bankAccount = {
      bankName: data.bankName,
      accountHolderName: data.accountHolderName,
      accountNumber: data.accountNumber,
    };
    const sendUserData = {
      ...userData,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      phoneNumber: data.phone,
      gender: data.gender,
      bankAccount: bankAccount,
      profileImage: "",
      role: user?.user?.role,
      password: data.password,
      email: data.email,
    };
    const producerData = {
      ...sendUserData,
      company: data.company,
      paymentType: data.payment_type,
      nameOnCard: data.card_name,
      cardNumber: data.card_number,
    };
    const productionData = {
      ...sendUserData,
      occupation: data.occupation,
      skill: data.skill,
      experience: data.experience,
    };
    // console.log("production data", productionData);
    const id = user.user._id;
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/users/update-user/${id}`;
    const returnUser = await axios.put(
      apiUrl,
      user.user.role === "producer" ? producerData : productionData,
    );
    if (!returnUser) {
      throw new Error("Failed Api");
    }
    if (returnUser.data.status == "error") {
      toast({
        variant: "destructive",
        title: "Edit Profile",
        description: returnUser.data.data ?? "Failed to Edit User",
      });
      return;
    }

    toast({
      variant: "default",
      title: "Edit Profile",
      description: "Edit Profile Successful",
    });
    dispatch(setUser((userData.role === 'producer') ? producerData : productionData))
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
  // mock data
  const OPTIONS: Option[] = [
    { label: "Cameraman", value: "cameraman" },
    { label: "Lighting", value: "lighting" },
    { label: "Editing", value: "editing" },
    { label: "Programming", value: "Programming" },
    { label: "Nuxt", value: "nuxt" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
    { label: "Angular", value: "angular" },
    { label: "Ember", value: "ember", disable: true },
    { label: "Gatsby", value: "gatsby", disable: true },
    { label: "Astro", value: "astro" },
  ];

  // state redux
  return (
    <main className="font-serif min-h-screen flex bg-blue-400 relative items-center justify-center">
      <div className="flex justify-around w-[60%] h-[800px]">
        <Card className="w-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-md text-center font-serif font-bold flex justify-center h-[50px] items-center">
              {userData.firstName} {userData.middleName} {userData.lastName}
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
                className="mt-5  bg-black w-[50%]  after:content-['Upload'] cursor-pointer after:text-white after:text-xl after:absolute relative after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:top-[50%]"
                placeholder="Upload New Photo"
                onChange={onImageChange}
              />
            </div>
          </CardContent>
        </Card>
        <Card className=" relative w-[500px] flex flex-col">
          <CardHeader className="">
            <CardTitle>Edit Profile ({user.user.role})</CardTitle>
          </CardHeader>
          <CardContent className="w-[500px] flex flex-col relative h-full">
            <div className="flex flex-row w-[60%] justify-between">
              <Link
                href={"#"}
                onClick={() => setClick(0)}
                className={` ${styles.divLine} text-nowrap  hover:after:scale-x-100 after:bg-blue-200 after:content-[''] after:w-[70px] after:h-[4px] after:absolute  after:left-[5%] after:top-[4.8%] ${click == 0 ? "after:scale-x-100" : "after:scale-x-0"}`}
              >
                User Info
              </Link>
              <Link
                href={"#"}
                onClick={() => setClick(1)}
                className={`${styles.divLines} ml-[24%] text-nowrap hover:after:scale-x-100 cursor-pointer after:bg-blue-200 after:content-[''] after:w-[150px] after:h-[4px] after:absolute after:left-[31%] after:top-[4.8%] ${click == 1 ? "after:scale-x-100" : "after:scale-x-0"}`}
              >
                Billing Information
              </Link>
              {user && user?.user?.role === "producer" ? (
                ""
              ) : (
                <Link
                  href={"#"}
                  onClick={() => setClick(2)}
                  className={`${styles.divLines} ml-[24%] text-nowrap hover:after:scale-x-100 cursor-pointer after:bg-blue-200 after:content-[''] after:w-[60px] after:h-[4px] after:absolute after:left-[69%] after:top-[4.8%] ${click == 2 ? "after:scale-x-100" : "after:scale-x-0"}`}
                >
                  Skill
                </Link>
              )}
            </div>
            <Separator className="my-3" />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="h-[60%]"
              >
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="h-[100%] flex items-start"
                >
                  <div
                    className={`${click == 0 ? "" : "hidden"} h-full flex flex-row space-y-0 w-[100%] flex-wrap  justify-between `}
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
                          <FormMessage />
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
                          <FormMessage className="md:text-xs text-sm" />
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
                          <FormMessage className="md:text-xs text-sm" />
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
                          <FormMessage className="md:text-xs text-sm" />
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
                          <FormMessage className="md:text-xs text-sm" />
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
                    <div
                      className={`absolute bottom-0 w-[90%] pb-10 flex flex-row ${isEdit ? "justify-between" : "justify-end"}`}
                    >
                      <Button
                        className={`${isEdit ? "" : "hidden"}  w-[30%] text-white bg-green-400 hover:bg-green-500`}
                        type="submit"
                        onSubmit={form.handleSubmit(handleSubmit)}
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
                    </div>
                    {/* <FormItem className="flex pt-[5%] flex-col w-[100%]">
                      
                    </FormItem> */}
                  </div>
                  <div
                    className={`${click == 1 ? "" : "hidden"} w-[100%] flex flex-col justify-start h-full`}
                  >
                    <FormField
                      name="bankName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input disabled={!isEdit} type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="accountHolderName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Holder Name</FormLabel>
                          <FormControl>
                            <Input disabled={!isEdit} type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="accountNumber"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input disabled={!isEdit} type="text" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {user && user?.user?.role === "producer" ? (
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
                                    <SelectItem value="qrCode">
                                      QR Code
                                    </SelectItem>
                                    <SelectItem value="creditDebit">
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
                    ) : (
                      ""
                    )}

                    {/* <div>{paymentState}</div> */}
                    {(paymentState === "creditDebit") ? (
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
                    <div
                      className={`absolute bottom-0 w-[90%] pb-10 flex flex-row ${isEdit ? "justify-between" : "justify-end"}`}
                    >
                      <Button
                        className={`${isEdit ? "" : "hidden"}  w-[30%] text-white bg-green-400 hover:bg-green-500`}
                        type="submit"
                        onSubmit={form.handleSubmit(handleSubmit)}
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
                    </div>
                  </div>
                  <div
                    className={`${click == 2 ? "" : "hidden"} w-[100%] flex flex-col justify-start h-full`}
                  >
                    <FormField
                      name="occupation"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Occupation</FormLabel>
                          <Input {...field} type="text" disabled={!isEdit} />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="skill"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skill</FormLabel>
                          <div className="w-full">
                            <FormControl>
                              <MultipleSelector
                                {...field}
                                disabled={!isEdit}
                                defaultOptions={OPTIONS}
                                value={OPTIONS.filter((opt) =>
                                  field.value?.includes(opt.value),
                                )}
                                onChange={(selected) => {
                                  const valueOnly = selected.map(
                                    (item) => item.value,
                                  );
                                  field.onChange(valueOnly);
                                }}
                                placeholder="Select your skills"
                                emptyIndicator={
                                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                    no results found.
                                  </p>
                                }
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="experience"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience</FormLabel>
                          <Input {...field} type="number" disabled={!isEdit} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem className="">
                      <FormLabel>Review</FormLabel>
                      <ScrollArea className="h-60 rounded-md border">
                        <div className="cursor-default flex flex-col py-2 px-1 text-left">
                          <Rating
                            readOnly
                            name="half-rating"
                            defaultValue={2.5}
                            precision={0.5}
                          />
                          <span>
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Iusto, accusamus. Aperiam cumque suscipit
                            consequuntur sapiente, delectus fugit, voluptatem
                            deleniti nulla fugiat magni quis eius voluptas
                            cupiditate doloribus? Odio, sed beatae!
                          </span>
                        </div>
                        <div className="flex flex-col py-2 px-1 text-left">
                          <Rating
                            readOnly
                            name="half-rating"
                            defaultValue={2.5}
                            precision={0.5}
                          />
                          <span>
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Iusto, accusamus. Aperiam cumque suscipit
                            consequuntur sapiente, delectus fugit, voluptatem
                            deleniti nulla fugiat magni quis eius voluptas
                            cupiditate doloribus? Odio, sed beatae!
                          </span>
                        </div>
                      </ScrollArea>
                    </FormItem>
                  </div>
                  <div
                    className={`absolute bottom-0 w-[90%] pb-10 flex flex-row ${isEdit ? "justify-between" : "justify-end"}`}
                  >
                    <Button
                      className={`${isEdit ? "" : "hidden"}  w-[30%] text-white bg-green-400 hover:bg-green-500`}
                      type="submit"
                      onSubmit={form.handleSubmit(handleSubmit)}
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
