import { Calendar } from "lucide-react";
import ProductionWorkingCard from "./ProducerWorkingCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useEffect, useState } from "react";
import { OfferData, Participant, PostRolesResponse, Professional } from "../../interface";
import getUser from "@/libs/getUser";

export default function ProducerWorkingContent({
    participants,
    mapRole,
}: {
    participants: Participant[];
    mapRole: PostRolesResponse[];
}) {
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedProfessional, setSelectedProfessional] = useState("");
    const [roleMap, setRoleMap] = useState<Map<string, OfferData[]>>(new Map());
    const [nameMap, setNameMap] = useState<Map<string, OfferData[]>>(new Map());
    const [mapRoles, setMapRoles] = useState<Map<string, string>>(new Map());
    const [professionalMap, setProfessionalMap] = useState<Map<string, Professional>>(new Map());
    const [offers, setOffers] = useState<OfferData[]>([]);

    console.log(participants);

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

        let professionalOffers: OfferData[] = [];
        participants.forEach((p) => {
            if(p.participantID === profID){ // same person
                p.offer.forEach((o) => {
                    if (o.role === selectedRole) { // same offer
                        professionalOffers.push(o);
                    }
                });
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
                            id={index.toString()}
                            status={"Pending"}
                            date={offer.createdAt}
                            amount={offer.price.toString()}
                            postName={offer.postID}
                            role={mapRoles.get(offer.role) || ""}
                            startDate={offer.createdAt}
                            description={offer.reason} 
                            productionName={professionalMap.get(selectedProfessional)?.username || ""} 
                            reviews={professionalMap.get(selectedProfessional)?.avgRating || 0}
                            professionalImg={professionalMap.get(selectedProfessional)?.imageUrl || "/image/logo-preview.png"}               
                            />
                    ))}
                    </div>
                )}
            </div>
        </main>
    );
}