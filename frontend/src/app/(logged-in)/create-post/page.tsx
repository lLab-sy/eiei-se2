"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
//Multiselect: https://shadcnui-expansions.typeart.cc/docs/multiple-selector
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import uploadImage from "@/hooks/upload-image";
import { useSession } from "next-auth/react";
import { imagePair, MediaTypesResponse, PostData, PostRolesResponse } from "../../../../interface";
import getPostRoles from "@/libs/getPostRoles";
import createPost from "@/libs/postPost";
import getMediaTypes from "@/libs/getMediaTypes";
import router, { useRouter } from "next/navigation";
// import { useRouter } from "next/navigation"; //for renavigation after finishing
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
const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const formSchema = z.object({
  postname: z
    .string()
    .trim() //prevent case of PURELY whitespace
    .min(4, { message: "Project name must be at least 4 characters." })
    .max(100, { message: "Project name must not exceed 100 characters." }),
  description: z
    .string()
    .trim() //prevent case of PURELY whitespace
    .min(50, { message: "Description must be at least 50 characters." })
    .max(1000, { message: "Description must not exceed 1000 characters." }),
  //mock type, roles -> will need API to be updatable
  type: z
    .string({required_error: "Please select your media type"})
    .min(1,{message:"Please Select mediaType"}),
  roles: z
    .array(optionSchema)
    .min(1, { message: "Please choose at least one role." }),
});

 
export default function CreatePostPage() {

  const {data:session,status} = useSession()
  
  if(status === "loading"){
    return <>Loading</>
  }

  const token=session?.user?.token ?? ''
  console.log(token)

  useEffect(()=>{
      console.log(session)
      const fetchData=async()=>{
          const response= await getPostRoles()
          const tmp= response.data.data
          let options:Option[]=[];
          tmp.map((eachRole:PostRolesResponse)=>{
            options.push({ label: eachRole.roleName, value: eachRole.id })
          })
          setPostRoles(options)
          // console.log("Option",options)
      }
      fetchData()
  },[session])
  useEffect(()=>{
    const fetchData=async()=>{
        const response= await getMediaTypes()
        const tmp= response.data.data
        let options:Option[]=[];
        tmp.map((eachMediaType:MediaTypesResponse)=>{
          options.push({ label: eachMediaType.mediaName, value: eachMediaType.id })
        })
        setMediaTypes(options)
        // console.log("MediaType",options)
    }
    fetchData()
},[])


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postname: "",
      description: "",
      type: "",
    },
  });



  
  // /*  TODO: wait for the need to use renavigate
  const router = useRouter(); 
  const { toast } = useToast();


  //For CREATE POST 

  async function onSubmit (values: z.infer<typeof formSchema>) {
    const imageList = img.map((img)=>(img.imgFile))
    const userID= session?.user.id
    if(!userID){
      return;
    }
    // const response = await uploadImage({imageFiles : imageList, token : ''})
    // if (response === null) {
    //   toast({
    //     variant: "destructive",
    //     title: "Image uploading failed",
    //     description: "Please try again.",
    //   })
    //   return
    // }
    // const postImage: string[] = response.data

    //mock image
    const postImage = imageList.map((img)=>(URL.createObjectURL(img)))
    const postData:PostData = {
      postProjectRoles: values.roles.map((obj) => obj.value),
      postName: values.postname,
      postMediaType: values.type,
      postImages:["Picture.png"],
      postStatus: "created",
      userID: session?.user.id,
      postDescription: values.description
    };
 


    const postCreateResponse = await createPost(postData,token)
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
      title: "Successful post creation",
      description: "Redirecting you...",
    })
    // TODO: await for API to finish then renavigate
    // router.push(`/my-post`); 
  }



  const [img,setImg] = useState<imagePair[]>([]);
  const [postRoles,setPostRoles]=useState<Option[]|null>(null)
  const [mediaTypes,setMediaTypes]=useState<Option[]|null>(null)
  const [mostRecentImg, setMostRecentImg] = useState<string>("")


  const onImgChange = (e:any) => {
    if (e.target.files && e.target.files[0]) {
      const files: File[] = Array.from(e.target.files)
      if (files.length + img.length > 3){
        toast({
          variant: "destructive",
          title: "Picture count limit",
          description: "Sorry, only up to 3 pictures are allowed.",
        })
        return
      }
      const oversizedFiles: string[] = [];
      const filenames: imagePair[] = files.filter((file)=>{
        if (file.size > 8388608) {
          oversizedFiles.push(file.name+file.type)
          return false
        }
        return true
      })
      .map((file)=>{return {
        imgSrc: URL.createObjectURL(file), 
        imgFile: file} as imagePair})
      if (oversizedFiles.length > 0){
        toast({
          variant: "destructive",
          title: "Picture size limit",
          description: `Sorry, only up to 8MB pictures are allowed. ${oversizedFiles.length >2 ? '':oversizedFiles.join(",")}`,
        })
      }
      setMostRecentImg(filenames[filenames.length-1].imgSrc)
      const newImg = [...img,...filenames]
      setImg(newImg)
    }
  }
  const removeImg = (imgSrc:string) => {
    setImg(img.filter((img)=>img.imgSrc !== imgSrc))
    console.log(img.length)
    if (mostRecentImg === imgSrc && img.length > 1) 
      setMostRecentImg(img[img.length-2].imgSrc)
  }
  if(!postRoles || !mediaTypes){
    return <>Loading</>
  }

 
  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen">
      <div className="flex flex-wrap flex-row sm:w-[70%] w-[100%] my-12 px-18">
        <Card className="w-[100%]">
          <CardHeader>
            <CardTitle className="justify-center flex">Create Post</CardTitle>
          </CardHeader>
          <div className="flex flex-row">
          <CardContent className="flex flex-col py-5 w-[60%]">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="postname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Post name</FormLabel>
                      <FormControl>
                        <Input placeholder="Help Required" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="I'm making a short film."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose your media type." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {
                                mediaTypes.map((eachMediaType:Option)=>(
                                  <SelectItem key={eachMediaType.value} value={eachMediaType.value}>{eachMediaType.label}</SelectItem>
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
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Requirement</FormLabel>
                      <FormControl>
                        <MultipleSelector
                          {...field}
                          defaultOptions={postRoles}
                          placeholder="Choose roles required for your project"
                          hidePlaceholderWhenSelected
                          emptyIndicator={
                            <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                              No result found.
                            </p>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  // still lacking picture but uncertain if needed
                />
                {/* <Button type="submit">Create Post</Button> */}
                <AlertDialog>
                  <AlertDialogTrigger className=" bg-mainblue text-white p-3 rounded-md hover:bg-sky-700">Create Post</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This post will add to your my-posts
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

              </form>
            </Form>

          </CardContent>
          <CardContent className="w-[40%] py-5">
            <CardTitle className="text-sm">Your Post Picture</CardTitle>
            <div className="flex flex-col items-center">
              <div className="h-1/2">
              {img.length !== 0 ? (
                  <Image src={mostRecentImg} 
                    alt="Post Image Here" 
                    width={parent.innerWidth}
                    height={parent.innerHeight}
                    className="max-h-48 object-scale-down aspect-square" 
                    priority
                    placeholder= "empty"/>
              ):(
                <Image src="/image/logo.png"
                alt="Post Image Here" 
                width={parent.innerWidth}
                height={parent.innerHeight}
                className="max-h-48 object-scale-down" 
                priority
                placeholder= "empty"/>
              )}
              </div>
              <Input 
                type="file"
                accept="image/*"
                className="file:text-mainyellow-light file:font-medium bg-mainblue my-5 cursor-pointer hover:bg-mainblue-light text-white"
                placeholder= "Your post picture"
                onChange={onImgChange}
                multiple
                disabled = {img.length >= 3 ? true : false}
                />
              <div className="w-[80%] justify-center flex">
                <Carousel>
                  <CarouselContent>
                    {img.length !== 0 ?(img.map((img)=> 
                        (
                        <CarouselItem key={img.imgSrc} className="relative pt-1 justify-center inline-flex flex-col group">
                          <Image src={img.imgSrc} 
                            alt="Post Image Here" 
                            width={parent.innerWidth}
                            height={parent.innerHeight}
                            className="max-h-48 object-contain aspect-square cursor-pointer bg-maingrey " 
                            priority
                            placeholder= "empty"
                            onClick={()=>
                              setMostRecentImg(img.imgSrc)
                            }/>
                            <X className="absolute top-1 right-1 hidden group-hover:block
                           bg-mainblue-lightest cursor-pointer"
                           onClick = {()=>removeImg(img.imgSrc)} />
                        </CarouselItem>
                        )
                      )
                    ):(
                        <CarouselItem key={"/image/logo.png"} className="pt-1">
                          <Image src="/image/logo.png"
                            alt="Post Image Here" 
                            width={parent.innerWidth}
                            height={parent.innerHeight}
                            className="max-h-48 object-scale-down" 
                            placeholder= "empty"/>
                        </CarouselItem>)
                    }
                  </CarouselContent>
                  <Label>Total item: {img.length}</Label>
                  <CarouselPrevious/>
                  <CarouselNext/>
                </Carousel>
              </div>
            </div>
          </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
