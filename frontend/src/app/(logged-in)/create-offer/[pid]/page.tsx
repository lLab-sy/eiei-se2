"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
export default function CreateOfferPage({productionProfessionalID}:{productionProfessionalID:string}){
    
    const [postSelect,setPostSelect] = useState()
    return(
        <div className="flex bg-mainblue-light justify-center min-h-screen">
            <div className="flex flex-wrap flex-row sm:w-[70%] w-[100%] my-12 px-18">
            <Card className="w-[100%] shadow-xl">
                <CardHeader>
                    <CardTitle className="justify-start flex">Name of Prodcution</CardTitle>
                </CardHeader>
                {/* Drag Line */}
                <hr className="h-px bg-black border-0 dark:bg-gray-700"></hr> 

            </Card>
            </div>
        </div>
    )
}