import { Calendar } from "lucide-react";
import ProductionWorkingCard from "./ProductionWorkingCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { Card } from "./ui/card";

const offers = [
    {
        id: 1,
        status: "Pending",
        date: "2023-10-01",
        amount: 1000,
        postName: "Post 1",
        role: "Actor",
        startDate: "2023-10-10",
        description: "Description 1"
    },
    {
        id: 2,
        status: "Completed",
        date: "2023-10-02",
        amount: 2000,
        postName: "Post 2",
        role: "Director",
        startDate: "2023-10-11",
        description: "Description 2"
    },
    {
        id: 3,
        status: "Rejected",
        date: "2023-10-03",
        amount: 1500,
        postName: "Post 3",
        role: "Actor",
        startDate: "2023-10-12",
        description: "Description 3"
    }
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
                <ProductionWorkingCard 
                        id={offer.id.toString()}
                        status={offer.status}
                        date={offer.date}
                        amount={offer.amount.toString()}
                        postName={offer.postName}
                        role={offer.role}
                        startDate={offer.startDate}
                        description={offer.description} 
                        productionName={"test"} 
                        reviews={"15"}                />
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