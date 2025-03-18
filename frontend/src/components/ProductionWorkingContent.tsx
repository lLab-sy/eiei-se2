import { Calendar } from "lucide-react";
import ProductionWorkingCard from "./ProductionWorkingCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { Card } from "./ui/card";

const offers = [
    { id: 3, status: "Pending", amount: 20000, date: "March 16, 2025 at 09:20 PM", color: "text-yellow-500" },
    { id: 2, status: "Rejected", amount: 30000, date: "March 15, 2025 at 09:20 PM", color: "text-red-500" },
    { id: 1, status: "Rejected", amount: 50000, date: "March 14, 2025 at 09:20 PM", color: "text-red-500" },
    { id: 4, status: "Pending", amount: 20000, date: "March 16, 2025 at 09:20 PM", color: "text-yellow-500" },
    { id: 5, status: "Rejected", amount: 30000, date: "March 15, 2025 at 09:20 PM", color: "text-red-500" },
    { id: 6, status: "Rejected", amount: 50000, date: "March 14, 2025 at 09:20 PM", color: "text-red-500" },
  ];

export default function ProductionWorkingContent(){
    const [selectedRole, setSelectedRole] = useState("Actor");
    const [selectedProfessional, setSelectedProfessional] = useState("Tendo Souji");

    return (
        <main className="bg-slate-480 rounded-lg h-full shadow-xl m-auto w-[100%]">
            <h1 className="text-start text-xl font-bold my-5 ml-8 p-0">Offer History</h1>
            <div className="w-[90%] m-auto content-center">

            <h3 className="font-bold my-2">SelectedRole</h3>
            <Select onValueChange={setSelectedRole} defaultValue={selectedRole}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Actor">Actor (5)</SelectItem>
                <SelectItem value="Director">Director (2)</SelectItem>
            </SelectContent>
            </Select>

            <h3 className="font-bold my-2">Select a production professional</h3>
            <Select onValueChange={setSelectedProfessional} defaultValue={selectedProfessional}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a production professional" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Tendo Souji">Tendo Souji</SelectItem>
                <SelectItem value="John Doe">John Doe</SelectItem>
            </SelectContent>
            </Select>
            
            <div className="space-y-3 my-5 overflow-y-auto h-full max-h-[400px] m-auto">
                {offers.map((offer) => (
                <Card key={offer.id} className="p-4 border rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Offer {offer.id}</h3>
                    <span className={`font-semibold ${offer.color}`}>{offer.status}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1 space-x-2">
                    <Calendar size={14} />
                    <span>{offer.date}</span>
                    </div>
                    <div className="mt-2 text-right text-lg font-semibold">{offer.amount} THB</div>
                </Card>
                ))}
            </div>
            

                </div>
        </main>
      );
    {/*return(
        <main className="bg-slate-480 rounded-lg h-full shadow-xl m-auto w-[100%]">
            <div className="grid grid-cols-1 h-full w-f">
                <h1 className="text-start text-xl font-bold my-5 ml-10 p-0">Offer History</h1>
                <div className="w-[90%] m-auto content-center">
                    <div className="w-full grid grid-cols-11 h-full bg-mainblue-darkest m-auto text-sm p-5 font-bold text-white text-center whitespace-normal break-words items-center content-center rounded-lg">
                        <div className="col-span-2">
                            <p className="">Name</p>
                        </div>
                        <div className="col-span-2">
                            <p className="">Role</p>
                        </div>
                        <div className="col-span-2">
                            <p className="">Status</p>
                        </div>
                        <div className="col-span-3">
                            <p className="">Confirmation</p>
                        </div>
                        <div className="col-span-2">
                            <p className="">Work Quota</p>
                        </div>
                    </div>
                    <div className="overflow-y-auto h-full max-h-[450px] m-auto bg-slate-400">
                        <ProductionWorkingCard/>
                        <ProductionWorkingCard/>
                        <ProductionWorkingCard/>
                        <ProductionWorkingCard/>
                        <ProductionWorkingCard/>
                        <ProductionWorkingCard/>
                        <ProductionWorkingCard/>
                        <ProductionWorkingCard/>
                        <ProductionWorkingCard/>
                        <ProductionWorkingCard/>
                        <ProductionWorkingCard/>
                        <ProductionWorkingCard/>
                    </div>
                    
                </div>
            </div>
        </main>
    )*/}
}