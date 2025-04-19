"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import axios from "axios";
import { setProfileImageURL, setUser } from "@/redux/user/user.slice";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ProfileEdit from "./ProfileEdit";
import UserInfo from "./UserInfo";
import ReviewProfile from "./ReviewProfile";

const formSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().max(100, "").optional(),
  phone: z
    .string()
    .length(10, "Phone Number must contain exactly to 10 characters")
    .optional(),
  gender: z.enum(["Male", "Female", "Non-Binary", "Other"]).optional(),
  bankName: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
  payment_type: z.enum(["creditDebit", "qrCode"], {
    required_error: "Select Your Payment Type",
  }),
//   card_name: z.string().optional(),
//   card_number: z.string().optional(),
  description: z.string().optional(),
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

type formType = z.infer<typeof formSchema>;
export default function ProfileComponent() {
  // Redux State
  const user: any = useSelector<RootState>((state) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const userData: any = user.user;
  const role = userData?.role
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userData?.email ?? "",
      phone: userData?.phoneNumber ?? "",
      bankName: userData?.bankAccount?.bankName ?? "",
      accountHolderName: userData?.bankAccount?.accountHolderName ?? "",
      accountNumber: userData?.bankAccount?.accountNumber ?? "",
    //   card_name: userData?.nameOnCard ?? "",
    //   card_number: userData?.cardNumber ?? "",
      firstName: userData?.firstName ?? "",
      middleName: userData?.middleName ?? "",
      lastName: userData?.lastName ?? "",
      payment_type: userData?.paymentType ?? "qrCode",
      occupation: userData?.occupation ?? "",
      skill: userData?.skill ?? [],
      experience: userData?.experience ?? 0,
      gender: userData?.gender,
      description: userData?.description ?? "",
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
        // card_name: userData.nameOnCard ?? "",
        // card_number: userData.cardNumber ?? "",
        firstName: userData.firstName ?? "",
        middleName: userData.middleName ?? "",
        lastName: userData.lastName ?? "",
        payment_type: userData.paymentType ?? "qrCode",
        occupation: userData.occupation ?? "",
        skill: userData.skill ?? [],
        experience: userData.experience ?? 0,
        gender: userData.gender,
        description: userData?.description ?? "",
      });
      setPaymentState(userData?.paymentType ?? "qrCode");
    }
  }, [userData]);

  const [isEdit, setIsEdit] = useState(false);
  const [click, setClick] = useState(0);
  const { toast } = useToast();
  const [paymentState, setPaymentState] = useState(
    userData?.paymentType ?? "qrCode",
  );
  const handleSubmit = async (data: formType) => {
    const formData = new FormData();
    const formDataProductionProfessional = new FormData();
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
      role: role ?? "",
      email: data.email,
    };

    const producerData = {
      ...sendUserData,
      paymentType: data.payment_type,
    //   nameOnCard: data.card_name,
    //   cardNumber: data.card_number,
    };

    const productionData = {
      ...sendUserData,
      occupation: data.occupation,
      skill: data.skill,
      experience: data.experience,
      description: data.description,
    };
    if (profileImageState) {
      formData.append("profileImage", profileImageState);
      formDataProductionProfessional.append("profileImage", profileImageState);
    }
    const formDataProducer = formData;
    formDataProducer.append("userData", JSON.stringify(producerData));
    // const formDataProductionProfessional = formData;

    formDataProductionProfessional.append(
      "userData",
      JSON.stringify(productionData),
    );

    const id = user.user._id;
    const token = user.token;
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/users/update-user/${id}`;

    const returnUser = await axios.put(
      apiUrl,
      role === "producer"
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
    }

    setIsEdit(false);
  };
  const [img, setImageState] = useState({
    image: user.profileImageURL ?? "",
  });
  const [profileImageState, setProfileImageState] = useState<File | null>(null);
  const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
      setImageState({
        image: URL.createObjectURL(e.target.files[0]),
      });
      setIsEdit(true);
    }
  };

  const [mobilePageState, setMobilePageState] = useState(0);
  const router = useRouter();
//   const UserInfo = useMemo(() => dynamic(() => import("./UserInfo"), { ssr: false }), [img, mobilePageState])
//   const ProfileEdit = useMemo(() => dynamic(() => import("./ProfileEdit"), { ssr: false }), [])
//   const ReviewProfile = useMemo(() => dynamic(() => import("./ReviewProfile"), { ssr: false }), [])
 
  return (
    <main className="h-[100vh] lg:min-h-screen flex bg-mainblue-light relative lg:items-center lg:justify-center">
      <ArrowLeft
        onClick={() => router.push("/")}
        className="lg:hidden z-10 absolute top-5 left-5"
        size={50}
      />
      <div className={` flex lg:justify-around lg:w-[80%] lg:h-[800px]`}>
        <UserInfo
          mobilePageState={mobilePageState}
          userData={userData}
          img={img}
          setMobilePageState={setMobilePageState}
          role={role}
          onImageChange={onImageChange}
        />

        <ProfileEdit
          userData={userData}
          mobilePageState={mobilePageState}
          setClick={setClick}
          setMobilePageState={setMobilePageState}
          role={role}
          form={form}
          handleSubmit={handleSubmit}
          click={click}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          paymentState={paymentState}
          setPaymentState={setPaymentState}
        />
        <ReviewProfile
          role={role}
          userData={userData}
          mobilePageState={mobilePageState}
          setMobilePageState={setMobilePageState}
        />
      </div>
    </main>
  );
}