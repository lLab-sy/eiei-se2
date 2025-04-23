import ProductionWorkingCard from "./ProducerWorkingCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useEffect, useState } from "react";
import { OfferData, Participant, PostData, PostRolesResponse, Professional } from "../../interface";
import getUser from "@/libs/getUser";
import getPostById from "@/libs/getPostById";
import { useSession } from "next-auth/react";

interface IOfferData {
    data: OfferData;
    status: string;
  }

export default function ProducerWorkingContent({
    postID,
    postName,
    participants,
    mapRole,
}: {
    postID: string;
    postName:string;
    participants: Participant[];
    mapRole: PostRolesResponse[];
}) {
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedProfessional, setSelectedProfessional] = useState("");
    const [roleMap, setRoleMap] = useState<Map<string, OfferData[]>>(new Map());
    const [nameMap, setNameMap] = useState<Map<string, OfferData[]>>(new Map());
    const [mapRoles, setMapRoles] = useState<Map<string, string>>(new Map());
    const [professionalMap, setProfessionalMap] = useState<Map<string, Professional>>(new Map());
    const [offers, setOffers] = useState<IOfferData[]>([]);

    const { data: session } = useSession();
    const token = session?.user?.token;

    // Fetch professional data
    const fetchProfessionalData = async (id: string) => {
        try {
            const responseData = await getUser(id);
            setProfessionalMap((prevMap) => {
                const newMap = new Map(prevMap);
                newMap.set(id, responseData);
                return newMap;
            });
        } catch (error) {
            console.log("Professional Not Found");
        }
    };

    // Map roles once when `mapRole` changes
    useEffect(() => {
        const roleMapping = new Map();
        mapRole.forEach((role) => {
            roleMapping.set(role.id, role.roleName);
        });
        setMapRoles(roleMapping);
    }, [mapRole]);

    // Fetch offers once when `postState` changes
    useEffect(() => {
        const newRoleMap = new Map<string, OfferData[]>();

        participants.forEach((p:Participant) => {
            fetchProfessionalData(p.participantID??"");
            p.offer.forEach((o:OfferData) => {
                const offerRole=o.role??"" //Must Contain o.role but I still can't find better sol
                const existingOffers = newRoleMap.get(offerRole) || [];
                existingOffers.push(o);
                newRoleMap.set(offerRole, existingOffers);
            });
        });

        setRoleMap(newRoleMap);
        if(selectedRole && selectedProfessional){
            console.log("recompute");
            handleSelectRole(selectedRole);
            handleSelectProfessional(selectedProfessional);
        }
    }, [participants]);

    // Handle role selection
    function handleSelectRole(roleID: string): void {
        setSelectedRole(roleID);
        setSelectedProfessional("");

        const newNameMap = new Map<string, OfferData[]>();
        
        participants.forEach((p) => {
            const pid=p.participantID??""
            if(pid){
                p.offer.forEach((o:OfferData) => {
                    if (o.role === roleID) {
                        const existingOffers = newNameMap.get(pid) || [];
                        existingOffers.push(o);
                        newNameMap.set(pid, existingOffers);
                    }
                });
            }
        });

        setNameMap(newNameMap); // Update nameMap state
    }

    function handleSelectProfessional(profID: string) {
        setSelectedProfessional(profID);

        let professionalOffers: IOfferData[] = [];
        let filtterRoleOffers: IOfferData[] = [];
        participants.forEach((p) => {
            if(p.participantID === profID){ // same person
                for(let i = 0; i < p.offer.length; ++i){
                    const o : OfferData = p.offer[i];
                    professionalOffers.push({ data: o, status: p.status });
                }
            }
        });

        professionalOffers.sort((a, b) => {
            return new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime();
        });

        // recompute status
        for(let i = 0; i < professionalOffers.length; ++i){
            const status = professionalOffers[i].status;
            if (professionalOffers[i].data.role === selectedRole) { // same offer
                filtterRoleOffers.push({data: professionalOffers[i].data, status: (i != 0 || status === "reject" ? "Rejected" : (status === "candidate" ? "Completed" : "Pending"))})
            }
        }

        setOffers(filtterRoleOffers);
    }

    function handleStatusChange(participantID: string, status: string): void {
        participants.forEach(p =>{
            if(p.participantID == participantID) p.status = status;
        })
        handleSelectProfessional(participantID);
    }

    return participants.length === 0 ? (
        <main className="bg-slate-480 rounded-lg h-full shadow-xl m-auto w-[100%] flex items-center justify-center">
            <h1 className="text-center text-4xl font-bold my-5 p-0">No Offer</h1>
        </main>
    ) : (
        <main className="bg-slate-480 rounded-lg h-full shadow-xl m-auto w-[100%]">
            <h1 className="text-start text-xl font-bold my-5 ml-8 p-0">Offer History</h1>
            <div className="w-[90%] m-auto content-center">
                <h3 className="font-bold my-2">Selected Role</h3>

                {/* Select Role */}
                <Select onValueChange={handleSelectRole} value={selectedRole}>
                    <SelectTrigger className="w-full">
                        <SelectValue
                            placeholder={selectedRole === "" ? "Select role" : mapRoles.get(selectedRole)}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {[...roleMap.entries()].map(([key, offers]) => (
                            <SelectItem key={key} value={key}>
                                {mapRoles.get(key)} ({offers.length})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Select Production Professional */}
                {selectedRole !== "" && (
                    <>
                        <h3 className="font-bold my-2">Select a production professional</h3>
                        <Select onValueChange={handleSelectProfessional} value={selectedProfessional}>
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={
                                        selectedProfessional === "" ? "Select production professional" : selectedProfessional
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {[...nameMap.entries()].map(([key, offers]) => (
                                    <SelectItem key={key} value={key}>
                                        {professionalMap.get(key)?.username} ({offers.length})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </>
                )}

                {/* Show Offers */}
                {selectedProfessional !== "" && (
                    <div className="space-y-3 my-5 overflow-y-auto h-full max-h-[400px] m-auto">
                        {offers.map((offer, index) => (
                    <ProductionWorkingCard
                    key = {index}
                    postID={postID}
                    participantID={selectedProfessional}
                    offer={{
                        id: index.toString(),
                        status: offer.status,
                        date: offer.data.createdAt,
                        amount: offer.data.price.toString(),
                        role: mapRoles.get(offer.data.role??"") || "",
                        startDate: offer.data.createdAt,
                        postName: postName,
                        description: offer.data.reason,
                        productionName: professionalMap.get(selectedProfessional)?.username || "",
                        productionID: professionalMap.get(selectedProfessional)?._id || "",
                        reviews: professionalMap.get(selectedProfessional)?.avgRating || 0,
                        professionalImg: professionalMap.get(selectedProfessional)?.url || "/image/logo-preview.png",
                        offeredBy: Number(offer.data.offeredBy)
                    }}
                    onStatusChange={handleStatusChange}                 
                            />
                    ))}
                    </div>
                )}
            </div>
        </main>
    );
}