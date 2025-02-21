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
import { setProfileImageURL, setUser } from "@/redux/user/user.slice";
import { CircularProgress } from "@mui/material";
import ReviewProfessional from "@/components/ReviewProfessional";

//missing
//sort position form error
//upload photo functionality

const formSchema = z.object({
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
  // password: z
  //   .string()
  //   .min(8, "Password must contain at least 8 characters")
  //   .max(20, "Password must contain at most 20 characters")
  //   .regex(new RegExp(".*[ -/:-@[-`{-~].*"), {
  //     message: "Password should contain at least one special characters",
  //   }),
  // confirmPassword: z.string(),
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
});
// .superRefine((val, ctx) => {
//   if (val.password != val.confirmPassword) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       path: ["confirmPassword"],
//       message: "Password do not match",
//     });
//   }
// });

type formType = z.infer<typeof formSchema>;
export default function UserPage() {
  // Redux State
  const user: any = useSelector<RootState>((state) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const userData: any = user.user;
  console.log("userData", userData);
  console.log("user", user);
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userData?.email ?? "",
      phone: userData?.phoneNumber ?? "",
      bankName: userData?.bankAccount?.bankName ?? "",
      accountHolderName: userData?.bankAccount?.accountHolderName ?? "Tien",
      accountNumber: userData?.bankAccount?.accountNumber ?? "12345678",
      card_name: userData?.nameOnCard ?? "",
      card_number: userData?.cardNumber ?? "",
      firstName: userData?.firstName ?? "",
      middleName: userData?.middleName ?? "",
      lastName: userData?.lastName ?? "",
      // password: userData?.password ?? "12345678!",
      // confirmPassword: userData?.password ?? "12345678!",
      payment_type: userData?.paymentType ?? "qrCode",
      occupation: userData?.occupation ?? "",
      skill: userData?.skill ?? [],
      experience: userData?.experience ?? 0,
      company: userData?.company ?? "",
      gender: userData?.gender,
    },
  });
  useEffect(() => {
    if (userData) {
      form.reset({
        email: userData.email ?? "",
        phone: userData.phoneNumber ?? "",
        bankName: userData.bankAccount?.bankName ?? "",
        accountHolderName: userData.bankAccount?.accountHolderName ?? "",
        accountNumber: userData.bankAccount?.accountNumber ?? "",
        card_name: userData.nameOnCard ?? "",
        card_number: userData.cardNumber ?? "",
        firstName: userData.firstName ?? "",
        middleName: userData.middleName ?? "",
        lastName: userData.lastName ?? "",
        // password: "12345678!",
        // confirmPassword: "12345678!",
        payment_type: userData.paymentType ?? "qrCode",
        occupation: userData.occupation ?? "",
        skill: userData.skill ?? [],
        experience: userData.experience ?? 0,
        company: userData.company ?? "",
        gender: userData.gender,
      });
      setPaymentState(userData?.paymentType ?? "qrCode");
    }
  }, [userData, form.reset]);

  const [isEdit, setIsEdit] = useState(false);
  const [click, setClick] = useState(0);
  const { toast } = useToast();
  // redux to dispatch changes
  const [paymentState, setPaymentState] = useState(
    userData?.paymentType ?? "qrCode",
  );
  const handleSubmit = async (data: formType) => {
    const formData = new FormData();

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
      profileImage: userData?.profileImage ?? "",
      role: user?.user?.role,
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
    if (profileImageState) {
      formData.append("profileImage", profileImageState);
    }
    const formDataProducer = formData;
    formDataProducer.append("userData", JSON.stringify(producerData));
    // console.log("production data", productionData);
    const formDataProductionProfessional = formData;
    formDataProductionProfessional.append("userData", productionData);
    const id = user.user._id;
    const token = user.token;
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/users/update-user/${id}`;
    const returnUser = await axios.put(
      apiUrl,
      user.user.role === "producer"
        ? formDataProducer
        : formDataProductionProfessional,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    console.log("returnUser", returnUser);
    if (!returnUser) {
      toast({
        variant: "destructive",
        title: "Edit Profile",
        description: "Failed to Edit User",
      });
      return;
    }
    if (returnUser.data.data.status == "error") {
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
    dispatch(setUser(returnUser.data.data.updatedUser));
    if (returnUser?.data?.data?.url) {
      dispatch(setProfileImageURL(returnUser?.data?.data?.url));
      setImageState({
        image: returnUser?.data?.data?.url ?? "",
      });
      setProfileImageState(null);
      // console.log('user?.profileImageURL ', user?.profileImageURL )
    }
    // dispatch(setProfileImageURL(url))
    setIsEdit(false);
  };
  // Loading State
  const [loadingImage, setLoadingImage] = useState(false);
  const [img, setImageState] = useState({
    image: user.profileImageURL ?? "",
  });
  const [profileImageState, setProfileImageState] = useState<File | null>(null);
  const onImageChange = async (e: any) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Limit File Size",
          description: "File Size Exceed 5 Mb",
        });
        return;
      }
      setProfileImageState(e.target.files[0]);
      // setLoadingImage(true)
      // const id = user.user._id;
      // const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/users/upload-profile/${id}`;
      // const formImage = new FormData()
      // formImage.append('profileImage', e.target.files[0])
      // const response = await axios.post(apiUrl, formImage, {
      //   headers: {
      //     "Content-Type" : "multipart/form-data"
      //   }
      // })
      // console.log('response', response)
      // console.log('loadingImage', loadingImage)
      // const url = await response?.data?.data?.url
      // // setImgState(e.target.files[0])
      // dispatch(setProfileImageURL(url))
      setImageState({
        image: URL.createObjectURL(e.target.files[0]),
      });
      setIsEdit(true);
      // setLoadingImage(false)
      // console.log(e.target.files)
    }
  };
  console.log("profileImageURL", user.profileImageURL);
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

  return (
    <main className=" min-h-screen flex bg-mainblue-light relative items-center justify-center">
      <div className="flex justify-around w-[80%] h-[800px]">
        <Card className="w-[400px] h-[700px] flex flex-col">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="text-xl text-center font-bold flex justify-center h-[50px] items-center">
              {userData.firstName} {userData.middleName} {userData.lastName}
            </div>
            {/* <div className="bg-black w-[150px] h-[150px] rounded-full">
              <Image src={} alt=''/>
            </div> */}
            {loadingImage ? (
              <Avatar className="size-60 bg-slate-400 flex justify-center items-center">
                <CircularProgress size={60} />
              </Avatar>
            ) : (
              <Avatar className="size-60">
                <AvatarImage src={img.image} alt="" />
                <AvatarFallback className="border border-black rounded-full"></AvatarFallback>
              </Avatar>
            )}
            {/* <CircularProgress size={60}/>
            <Avatar className="size-60">
              <AvatarImage src={img.image} alt="" />
              <AvatarFallback className="border border-black rounded-full"></AvatarFallback>
            </Avatar> */}
            <div className="w-full flex flex-col items-center justify-center">
              <label
                htmlFor="picture"
                className="mt-5 w-[50%] bg-blue-500 text-white text-xl py-2 px-4 rounded-lg cursor-pointer text-center"
              >
                Upload File
              </label>
              <input
                id="picture"
                type="file"
                accept=".png, .jpeg, .gif, .webp"
                className="hidden"
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
                className={`${styles.divLines} ml-[24%] text-nowrap hover:after:scale-x-100 cursor-pointer after:bg-blue-200 after:content-[''] after:w-[147px] after:h-[4px] after:absolute after:left-[29%] after:top-[4.8%] ${click == 1 ? "after:scale-x-100" : "after:scale-x-0"}`}
              >
                Billing Information
              </Link>
              {user && user?.user?.role === "producer" ? (
                <div className="ml-[24%]"></div>
              ) : (
                <Link
                  href={"#"}
                  onClick={() => setClick(2)}
                  className={`${styles.divLines} ml-[24%] text-nowrap hover:after:scale-x-100 cursor-pointer after:bg-blue-200 after:content-[''] after:w-[55px] after:h-[4px] after:absolute after:left-[67%] after:top-[4.8%] ${click == 2 ? "after:scale-x-100" : "after:scale-x-0"}`}
                >
                  Skill
                </Link>
              )}
            </div>
            <Separator className="my-3" />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="h-[50%] "
              >
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="h-[100%] flex items-start"
                >
                  <div
                    className={`${click == 0 ? "" : "hidden"} h-full flex flex-row space-y-0 w-[100%] flex-wrap items-start  justify-between `}
                  >
                    <FormField
                      name="firstName"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="w-[40%">
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
                        <FormItem className="w-[40%] ">
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
                    
                    {/* <FormField
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
                    /> */}
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
                    {paymentState === "creditDebit" ? (
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
                        className={`${isEdit ? "" : "hidden"}  w-[30%] text-white bg-maingreen hover:bg-maingreen-light`}
                        type="submit"
                        onSubmit={form.handleSubmit(handleSubmit)}
                      >
                        Update Info
                      </Button>
                      <Button
                        variant={`${isEdit ? "destructive" : "default"}`}
                        type="reset"
                        onClick={() => setIsEdit(!isEdit)}
                        className={`w-[30%]`}
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
                                hidePlaceholderWhenSelected
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
                    {/* <FormItem className="">
                      <FormLabel>Review</FormLabel>
                      <ReviewProfessional id={userData?._id ?? ""}/>
                    </FormItem> */}
                  </div>
                  <div
                    className={`absolute bottom-0 w-[90%] pb-10 flex flex-row ${isEdit ? "justify-between" : "justify-end"}`}
                  >
                    <Button
                      className={`${isEdit ? "" : "hidden"}  w-[30%] text-white bg-maingreen hover:bg-maingreen-light`}
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
        <Card className='w-[535px] h-[800px] relative'>
          <CardHeader>
              <CardTitle>Your Review</CardTitle>
          </CardHeader>
          <CardContent className='h-full'>
            <Separator className="mt-1"/>
            <div className='mt-5 h-[80%]'>
              <ReviewProfessional id={userData?._id ?? ""} />
            </div>

          </CardContent>
        </Card>
      </div>
    </main>
  );
}
