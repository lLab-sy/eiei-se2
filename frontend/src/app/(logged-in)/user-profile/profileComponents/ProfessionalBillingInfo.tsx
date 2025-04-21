import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import postCustomerTransfer from "@/libs/postCustomerTransfer";
import { useSession } from "next-auth/react";
import { BankAccountResponse } from "./ProfileEdit";
import { set } from "react-hook-form";

export default function ProfessionalBillingInfo({
    bankInfo,
    handleSubmit,
  }: {
    bankInfo: BankAccountResponse | null;
    handleSubmit: (value: string, name: string, number: string) => void;
  }){

    const [isEditing, setIsEditing] = useState(false);
    const [bankName, setBankName] = useState(bankInfo?.brand || "");
    const [accountHolder, setAccountHolder] = useState(bankInfo?.name || "");
    const [accountNumber, setAccountNumber] = useState(bankInfo?.number || "");
    const [lastDigits, setLastDigits] = useState(bankInfo?.bankLastDigits || "");

    useEffect(() => {
        if (bankInfo) {
            setBankName(bankOptions.find((option) => option.label === bankInfo.brand)?.brand || "");
            setAccountHolder(bankInfo.name || "");
            setAccountNumber(bankInfo.number || "");
            setLastDigits(bankInfo.bankLastDigits || "");
        }
    }
    , [bankInfo]);

    const { data: session } = useSession();
    const token = session?.user.token;

    const checkValid = () => {
        if (!bankName) {
           // alert("Please select a bank.");
            return false;
        }
  
        if (!accountHolder.trim()) {
           // alert("Please enter the account holder's name.");
            return false;
        }
  
        if (accountNumber && !accountNumber.trim() || !/^\d{10}$/.test(accountNumber)) {
           // alert("Please enter a valid 10-digit account number.");
            return false;
        }
  
        return true;
    }

    const handleEdit = async () => {  
        // Handle form submission logic here
        toast({
            variant: "default",
            title: "Success",
            description: "Your bank details have been updated.",
        });

        handleSubmit(bankName, accountHolder, accountNumber);
        setIsEditing(!isEditing);

        const response = await postCustomerTransfer({
            fullName: accountHolder,
            bankAccount: {
                name: accountHolder,
                number: accountNumber,
                brand: bankName,
            }
            }, token || "");
        console.log("Response from postCustomerTransfer:", response);
    };

    const bankOptions = [
        { brand: "kbank", label: "Kasikorn Bank" }, // Matches Omise's "kbank"
        { brand: "scb", label: "Siam Commercial Bank" }, // Matches Omise's "scb"
        { brand: "bbl", label: "Bangkok Bank" }, // Matches Omise's "bbl"
        { brand: "ktb", label: "Krung Thai Bank" }, // Matches Omise's "ktb"
        { brand: "bay", label: "Bank of Ayudhya (Krungsri)" }, // Matches Omise's "bay"
        { brand: "gsb", label: "Government Savings Bank (Aomsin)" }, // Matches Omise's "gsb"
        { brand: "tmb", label: "TMBThanachart Bank" }, // Matches Omise's "tmb"
        { brand: "uob", label: "United Overseas Bank (UOB)" }, // Matches Omise's "uob"
        { brand: "kkp", label: "Kiatnakin Phatra Bank" }, // Matches Omise's "kkp"
        { brand: "tisco", label: "TISCO Bank" }, // Matches Omise's "tisco"
    ];

    function handleSubmitBankName(value: string): void {
        setBankName(bankOptions.find((option) => option.label === value)?.brand || "");
    }

    return (
        <div>
            <h1 className="text-l font-bold mb-4 mt-2">Your book bank</h1>

            <label className="block text-sm font-medium mb-1">Bank Name</label>
            <select
                value={bankName ? bankOptions.find((option) => option.brand === bankName)?.label || "" : ""}
                onChange={(e) => handleSubmitBankName(e.target.value)}
                className="w-full mb-4 px-3 py-2 border rounded-md"
                disabled={!isEditing}
            >
                <option value="" disabled={!bankName}>
                    {bankName ? bankOptions.find((option) => option.brand === bankName)?.label || "Choose Bank" : "Choose Bank"}
                </option>
                {bankOptions.map((option) => (
                    <option key={option.brand} value={option.label}>
                        {option.label}
                    </option>
                ))}
            </select>

            <label className="block text-sm font-medium mb-1">
                Account Holder Name
            </label>
            <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder={isEditing ? "Kurosaki Ichigo" : accountHolder}
                className="w-full mb-4 px-3 py-2 border rounded-md"
                disabled={!isEditing}
            />

            <label className="block text-sm font-medium mb-1">Account Number</label>
            <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder={isEditing ? ("******" + lastDigits) : accountNumber ? accountNumber : "******" + lastDigits}
                className="w-full mb-2 px-3 py-2 border rounded-md"
                disabled={!isEditing}
            />
            {accountNumber && !/^\d{10}$/.test(accountNumber) && accountNumber.length != 0 && isEditing && (
                <p className="text-red-500 text-sm">Please enter a valid 10-digit account number.</p>
            )}

            <div
                className={`absolute bottom-0 w-[90%] pb-10 flex flex-row ${isEditing ? "justify-between" : "justify-end"}`}
            >
                <Button
                    className={`${isEditing ? "" : "hidden"}  w-[40%] lg:w-[30%] text-white bg-green-400 hover:bg-green-500`}
                    type="submit"
                    onClick={handleEdit}
                    disabled={!checkValid()}
                >
                    Confirm
                </Button>
                <Button
                    variant={`${isEditing ? "destructive" : "default"}`}
                    type="reset"
                    onClick={() => setIsEditing(!isEditing)}
                    className={`${isEditing ? "w-[40%] lg:w-[30%]" : "w-full"} lg:w-[30%]`}
                >
                    {isEditing ? "Cancel" : "Edit"}
                </Button>
            </div>
        </div>
    );
  }