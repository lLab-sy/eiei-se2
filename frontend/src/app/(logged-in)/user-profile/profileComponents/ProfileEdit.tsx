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
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import styles from "../animation.module.css";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { z } from "zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import ProfessionalBillingInfo from "./ProfessionalBillingInfo";
import ProfessionalTransaction from "./ProfessionalTransaction";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
const CardSchema = z.object({
  nameOnCard: z.string().min(1, "Name on card is required"),
  cardNumber: z
    .string()
    .refine((val) => /^\d{16}$/.test(val.replace(/\s/g, "")), {
      message: "Card number must be 16 digits",
    }),
  exp_cvv: z.object({
    month: z
      .string()
      .length(2, "Month must be 2 digits")
      .regex(/^(0[1-9]|1[0-2])$/, "Invalid month"),
    year: z
      .string()
      .length(2, "Year must be 2 digits")
      .regex(/^\d{2}$/, "Invalid year"),
    cvv: z.string().length(3, "CVV must be 3 digits"),
  }),
});
export interface CardInterface {
  id: string;
  brand: "Visa" | "MasterCard";
  name: string;
  expiration_month: string;
  expiration_year: string;
  last_digits: string;
}
export interface BookBankInterface {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
}
export interface Transaction{
  date: string;
  project: string;
  amount: number;
  transferred: boolean;
};
function formatCardNumber(value: string) {
  // Remove non-digits
  const digitsOnly = value.replace(/\D/g, "");

  // Group into 4-digit blocks
  const formatted = digitsOnly.match(/.{1,4}/g)?.join(" ") ?? "";

  return formatted;
}

interface TransactionInterface {
  amount: number;
  currency: string;
  userId: string;
  createdAt: string;
  postId: {
    postName: string;
  };
}

