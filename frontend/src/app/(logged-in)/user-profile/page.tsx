"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import styles from './animation.module.css'

const formSchema = z.object({
  email: z.string().email().max(100, ""),
  phone: z.string().min(9).max(9),
  gender: z.enum(["Male", "Female", "Non-binary", "Other"]),
});
type formType = typeof formSchema;
export default function UserPage() {
  const form = useForm<z.infer<formType>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });
  const [gender, setGender] = useState("");
  const [click, setClick] = useState(false)
  // redux to dispatch changes
  return (
    <main className="min-h-screen flex bg-blue-400 relative items-center justify-center">
      
      <div className="flex justify-around w-[70%] h-[400px]">
        <Card className='w-[400px]'>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-center'>
            <div className="text-xl font-serif font-bold flex justify-center h-[50px] items-center">
              Name
            </div>
            <div className="bg-black w-[150px] h-[150px] rounded-full"></div>
            <Button className='mt-5'>Upload New Photo</Button>
            
          </CardContent>
        </Card>
        <Card className="w-[500px]">
          <CardHeader className=''>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className=" flex flex-col relative">
          <div className="flex flex-row w-[50%] relative justify-between">
              <Link href={""} onClick={() => setClick(true)} className={`${styles.divLine} hover:after:scale-x-100 after:bg-blue-200 after:content-[''] after:w-[30%] after:h-[3px] after:absolute after:bottom-[-60%] after:left-0 ${(click) ? 'after:scale-x-100' : 'after:scale-x-0'}`}>User Info</Link>
              <Link href={""} onClick={() => setClick(false)} className={`${styles.divLines} hover:after:scale-x-100 cursor-pointer after:bg-blue-200 after:content-[''] after:w-[58%] after:h-[3px] after:absolute after:bottom-[-60%] after:left-[43%] ${(!click) ? 'after:scale-x-100' : 'after:scale-x-0'}`}>Billing Information</Link>
            </div>
            <Separator className="my-3" />
            {
              (click) ? (<Form {...form}>
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="flex flex-row w-[100%] flex-wrap justify-between"
                >
                  <FormItem className="">
                    <FormLabel>Username</FormLabel>
                    <Input type="text" />
                  </FormItem>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem className="flex flex-col justify-end">
                    <FormLabel className=' flex items-center'>Gender</FormLabel>
                    <Select onValueChange={setGender}> 
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Your Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                  <FormItem className="flex flex-col w-[100%] h-[100px] justify-center">
                    <Button>Update Info</Button>
                  </FormItem>
                </fieldset>
              </Form>) : (<div></div>)
            }
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
