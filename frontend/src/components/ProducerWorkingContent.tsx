import ProductionWorkingCard from "./ProducerWorkingCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useEffect, useState } from "react";
import { OfferData, Participant, PostRolesResponse, Professional } from "../../interface";
import getUser from "@/libs/getUser";

interface IOfferData {
    data: OfferData;
    status: string;
  }

export default function ProducerWorkingContent({
    postID,
    participants,
    mapRole,
}: {
    postID: string;
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

    //handle when click confirm or reject
    const handleStatusChange = () => {
        handleSelectProfessional(selectedProfessional);
    };

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

    // Fetch offers once when `participants` changes
    useEffect(() => {
        const newRoleMap = new Map<string, OfferData[]>();

        participants.forEach((p) => {
            fetchProfessionalData(p.participantID);
            p.offer.forEach((o) => {
                const existingOffers = newRoleMap.get(o.role) || [];
                existingOffers.push(o);
                newRoleMap.set(o.role, existingOffers);
            });
        });

        setRoleMap(newRoleMap);
    }, [participants]);

    // Handle role selection
    function handleSelectRole(roleID: string): void {
        setSelectedRole(roleID);
        setSelectedProfessional("");

        const newNameMap = new Map<string, OfferData[]>();

        participants.forEach((p) => {
            p.offer.forEach((o) => {
                if (o.role === roleID) {
                    const existingOffers = newNameMap.get(p.participantID) || [];
                    existingOffers.push(o);
                    newNameMap.set(p.participantID, existingOffers);
                }
            });
        });

        setNameMap(newNameMap); // Update nameMap state
    }

    function handleSelectProfessional(profID: string) {
        setSelectedProfessional(profID);

        let professionalOffers: IOfferData[] = [];
        participants.forEach((p) => {
            if(p.participantID === profID){ // same person
                for(let i = 0; i < p.offer.length; ++i){
                    const o : OfferData = p.offer[i];
                    if (o.role === selectedRole) { // same offer
                        const status = p.status;
                        professionalOffers.push({ data: o, status: (i != p.offer.length - 1 ? "Rejected" : (status === "candidate" ? "Completed" : "Pending")) });
                    }
                }
            }
        });
        

        setOffers(professionalOffers);
    }

    return participants.length === 0 ? (
        <div>No Offer.</div>
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
                    postID={postID}
                    participantID={selectedProfessional}
                    offer={{
                        id: index.toString(),
                        status: offer.status,
                        date: offer.data.createdAt,
                        amount: offer.data.price.toString(),
                        role: mapRoles.get(offer.data.role) || "",
                        startDate: offer.data.createdAt,
                        postName: index.toString(),
                        description: offer.data.reason,
                        productionName: professionalMap.get(selectedProfessional)?.username || "",
                        reviews: professionalMap.get(selectedProfessional)?.avgRating || 0,
                        professionalImg: professionalMap.get(selectedProfessional)?.imageUrl || "/image/logo-preview.png"
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