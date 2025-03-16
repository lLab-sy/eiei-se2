import ProfessionalWorkingCard from "./ProfessionalWorkingCard";

export default function ProfessionalWorkingContent(){
    return(
        <main className="bg-slate-480 rounded-lg h-full shadow-xl m-auto w-[100%]">
            <div className="grid grid-cols-1 h-full w-f">
                <h1 className="text-start text-xl font-bold my-5 ml-10 p-0">Production Professional</h1>
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
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                        <ProfessionalWorkingCard/>
                    </div>
                    
                </div>
            </div>
        </main>
    )
}