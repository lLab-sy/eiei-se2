'use client'
 
import createPost from "@/libs/createPost";
import React, { useState } from "react"
import { PostData } from "../../../../interface";


export default function CreatePost(){
    const [file,setFile]=useState<File | null>(null);
    const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) {
          console.error("No file selected.");
          return;
      }
        console.log("OK")
        try {
            const formData = new FormData()
            formData.append("postname", "Interstrla");
            formData.append("postdescription", "scifi");
            formData.append("postmediatype", "movie");
            formData.append("postProjectRole", "actor");
            formData.append("poststatus", "created");
            formData.append('file', file)
            console.log("OK")
            const res = await createPost(formData);
            console.error("Success:");
          } catch (error) {
            console.error("Error:", error);
          }     
        };

       
         
   
    return(
    <main className="bg-red-300 h-full">
        <h1 className="text-center">Create Post Page</h1>
        <form onSubmit={handlerSubmit} >
             <input type="file" onChange={(e) => {
                        // Set the selected file to the state
                        const selectedFile = e.target.files ? e.target.files[0] : null;
                        setFile(selectedFile);
                    }} className="file-input file-input-bordered file-input-secondary w-full max-w-xs"/>
             <button type="submit" className="btn btn-primary">Add User</button> 
        </form>
    </main>)
}