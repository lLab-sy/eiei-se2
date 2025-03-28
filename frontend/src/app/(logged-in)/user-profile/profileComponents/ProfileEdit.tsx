"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import styles from "../animation.module.css";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { Suspense, lazy, useMemo } from "react";
import dynamic from "next/dynamic";

export default function ProfileEdit({
  mobilePageState,
  setClick,
  setMobilePageState,
  role,
  form,
  handleSubmit,
  click,
  isEdit,
  setIsEdit,
  paymentState,
  setPaymentState,
}: {
  mobilePageState: number;
  setMobilePageState: Function;
  role: string;
  setClick: Function;
  form: any;
  handleSubmit: Function;
  click: number;
  isEdit: boolean;
  setIsEdit: Function;
  paymentState: string;
  setPaymentState: Function;
}) {
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
  const CardHeaderInCard = () => {
    return (
      <CardHeader  className="h-[17%] lg:h-[10%] flex items-start justify-end">
        <CardTitle className="">Edit Profile ({role})</CardTitle>
      </CardHeader>
    );
  };
  const CardHeaderInCardDynamic = useMemo(() => dynamic(() => Promise.resolve(CardHeaderInCard), {
    ssr: false
  }), [])
  const FirstPageEdit = () => {
    return (
      <div
        className={`${click == 0 ? "" : "hidden"} h-full flex flex-row space-y-0 w-[100%] flex-wrap items-start  justify-between `}
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger disabled={!isEdit} className="">
                    <SelectValue placeholder="Select Your Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage className="md:text-xs text-sm" />
            </FormItem>
          )}
        />

        {role === "production professional" && (
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full h-[50%] lg:h-[70%]">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    disabled={!isEdit}
                    className="w-full h-full border resize-none overflow-y-auto p-2 text-sm"
                    placeholder="Your Description"
                  />
                </FormControl>
                <FormMessage className="text-sm md:text-xs" />
              </FormItem>
            )}
          />
        )}

        <div
          className={`absolute bottom-0 w-[90%] pb-10 flex flex-row ${isEdit ? "justify-between" : "justify-end"}`}
        >
          <Button
            className={`${isEdit ? "" : "hidden"}  w-[40%] lg:w-[30%] text-white bg-green-400 hover:bg-green-500`}
            type="submit"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            Update Info
          </Button>
          <Button
            variant={`${isEdit ? "destructive" : "default"}`}
            type="reset"
            onClick={() => setIsEdit(!isEdit)}
            className={`${isEdit ? "w-[40%] lg:w-[30%]" : "w-full"} lg:w-[30%]`}
          >
            {isEdit ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>
    );
  };
  const SecondPageEdit = () => {
    return (
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
        {role === "producer" ? (
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
                  >
                    <SelectTrigger disabled={!isEdit}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="qrCode">QR Code</SelectItem>
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

        {paymentState === "creditDebit" ? (
          <div className="  flex flex-col justify-around py-4 h-[200px]">
            <FormField
              name="card_name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on card</FormLabel>
                  <Input disabled={!isEdit} {...field} type="text" />
                </FormItem>
              )}
            />
            <FormField
              name="card_number"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <Input disabled={!isEdit} {...field} type="text" />
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
            className={`${isEdit ? "" : "hidden"}  w-[40%] lg:w-[30%] text-white bg-maingreen hover:bg-maingreen-light`}
            type="submit"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            Update Info
          </Button>
          <Button
            variant={`${isEdit ? "destructive" : "default"}`}
            type="reset"
            onClick={() => setIsEdit(!isEdit)}
            className={`${isEdit ? "w-[40%] lg:w-[30%]" : "w-full"} lg:w-[30%]`}
          >
            {isEdit ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>
    );
  };
  const ThirdPageEdit = () => {
    return (
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
                      const valueOnly = selected.map((item) => item.value);
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
      </div>
    );
  };
  const FirstPageEditDynamic = useMemo(() => dynamic(() => Promise.resolve(FirstPageEdit), {
    ssr: false,
  }), [click === 0, isEdit]);
  const SecondPageEditDynamic = useMemo(() => dynamic(() => Promise.resolve(SecondPageEdit), {
    ssr: false,
  }), [click===1, isEdit]);
  const ThirdPageEditDynamic = useMemo(() => dynamic(() => Promise.resolve(ThirdPageEdit), {
    ssr: false
  }), [click===2, isEdit])

  return (
    <Card
      className={`${mobilePageState == 1 ? "" : "hidden"} w-[100vw] h-[100vh] lg:h-[700px] relative lg:w-[500px] lg:flex lg:flex-col`}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <CardHeaderInCardDynamic />
      </Suspense>
      <CardContent className="h-[65%] w-full lg:w-[500px] flex flex-col relative lg:h-full">
        <div className="flex flex-row w-[60%] justify-between">
          <Link
            href={"#"}
            onClick={() => setClick(0)}
            className={` ${styles.divLine} relative  text-nowrap  hover:after:scale-x-100 after:bg-blue-200 after:content-[''] after:w-[70px] after:h-[4px] after:absolute  after:left-[0%] after:top-[145%] ${click == 0 ? "after:scale-x-100" : "after:scale-x-0"}`}
          >
            User Info
          </Link>
          <Link
            href={"#"}
            onClick={() => setClick(1)}
            className={`${styles.divLines} ml-[24%] relative text-nowrap hover:after:scale-x-100 cursor-pointer after:bg-blue-200 after:content-[''] after:w-[147px] after:h-[4px] after:absolute after:left-[-5%] after:top-[145%] ${click == 1 ? "after:scale-x-100" : "after:scale-x-0"}`}
          >
            Billing Information
          </Link>
          {role === "producer" ? (
            <div className="ml-[24%]"></div>
          ) : (
            <Link
              href={"#"}
              onClick={() => setClick(2)}
              className={`${styles.divLines} relative ml-[24%] text-nowrap hover:after:scale-x-100 cursor-pointer after:bg-blue-200 after:content-[''] after:w-[55px] after:h-[4px] after:absolute after:left-[-30%] after:top-[145%] ${click == 2 ? "after:scale-x-100" : "after:scale-x-0"}`}
            >
              Skill
            </Link>
          )}
        </div>
        <Separator className="my-3" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="h-[50%] ">
            <fieldset
              disabled={form.formState.isSubmitting}
              className="h-[100%] flex items-start"
            >
              <Suspense fallback={<div>Loading...</div>}>
                <FirstPageEditDynamic />
              </Suspense>
              <SecondPageEditDynamic />
              <ThirdPageEditDynamic />
              <div
                className={`absolute bottom-0 w-[90%] pb-10 flex flex-row ${isEdit ? "justify-between" : "justify-end"}`}
              >
                <Button
                  className={`${isEdit ? "" : "hidden"}  w-[40%] lg:w-[30%] text-white bg-maingreen hover:bg-maingreen-light`}
                  type="submit"
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  Update Info
                </Button>
                <Button
                  variant={`${isEdit ? "destructive" : "default"}`}
                  type="reset"
                  onClick={() => setIsEdit(!isEdit)}
                  className={`${isEdit ? "w-[40%] lg:w-[30%]" : "w-full"} lg:w-[30%]`}
                >
                  {isEdit ? "Cancel" : "Edit"}
                </Button>
              </div>
            </fieldset>
          </form>
        </Form>
      </CardContent>
      <div className="flex items-start order-6  bottom-0 w-[90%] left-[50%] translate-x-[-50%] h-[20vh] absolute lg:hidden">
        <div className="bg-white flex justify-between items-center w-full rounded-xl h-[20%]">
          <div
            onClick={() => setMobilePageState(0)}
            className={`${mobilePageState == 0 ? "bg-slate-300" : ""} cursor-pointer ${role === "production professional" ? "w-[33%]" : "w-[50%]"} h-full flex justify-center items-center rounded-lg`}
          >
            Profile Image
          </div>
          <div
            onClick={() => setMobilePageState(1)}
            className={`${mobilePageState == 1 ? "bg-slate-300" : ""} cursor-pointer ${role === "production professional" ? "w-[33%]" : "w-[50%]"} h-full flex justify-center items-center rounded-lg`}
          >
            Edit Profile
          </div>
          {role === "production professional" ? (
            <div
              onClick={() => setMobilePageState(2)}
              className={`${mobilePageState == 2 ? "bg-slate-300" : ""} cursor-pointer w-[33%] h-full flex justify-center items-center rounded-lg`}
            >
              Review
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </Card>
  );
}
