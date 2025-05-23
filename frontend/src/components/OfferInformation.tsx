"use client"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { toast, useToast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { OfferData, PostRolesResponse, PostData } from "../../interface";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import createOffer from "@/libs/postOffer";
import { useRouter } from "next/navigation";

export default function OfferInformation({postSelectData,productionProfessionalID,userRole}:{postSelectData:PostData,productionProfessionalID:string,userRole:string}){
    const router = useRouter()
    const {data:session}=useSession();
    const userID= session?.user.id
    const token = session?.user.token
    const optionSchema = z.object({
        label: z.string(),
        value: z.string(),
        disable: z.boolean().optional(),
      });
    if(!postSelectData.postProjectRolesOut || !token){
        return (
          <div className="flex justify-center items-center min-h-screen">
              <Card className="p-6 max-w-md">
                <CardTitle className="text-mainred mb-4">
                  Unauthorized Access
                </CardTitle>
                <p>This page is only available for producers and professionals.</p>
              </Card>
            </div>
        )
    }

    const formSchema = z.object({
        price: z
          .number()
          .min(1, { message: "Price more than 0." })
          .max(5000000000),
        description: z
          .string()
          .trim() //prevent case of PURELY whitespace
          .min(20, { message: "Description must be at least 20 characters." })
          .max(1000, { message: "Description must not exceed 1000 characters." }),
        postRole: z
          .string({required_error: "Please select production professional role"})
          .min(1,{message:"Please Select Production Professional Role"})
      });

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
           description:"",
            price:0,
            postRole:""
        },
      });
      useEffect(() => {
        form.setValue("postRole", "");
      }, [postSelectData, form.setValue]);

      async function onSubmit (values: z.infer<typeof formSchema>) {
          const userID= session?.user.id
          if(!userID || !postSelectData.id){
            return;
          }
      
          const offerData:OfferData = {
            roleID: values.postRole,
            productionProfessionalID: productionProfessionalID,
            price: values.price,
            offeredBy: userRole==="Producer"?1:0,
            createdAt: new Date(),
            reason: values.description,
            postID: postSelectData.id,
          };
       
      
          console.log(offerData)
          const postCreateResponse = await createOffer(offerData,token ?? "")
          if (postCreateResponse === null) {
            toast({
              variant: "destructive",
              title: "Image uploading failed",
              description: "Please try again.",
            })
            return
          }
            toast({
            variant: "default",
            title: "Successful offer creation",
            description: "Redirecting you...",
          })
          // TODO: await for API to finish then renavigate
          
          router.push(`/my-offering/${postSelectData.id}`); 

        }
 
    return(
        <div className="mb-12 mt-10">
            <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-1 lg:grid-cols-2 mb-12 space-y-8"
            >
                <div className="lg:col-span-2 m-auto w-[80%]">
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="font-bold">Description</FormLabel>
                        <FormControl>
                            <Textarea className="shadow-lg"
                            placeholder="Detail of your offer"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="lg:col-span-1 m-auto w-[80%] lg:w-[60%]">
                    <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="font-bold">Price</FormLabel>
                        <FormControl>
                            <Input className="shadow-lg" type="number" placeholder="200" {...field} value={field.value ?? ""} 
                              onChange={(e) => {field.onChange(e.target.value === "" ? undefined : parseInt(e.target.value)); console.log(e.target.value)}}   
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="lg:col-span-1 m-auto w-[80%] lg:w-[60%]">
                    <FormField
                    control={form.control}
                    name="postRole"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="font-bold">Role</FormLabel>
                        <FormControl className="shadow-lg">
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="shadow-lg ">
                            <SelectValue  placeholder="Choose Offer Role." />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectGroup>
                            {
                                (postSelectData?.postProjectRolesOut ?? []).map((eachRole: PostRolesResponse) => (
                                <SelectItem key={eachRole.id} value={(eachRole.id).toString()}>
                                    {eachRole.roleName}
                                </SelectItem>
                                ))
                            }
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                    />
                </div>
                
                <div className="lg:col-span-2 m-auto">
                    <AlertDialog>
                    <AlertDialogTrigger className=" bg-mainblue text-white p-3 rounded-md hover:bg-sky-700 shadow-lg">Send Offer</AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This offer will send to him/her
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-green-700" asChild> 
                              <Button
                                onClick={() => form.handleSubmit(onSubmit)()}>Confirm</Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                </div>
                </form>
              </Form>
        </div>
    )
}