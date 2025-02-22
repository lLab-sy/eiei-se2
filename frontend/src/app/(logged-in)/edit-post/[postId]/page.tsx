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
import { useParams } from "next/navigation";
//Multiselect: https://shadcnui-expansions.typeart.cc/docs/multiple-selector
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import uploadImage from "@/hooks/upload-image";
import { useSession } from "next-auth/react";
import {
  imagePair,
  MediaTypesResponse,
  PostData,
  PostRolesResponse,
} from "../../../../../interface";
import getPostRoles from "@/libs/getPostRoles";
//import createPost from "@/libs/postPost";
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
} from "@/components/ui/alert-dialog";
import getPostById from "@/libs/getPostById";
import editPostById from "@/libs/editPostById";

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
    .string({ required_error: "Please select your media type" })
    .min(1, { message: "Please Select mediaType" }),
  roles: z
    .array(optionSchema)
    .min(1, { message: "Please choose at least one role." }),
});

export default function EditPostPage({
  initialPostId,
}: {
  initialPostId: string;
}) {
  const { data: session } = useSession();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!session) {
    setErrorMessage("This post does not exist.");
    return <div className="flex justify-center py-10">No session...</div>;
  }

  const token = session.user?.token;
  const myUserID = session.user.id;
  //console.log(token)

  interface imagePair {
    imgSrc: string;
    imgFile: File;
  }

  interface IpostImageDisplay{
    imageURL:string;
    imageKey:string;
  }
  

  const [img, setImg] = useState<imagePair[]>([]);
  const [postImages, setPostImages] = useState<IpostImageDisplay[]>([]);
  const [postImagesKey, setPostImagesKey] = useState<string[]>([]);
  const [deletedImageKey, setDeletedImageKey] = useState<string[]>([]);
  const [mostRecentImg, setMostRecentImg] = useState<string>("");
  const [postRoles, setPostRoles] = useState<Option[] | null>(null);
  const [mediaTypes, setMediaTypes] = useState<Option[] | null>(null);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [rolesResponse, mediaResponse] = await Promise.all([
          getPostRoles(),
          getMediaTypes(),
        ]);

        setPostRoles(
          rolesResponse.data.data.map((role: PostRolesResponse) => ({
            label: role.roleName,
            value: role.id,
          })),
        );

        /*setPostRoles(
          Array.from(
            new Map(
              (rolesResponse.data.data as PostRolesResponse[]).map((role) => [
                role.roleName, // Use roleName as the key to prevent duplicates
                { label: role.roleName, value: role.id }
              ])
            ).values()
          ) as Option[] // Cast the result to Option[] explicitly
        );*/  
        

        setMediaTypes(
          mediaResponse.data.data.map((media: MediaTypesResponse) => ({
            label: media.mediaName,
            value: media.id,
          })),
        );
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    }
    fetchOptions();
  }, []);

  const { postId } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postname: "",
      description: "",
      type: "",
      roles: [],
    },
  });

  useEffect(() => {
    if (postRoles && mediaTypes && typeof postId === "string") {
      getPostById(postId, token)
        .then((data) => {
          if (!data) {
            setErrorMessage("This post doesn't exist.");
          }

          if (session.user?.id !== data.userID) {
            setErrorMessage("You are not the producer of this post.");
          }

          if(data.postImageDisplay.length > 0){
            setPostImages(data.postImageDisplay);
            setPostImagesKey(data.postImagesKey);
            setMostRecentImg(data.postImageDisplay[data.postImageDisplay.length-1].imageURL);
          }

          form.reset({
            postname: data.postName || "",
            description: data.postDescription || "",
            type: data.postMediaType || "",
            roles: data.postProjectRolesOut.map((role: { id: string; roleName: string }) => {
              const foundRole = postRoles.find((r) => r.value === role.id); // Match by `id`
              return foundRole || { label: role.roleName, value: role.id }; // Set value to `id`
            }),                       
          });
        })
        .catch((error) => {
          console.error("Error loading post:", error);
          setErrorMessage("This post does not exist.");
        });
    }
  }, [postRoles, mediaTypes, postId, token, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    

    const userID = session?.user.id;
    if (!userID) return;
    if (!postId) return;

    //const postImage = imageList.map((img) => URL.createObjectURL(img));
    const postData = {
      postName: values.postname,
      postDescription: values.description,
      postImagesKey: postImagesKey,
      postStatus: "created",
      userID: session?.user.id,
      postMediaType: values.type,
      //postImagesSend: be appended below,
      keyImagesDelete: deletedImageKey,
      postProjectRoles: values.roles.map((obj) => obj.value),  
    };
    console.log(postData);

    const formData = new FormData()
    const imageList = img.map((img) => img.imgFile);
    if (imageList.length > 0) {
      imageList.forEach((file) => {
        formData.append("postImagesSend", file);  
      });
    }
    formData.append('postData',JSON.stringify(postData))

    console.log("FormData")
    console.log(postData);

    const postEditResponse = await editPostById(
      postId.toString(),
      postData,
      token,
    );
    if (postEditResponse === null) {
      toast({
        variant: "destructive",
        title: "Image uploading failed",
        description: "Please try again.",
      });
      return;
    }
    toast({
      variant: "default",
      title: "Successful editing post",
      description: "Redirecting you...",
    });
  }

  // ตรวจสอบว่าเป็น IpostImageDisplay หรือไม่
  const isIpostImageDisplay = (imgData: IpostImageDisplay | imagePair): imgData is IpostImageDisplay => {
    return (imgData as IpostImageDisplay).imageKey !== undefined;  // เช็คว่า 'imageKey' มีอยู่ในข้อมูล
  };


  const onImgChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const files: File[] = Array.from(e.target.files);
      if (files.length + img.length > 3) {
        toast({
          variant: "destructive",
          title: "Picture count limit",
          description: "Sorry, only up to 3 pictures are allowed.",
        });
        return;
      }
      const oversizedFiles: string[] = [];
      const filenames: imagePair[] = files
        .filter((file) => {
          if (file.size > 8388608) {
            oversizedFiles.push(file.name + file.type);
            return false;
          }
          return true;
        })
        .map((file) => {
          return {
            imgSrc: URL.createObjectURL(file),
            imgFile: file,
          } as imagePair;
        });
      if (oversizedFiles.length > 0) {
        toast({
          variant: "destructive",
          title: "Picture size limit",
          description: `Sorry, only up to 8MB pictures are allowed. ${oversizedFiles.length > 2 ? "" : oversizedFiles.join(",")}`,
        });
      }
      setMostRecentImg(filenames[filenames.length - 1].imgSrc);
      const newImg = [...img, ...filenames];
      setImg(newImg);
      //setMostRecentImg(img[img.length-1].imgSrc);
    }
  };

  const removeImg = (imgSrc: string) => {
    const isUploadedImg = img.some((img) => img.imgSrc === imgSrc);
    if(isUploadedImg){
      const updatedImg = img.filter((img) => img.imgSrc !== imgSrc);
      setImg(updatedImg);
      if (mostRecentImg === imgSrc && updatedImg.length > 0) {
        setMostRecentImg(updatedImg[updatedImg.length - 1].imgSrc);
      }else if(postImages.length>0){
        setMostRecentImg(postImages[postImages.length - 1].imageURL);
      }
    }else{
      const removedImage = postImages.find((img) => img.imageURL === imgSrc);
      if (removedImage) {
        setDeletedImageKey((prev) => [...prev, removedImage.imageKey]);
      }
      const updatedPostImages = postImages.filter((img) => img.imageURL !== imgSrc);
      setPostImages(updatedPostImages);
      if (mostRecentImg === imgSrc && updatedPostImages.length > 0) {
        setMostRecentImg(updatedPostImages[updatedPostImages.length - 1].imageURL);
      }else if(img.length>0){
        setMostRecentImg(img[img.length-1].imgSrc);
      }
    }
    // setImg(img.filter((img) => img.imgSrc !== imgSrc));
    // console.log(img.length);
    // if (mostRecentImg === imgSrc && img.length > 1)
    //   setMostRecentImg(img[img.length - 2].imgSrc);
  };

  if (!postRoles || !mediaTypes) {
    return (
      <div className="flex justify-center py-60">
        No postRoles or mediaTypes...
      </div>
    );
  }

  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen">
      {!session && (
        <div className="flex justify-center py-10">No session...</div>
      )}

      {errorMessage && (
        <div className="flex flex-wrap flex-row sm:w-[70%] w-[100%] my-20 px-18">
          <Card className="w-[100%]">
            <CardHeader>
              <CardTitle className="justify-center flex">
                {errorMessage}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {session && !errorMessage && (
        <div className="flex flex-wrap flex-row sm:w-[70%] w-[100%] my-12 px-18">
          <Card className="w-[100%]">
            <CardHeader>
              <CardTitle className="justify-center flex">Edit Post</CardTitle>
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
                                  {mediaTypes.map((eachMediaType: Option) => (
                                    <SelectItem
                                      key={eachMediaType.value}
                                      value={eachMediaType.value}
                                    >
                                      {eachMediaType.label}
                                    </SelectItem>
                                  ))}
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
                    />
                    {/*<Button type="submit">Edit Post</Button> */}
                    <AlertDialog>
                      <AlertDialogTrigger className=" bg-mainblue text-white p-3 rounded-md hover:bg-sky-700">
                        Edit Post
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This post will be edited.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-green-700" asChild>
                            <Button
                              onClick={() => form.handleSubmit(onSubmit)()}
                            >
                              Confirm
                            </Button>
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
                    {(postImages.length !== 0 || img.length!==0 )? (
                      <Image
                        src={mostRecentImg}
                        alt="Post Image Here"
                        width={parent.innerWidth}
                        height={parent.innerHeight}
                        className="max-h-48 object-scale-down aspect-square"
                        priority
                        placeholder="empty"
                      />
                    ) : (
                      <Image
                        src="/image/logo.png"
                        alt="Post Image Here"
                        width={parent.innerWidth}
                        height={parent.innerHeight}
                        className="max-h-48 object-scale-down"
                        priority
                        placeholder="empty"
                      />
                    )}
                  </div>
                  <Input
                    type="file"
                    accept="image/*"
                    className="file:text-mainyellow-light file:font-medium bg-mainblue my-5 cursor-pointer hover:bg-mainblue-light text-white"
                    placeholder="Your post picture"
                    onChange={onImgChange}
                    multiple
                    disabled={img.length+postImages.length >= 3 ? true : false}
                  />
                  <div className="w-[80%] justify-center flex">
                    <Carousel>
                      <CarouselContent>
                        {(postImages.length > 0 || img.length > 0) ? (
                          [...postImages, ...img].map((imgData, index) => (
                            <CarouselItem
                            key={isIpostImageDisplay(imgData) ? imgData.imageKey : imgData.imgSrc}
                              className="relative pt-1 justify-center inline-flex flex-col group"
                            >
                              <Image
                                src={isIpostImageDisplay(imgData) ? imgData.imageURL : imgData.imgSrc}
                                alt="Post Image Here"
                                width={parent.innerWidth}
                                height={parent.innerHeight}
                                className="max-h-48 object-contain aspect-square cursor-pointer bg-maingrey "
                                priority
                                placeholder="empty"
                                onClick={() => setMostRecentImg(isIpostImageDisplay(imgData) ? imgData.imageURL : imgData.imgSrc)}
                              />
                              <X
                                className="absolute top-1 right-1 hidden group-hover:block
                           bg-mainblue-lightest cursor-pointer"
                                onClick={() => removeImg(isIpostImageDisplay(imgData) ? imgData.imageURL : imgData.imgSrc)}
                              />
                            </CarouselItem>
                          ))
                        ) : (
                          <CarouselItem
                            key={"/image/logo.png"}
                            className="pt-1"
                          >
                            <Image
                              src="/image/logo.png"
                              alt="Post Image Here"
                              width={parent.innerWidth}
                              height={parent.innerHeight}
                              className="max-h-48 object-scale-down"
                              placeholder="empty"
                            />
                          </CarouselItem>
                        )}
                      </CarouselContent>
                      <Label>Total item: {img.length+postImages.length}</Label>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