const FourthPageEdit = ({
  click,
  role,
  projectName,
  setProjectName,
  professionalName,
  setProfessionalName,
  roleSearch,
  setRoleSearch,
  token,
}: {
  click: number;
  role: string;
  projectName: string;
  setProjectName: Function;
  professionalName: string;
  setProfessionalName: Function;
  roleSearch: string;
  setRoleSearch: Function;
  token: string;
}) => {
  const [transactions, setTransactions] = useState<TransactionInterface[]>([]);
  useEffect(() => {
    const handleFetchTransactions = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/transactions`,

        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token ?? ""}`,
          },
        },
      );
      console.log("res transactions", res);
      setTransactions(res.data?.data ?? []);
    };
    handleFetchTransactions();
  }, []);
  return (
    <div
      className={`${click == 3 ? "" : "hidden"} w-full flex  flex-col justify-start h-full`}
    >
      <div className="mt-2 h-full w-full flex flex-col justify-between ">
        <div className="h-[10%] text-xl font-bold">Transaction History</div>
        <div className="w-full h-[90%]">
          <Command className="flex flex-col items-center w-full h-[100%]">
            <div className="flex h-[15%] w-[100%] gap-4 pt-2">
              <CommandInput
                className="h-[50px] w-full"
                placeholder="Search Project Name"
              />
              <CommandEmpty>No results found.</CommandEmpty>
            </div>
            <CommandList className="h-full w-full">
              <div className="h-[85%] w-[100%] flex flex-col">
                <div className="w-full bg-mainblue-lightest  text-white h-[50px] rounded-xl flex justify-around items-center">
                  <div className="w-[30%] flex justify-center">
                    <span className="w-full">Date</span>
                  </div>
                  <div className="w-[30%] flex justify-center">
                    <span>Project</span>
                  </div>
                  <div className="w-[30%] flex justify-center">
                    <span>Amount (THB)</span>
                  </div>
                </div>
                <div
                  className="h-[60%] overflow-y-scroll"
                  style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
                >
                  <CommandGroup>
                    {transactions.map((transaction, index) => {
                      const isoDate = transaction.createdAt;
                      const date = new Date(isoDate);
                      const formattedDate = date
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-");
                      return (
                        <CommandItem
                          key={index}
                          className="w-full h-[60px] rounded-xl flex justify-around items-center"
                          value={transaction.postId.postName}
                        >
                          <div className="w-[33%] flex justify-center">
                            <span className="w-full">{formattedDate}</span>
                          </div>
                          <div className="w-[33%] flex justify-center">
                            <span>{transaction.postId.postName}</span>
                          </div>
                          <div className="w-[33%] flex justify-center">
                            <span>{transaction.amount}</span>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </div>
              </div>
            </CommandList>
          </Command>
        </div>
      </div>
    </div>
  );
};
const AddNewCardDialog = ({
  email,
  refreshKey,
  userToken,
  id,
  setRefreshKey,
}: {
  email: string;
  refreshKey: boolean;
  userToken: string;
  id: string;
  setRefreshKey: Function;
}) => {
  const [cvv, setCvv] = useState("");
  const [mm, setMm] = useState("");
  const [yy, setYy] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.omise.co/omise.js";
    script.async = true;
    script.onload = () => {
      (window as any).Omise.setPublicKey(
        process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY,
      ); // Replace with your real public key
    };
    document.body.appendChild(script);
  }, []);

  const handleSubmitCard = () => {
    const Omise = (window as any).Omise;

    // fetch('/api/charge', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ token }),
    // }).then(res => res.json()).then(data => {
    //   console.log('Server response:', data);
    // });

    const rawData = {
      nameOnCard,
      cardNumber,
      exp_cvv: {
        month: mm,
        year: yy,
        cvv,
      },
    };

    // Format the card number
    const newCardNumber = cardNumber.replace(/\s/g, ""); // Remove spaces

    const data = CardSchema.safeParse({
      ...rawData,
      cardNumber: newCardNumber,
    });
    if (!data.success) {
      alert(
        "The information you entered doesn't look right. Please double-check your card details.",
      );
      console.log(data.error);
    } else {
      const handleCreateUsersCard = async (email: string) => {
        Omise.createToken(
          "card",
          {
            name: nameOnCard,
            number: newCardNumber,
            expiration_month: mm,
            expiration_year: yy,
            security_code: cvv,
          },
          async (statusCode: number, response: any) => {
            if (response.object === "error") {
              alert("Error: " + response.message);
              return;
            }
            const token = response.id;
            console.log("Got token:", token);
            // const res = await axios.post("https://api.omise.co/customers", {
            //   card: token,
            //   email: email,
            // });
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/payment/add-card`,
              {
                userId: id,
                cardToken: token,
              },
              {
                withCredentials: true,
                headers: {
                  Authorization: `Bearer ${userToken ?? ""}`,
                },
              },
            );

            console.log("create user res", res);
            if (res.data.status === "success") {
              toast({
                variant: "default",
                title: "Success",
                description: res.data.message,
              });
              setRefreshKey(!refreshKey);
              setOpenCard(false);
            } else {
              toast({
                variant: "destructive",
                title: "Failed",
                description: res.data.message,
              });
            }
          },
        );
        // alert("success");
      };
      handleCreateUsersCard(email);
    }
    return;
  };

  const [openCard, setOpenCard] = useState(false);
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };
  return (
    <Dialog open={openCard} onOpenChange={setOpenCard}>
      <DialogTrigger asChild>
        <button
          onClick={async () => {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/payment/create-customer`,
              {
                email,
              },
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
              },
            );

            const status = response.data.status;
            const message = response.data.message;
            if (status === "success") {
              setOpenCard(true);
            } else {
              toast({
                variant: "destructive",
                title: "Failed",
                description: message,
              });
            }
          }}
          className="bg-mainblue-lightest text-white rounded-lg mt-5 w-full h-full"
        >
          Add new card
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a payment card</DialogTitle>
        </DialogHeader>
        <div className="h-[350px] flex flex-col gap-9">
          <span>Please enter your payment card information</span>

          <div>
            <FormLabel>Name on card</FormLabel>
            <Input
              type="text"
              value={nameOnCard}
              onChange={(e) => setNameOnCard(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <FormLabel>Card Number</FormLabel>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
            />
          </div>

          <div className="flex justify-between items-end">
            <div className="w-[32%] flex flex-col">
              <FormLabel>Expiration Day</FormLabel>
              <Input
                type="text"
                maxLength={2}
                placeholder="MM"
                value={mm}
                onChange={(e) => setMm(e.target.value)}
              />
            </div>
            <div className="w-[32%] flex flex-col">
              <Input
                type="text"
                maxLength={2}
                placeholder="YY"
                value={yy}
                onChange={(e) => setYy(e.target.value)}
              />
            </div>
            <div className="w-[32%] flex flex-col">
              <FormLabel>CVV</FormLabel>
              <Input
                type="text"
                maxLength={3}
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="justify-between flex">
          <Button
            className=""
            onClick={() => {
              setOpenCard(false);
            }}
            variant="destructive"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-maingreen-light"
            onClick={() => handleSubmitCard()}
          >
            Confirm
          </Button>{" "}
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
  userData,
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
  userData: any;
}) {
  const [cards, setCards] = useState<CardInterface[]>([]);
  const { data: session } = useSession();
  const [refreshKey, setRefreshKey] = useState(false);

  // For Production Professional
  const [bookbank, setBookBank] = useState<BookBankInterface | null>(null);
  const handleSubmitBookBank = (bankInfo: BookBankInterface) => {
    setBookBank(bankInfo);
    console.log("Form submitted:", bankInfo);
  };

  const transactionsData: Transaction[] = [
      { date: "20-03-2025", project: "Project 4", amount: 100, transferred: false },
      { date: "20-03-2025", project: "Project 3", amount: 50, transferred: true },
      { date: "20-03-2025", project: "Project 2", amount: 30, transferred: true },
      { date: "01-02-2025", project: "Project 1", amount: 20, transferred: true },
      { date: "20-03-2025", project: "Project 4", amount: 100, transferred: false },
      { date: "20-03-2025", project: "Project 3", amount: 50, transferred: true },
      { date: "20-03-2025", project: "Project 2", amount: 30, transferred: true },
      { date: "01-02-2025", project: "Project 1", amount: 20, transferred: true },
      { date: "20-03-2025", project: "Project 4", amount: 100, transferred: false },
      { date: "20-03-2025", project: "Project 3", amount: 50, transferred: true },
      { date: "20-03-2025", project: "Project 2", amount: 30, transferred: true },
      { date: "01-02-2025", project: "Project 1", amount: 20, transferred: true },
      { date: "20-03-2025", project: "Project 4", amount: 100, transferred: false },
      { date: "20-03-2025", project: "Project 3", amount: 50, transferred: true },
      { date: "20-03-2025", project: "Project 2", amount: 30, transferred: true },
      { date: "01-02-2025", project: "Project 1", amount: 20, transferred: true },
      { date: "20-03-2025", project: "Project 4", amount: 100, transferred: false },
      { date: "20-03-2025", project: "Project 3", amount: 50, transferred: true },
      { date: "20-03-2025", project: "Project 2", amount: 30, transferred: true },
      { date: "01-02-2025", project: "Project 1", amount: 20, transferred: true },
  ];
  const [transactions, setTransactions] = useState(transactionsData);
  const handleRequestTransfer = (transaction: Transaction) => {
    const updated = transactions.map(tx =>
      tx === transaction ? { ...tx, transferred: true } : tx
    );
    setTransactions(updated);
  };


  useEffect(() => {
    const handleFetchCards = async () => {
      //payment/cards
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cards`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${session?.user.token ?? ""}`,
          },
        },
      );
      console.log("res cards", res);
      setCards(Array.isArray(res.data.data) ? res.data.data : []);
    };
    handleFetchCards();
  }, [refreshKey]);
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
      <CardHeader className="h-[17%] lg:h-[10%] flex items-start justify-end">
        <CardTitle className="">Edit Profile ({role})</CardTitle>
      </CardHeader>
    );
  };
  const CardHeaderInCardDynamic = useMemo(
    () =>
      dynamic(() => Promise.resolve(CardHeaderInCard), {
        ssr: false,
      }),
    [],
  );
  const FirstPageEdit = () => {
    return (
      <div
        className={`${click == 0 ? "" : "hidden"} h-[50%] flex flex-row space-y-0 w-[100%] flex-wrap items-start  justify-between `}
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
    const cardMapper = {
      Visa: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          version="1.1"
          id="Layer_1"
          x="0px"
          y="0px"
          viewBox="0 0 512 512"
          enableBackground="new 0 0 512 512"
          xmlSpace="preserve"
          width="80px"
          height="50px"
        >
          <g>
            <g>
              <path
                d="M482.722,103.198c13.854,0,25.126,11.271,25.126,25.126v257.9c0,13.854-11.271,25.126-25.126,25.126H30.99
          c-13.854,0-25.126-11.271-25.126-25.126v-257.9c0-13.854,11.271-25.126,25.126-25.126H482.722 M482.722,98.198H30.99
          c-16.638,0-30.126,13.488-30.126,30.126v257.9c0,16.639,13.488,30.126,30.126,30.126h451.732
          c16.639,0,30.126-13.487,30.126-30.126v-257.9C512.848,111.686,499.36,98.198,482.722,98.198L482.722,98.198z"
                fill="#005098"
              />
            </g>
            <g>
              <polygon
                fill="#005098"
                points="190.88,321.104 212.529,194.022 247.182,194.022 225.494,321.104 190.88,321.104"
              />
              <path
                d="M351.141,197.152c-6.86-2.577-17.617-5.339-31.049-5.339c-34.226,0-58.336,17.234-58.549,41.94
          c-0.193,18.256,17.21,28.451,30.351,34.527c13.489,6.231,18.023,10.204,17.966,15.767c-0.097,8.518-10.775,12.403-20.737,12.403
          c-13.857,0-21.222-1.918-32.599-6.667l-4.458-2.016l-4.864,28.452c8.082,3.546,23.043,6.618,38.587,6.772
          c36.417,0,60.042-17.035,60.313-43.423c0.136-14.447-9.089-25.446-29.071-34.522c-12.113-5.882-19.535-9.802-19.458-15.757
          c0-5.281,6.279-10.93,19.846-10.93c11.318-0.179,19.536,2.292,25.912,4.869l3.121,1.468L351.141,197.152L351.141,197.152z"
                fill="#005098"
              />
              <path
                d="M439.964,194.144h-26.766c-8.295,0-14.496,2.262-18.14,10.538l-51.438,116.47h36.378
          c0,0,5.931-15.66,7.287-19.1c3.974,0,39.305,0.059,44.363,0.059c1.027,4.447,4.206,19.041,4.206,19.041h32.152L439.964,194.144
          L439.964,194.144z M397.248,276.062c2.868-7.326,13.8-35.53,13.8-35.53c-0.194,0.339,2.849-7.36,4.593-12.132l2.346,10.959
          c0,0,6.628,30.336,8.022,36.703H397.248L397.248,276.062z"
                fill="#005098"
              />
              <path
                d="M161.828,194.114l-33.917,86.667l-3.624-17.607c-6.299-20.312-25.971-42.309-47.968-53.317l31.009,111.149
          l36.649-0.048l54.538-126.844H161.828L161.828,194.114z"
                fill="#005098"
              />
              <path
                d="M96.456,194.037H40.581l-0.426,2.641c43.452,10.523,72.213,35.946,84.133,66.496l-12.133-58.41
          C110.062,196.716,103.976,194.318,96.456,194.037L96.456,194.037z"
                fill="#F6A500"
              />
            </g>
          </g>
        </svg>
      ),
      MasterCard: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          id="Layer_1"
          viewBox="0 0 128 128"
          width="80px"
          height="50px"
          xmlSpace="preserve"
        >
          <g>
            <g>
              <path
                d="M112,16H16C7.164,16,0,23.164,0,32v64c0,8.836,7.164,16,16,16h96c8.836,0,16-7.164,16-16V32
          C128,23.164,120.836,16,112,16z M120,96c0,4.414-3.59,8-8,8H16c-4.412,0-8-3.586-8-8V32c0-4.414,3.588-8,8-8h96
          c4.41,0,8,3.586,8,8V96z"
                fill="#B0BEC5"
              />
            </g>
          </g>
          <path
            d="M104,64c0,13.254-10.746,24-24,24S56,77.254,56,64s10.746-24,24-24S104,50.746,104,64z"
            fill="#FFA000"
          />
          <path
            d="M72,64c0,13.254-10.746,24-24,24S24,77.254,24,64s10.746-24,24-24S72,50.746,72,64z"
            fill="#D32F2F"
          />
        </svg>
      ),
    };
    if (role === "producer") {
      return (
        <div
          className={`${click == 1 ? "" : "hidden"} w-[100%] flex flex-col justify-start h-[50%]`}
        >
          {!userData.email ? (
            <div className="mt-2 h-[90%] flex flex-col justify-between">
              <div className="h-[50%] text-xl font-bold ">
                Your payment card
              </div>
              <div className="h-[50%] w-[68%] self-center flex flex-col">
                <span>
                  {`
                You haven't added an email yet. Add a card now for
                seamless transactions.`}
                </span>
              </div>
            </div>
          ) : cards.length === 0 ? (
            <div className="mt-2 h-[90%] flex flex-col justify-between">
              <div className="h-[50%] text-xl font-bold ">
                Your payment card
              </div>
              <div className="h-[50%] w-[68%] self-center flex flex-col">
                <span>
                  {`
                  You haven't added a payment card yet. Add a card now for
                  seamless transactions.`}
                </span>
                <div className="">
                  <AddNewCardDialog
                    refreshKey={refreshKey}
                    setRefreshKey={setRefreshKey}
                    id={session?.user.id ?? ""}
                    userToken={session?.user.token ?? ""}
                    email={userData?.email}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-2 h-[100%] flex flex-col justify-between">
              <div className="h-[20%] text-xl font-bold ">
                Your payment card
              </div>
              <div
                className="w-full h-full flex flex-col gap-4 overflow-y-scroll"
                style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
              >
                {cards.length > 0 &&
                  cards.map((card, index) => (
                    <div
                      key={index}
                      className="w-full h-[80px] border rounded-xl flex"
                    >
                      <div className="w-[20%]  flex items-center justify-center">
                        {cardMapper[card?.brand]}
                      </div>

                      <div className="w-[80%] flex flex-col justify-center ml-2">
                        <span>
                          {card?.brand} **** {card.last_digits}
                        </span>
                        <span>{`Expired ${card.expiration_month}/${card.expiration_year}`}</span>
                      </div>

                      <div className="w-[70%]"></div>
                    </div>
                  ))}
              </div>
              <div className="self-end w-[130px] h-[40px]">
                <AddNewCardDialog
                  refreshKey={refreshKey}
                  setRefreshKey={setRefreshKey}
                  id={session?.user.id ?? ""}
                  userToken={session?.user.token ?? ""}
                  email={userData?.email}
                />
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          className={`${click == 1 ? "" : "hidden"} w-[100%] flex flex-col justify-start h-full`}
        >
          {!userData.email ? (
            <div className="mt-2 h-[90%] flex flex-col justify-between">
              <div className="h-[50%] text-xl font-bold ">
                Your payment card
              </div>
              <div className="h-[50%] w-[68%] self-center flex flex-col">
                <span>
                  {`
                You haven't added an email yet. Add a card now for
                seamless transactions.`}
                </span>
              </div>
            </div>
          ) : (
            <ProfessionalBillingInfo
              bankInfo={bookbank || null}
              handleSubmit={handleSubmitBookBank}
            ></ProfessionalBillingInfo>
          )}
        </div>
      );
    }
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
  const [projectName, setProjectName] = useState("");
  const [professionalName, setProfessionalName] = useState("");
  const [roleSearch, setRoleSearch] = useState("");

  const FirstPageEditDynamic = useMemo(
    () =>
      dynamic(() => Promise.resolve(FirstPageEdit), {
        ssr: false,
      }),
    [click === 0, isEdit],
  );
  const SecondPageEditDynamic = useMemo(
    () =>
      dynamic(() => Promise.resolve(SecondPageEdit), {
        ssr: false,
      }),
    [click === 1, isEdit, cards],
  );
  const ThirdPageEditDynamic = useMemo(
    () =>
      dynamic(() => Promise.resolve(ThirdPageEdit), {
        ssr: false,
      }),
    [click === 2, isEdit],
  );
  // const FourthPageEditDynamic = useMemo(
  //   () =>
  //     dynamic(() => Promise.resolve(FourthPageEdit), {
  //       ssr: false,
  //     }),
  //   [click === 3, isEdit, professionalName],
  // );

  return (
    <Card
      className={`${mobilePageState == 1 ? "" : "hidden"} w-[100vw] h-[100vh] lg:h-[700px] relative lg:w-[600px] lg:flex lg:flex-col`}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <CardHeaderInCardDynamic />
      </Suspense>
      <CardContent className="h-[65%] w-full lg:w-[600px] flex flex-col relative lg:h-full">
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
            className={`${styles.divLines} ml-[12%] relative text-nowrap hover:after:scale-x-100 cursor-pointer after:bg-blue-200 after:content-[''] after:w-[147px] after:h-[4px] after:absolute after:left-[-5%] after:top-[145%] ${click == 1 ? "after:scale-x-100" : "after:scale-x-0"}`}
          >
            Billing Information
          </Link>
          <Link
            href={"#"}
            onClick={() => setClick(3)}
            className={`${styles.divLines} relative ml-[12%] text-nowrap hover:after:scale-x-100 cursor-pointer after:bg-blue-200 after:content-[''] after:w-[100px] after:h-[4px] after:absolute after:left-[-5%] after:top-[145%] ${click == 3 ? "after:scale-x-100" : "after:scale-x-0"}`}
          >
            Transactions
          </Link>
          {role === "producer" ? (
            <div className="ml-[24%]"></div>
          ) : (
            <Link
              href={"#"}
              onClick={() => setClick(2)}
              className={`${styles.divLines} relative ml-[12%] text-nowrap hover:after:scale-x-100 cursor-pointer after:bg-blue-200 after:content-[''] after:w-[55px] after:h-[4px] after:absolute after:left-[-30%] after:top-[145%] ${click == 2 ? "after:scale-x-100" : "after:scale-x-0"}`}
            >
              Skill
            </Link>
          )}
        </div>
        <Separator className="my-3" />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="h-full w-full "
          >
            <fieldset
              disabled={form.formState.isSubmitting}
              className="h-[100%] flex items-start w-full"
            >
              <Suspense fallback={<div>Loading...</div>}>
                <FirstPageEditDynamic />
              </Suspense>
              <SecondPageEditDynamic />
              <ThirdPageEditDynamic />
              <FourthPageEdit
                click={click}
                role={role}
                projectName={projectName}
                setProjectName={setProjectName}
                professionalName={professionalName}
                setProfessionalName={setProfessionalName}
                roleSearch={roleSearch}
                setRoleSearch={setRoleSearch}
                token={session?.user.token ?? ""}
              />
              {/* <div
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
              </div> */}
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
