import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { BookBankInterface } from "./ProfileEdit";
import postCustomerTransfer from "@/libs/postCustomerTransfer";
import { useSession } from "next-auth/react";

export default function ProfessionalBillingInfo({
    bankInfo,
    handleSubmit,
  }: {
    bankInfo: BookBankInterface | null;
    handleSubmit: (bankInfo : BookBankInterface) => void;
  }){

    const [isEditing, setIsEditing] = useState(false);
    const [bankName, setBankName] = useState(bankInfo?.bankName || "");
    const [accountHolder, setAccountHolder] = useState(bankInfo?.accountHolder || "");
    const [accountNumber, setAccountNumber] = useState(bankInfo?.accountNumber || "");

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
  
        if (!accountNumber.trim() || !/^\d{10}$/.test(accountNumber)) {
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

         handleSubmit({
            bankName: bankName,
            accountHolder: accountHolder,
            accountNumber: accountNumber,
        });
        setIsEditing(!isEditing);

        const response = await postCustomerTransfer({
            fullName: accountHolder,
            bankAccount: {
                name: bankName,
                number: accountNumber,
                brand: bankName,
            }
            }, token || "");
        console.log("Response from postCustomerTransfer:", response);
    };

    const bankOptions = [
        //{ value: "bank1", label: "Krungsri" },
        { value: "kbank", label: "Kasikorn" },
        { value: "scb", label: "Siam Commercial" },
        { value: "bbl", label: "Bangkok Bank" },
        // { value: "bank5", label: "TMBThanachart" },
        // { value: "bank6", label: "Krung Thai" },
        // { value: "bank7", label: "Government Savings Bank (Aomsin)" },
        // { value: "bank8", label: "UOB" },
        // { value: "bank9", label: "CIMB Thai" },
        // { value: "bank10", label: "Kiatnakin Phatra" },
        // { value: "bank11", label: "TISCO" },
        // { value: "bank12", label: "Thanachart Bank" },
        // { value: "bank13", label: "Bank of Ayudhya" },
    ];

    return (
        <div>
            <h1 className="text-l font-bold mb-4 mt-2">Your book bank</h1>

            <label className="block text-sm font-medium mb-1">Bank Name</label>
            <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full mb-4 px-3 py-2 border rounded-md"
                disabled={!isEditing}
            >
                {!bankName ? <option value="">Choose Bank</option> : <option value={bankName}>{bankOptions.find(option => option.value === bankName)?.label}</option>}
                {bankOptions.map((option) => (
                    (option.value !== bankName) ?
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option> : null
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
                placeholder={isEditing ? "1234567890" : accountNumber}
                className="w-full mb-2 px-3 py-2 border rounded-md"
                disabled={!isEditing}
            />
            {!/^\d{10}$/.test(accountNumber) && accountNumber.length != 0 && isEditing && (
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