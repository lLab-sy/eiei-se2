// 'use client'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Button } from "@/components/ui/button";
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
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
import { PostRolesResponse, Project } from "../../interface";

export default function OfferInformation({postSelectData}:{postSelectData:Project}){
    const optionSchema = z.object({
        label: z.string(),
        value: z.string(),
        disable: z.boolean().optional(),
      });

    const formSchema = z.object({
        price: z
          .number().int()
          .min(0, { message: "Price more than 0." }),
        description: z
          .string()
          .trim() //prevent case of PURELY whitespace
          .min(50, { message: "Description must be at least 50 characters." })
          .max(1000, { message: "Description must not exceed 1000 characters." }),
        postRole: z
          .string({required_error: "Please select your media type"})
          .min(1,{message:"Please Select mediaType"})
          .max(50000000,{message:"Please Select mediaType"}),
      });

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
           
        },
      });


    if(!postSelectData.postProjectRolesOut){
        return <>Loading...</>
    }
    const handleSelectChange= (selectID:string)=>{{
        console.log("change")
        return;
    }}
    return(
        <div className="mb-12 mt-10">
            <Form {...form}>
            <form
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
                <div className="lg:col-span-1 m-auto w-[60%]">
                    <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input className="shadow-lg" min={0} type="number" placeholder="200" {...field}  />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="lg:col-span-1 m-auto w-[60%]">
                    <FormField
                    control={form.control}
                    name="postRole"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue  placeholder="Choose Offer Role." />
                          </SelectTrigger>
                          <SelectContent>
                          <SelectGroup>
                            {
                                (postSelectData?.postProjectRolesOut ?? []).map((eachRole: PostRolesResponse) => (
                                <SelectItem key={eachRole.id} value={eachRole.id}>
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
                    <AlertDialogTrigger className=" bg-mainblue text-white p-3 rounded-md hover:bg-sky-700">Send Offer</AlertDialogTrigger>
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
                                <Button>Confirm</Button>
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