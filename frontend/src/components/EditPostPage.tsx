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
import { useForm } from "react-hook-form";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import {
  setPostName,
  setDescription,
  setMediaType,
  setRoles,
  setImages,
  resetPost,
  setInitialState,
} from "@/redux/post/editPost.slice";
import { fetchPostData, updateMockDatabase } from "@/libs/mockPostApi";
import { useParams } from "next/navigation";

const OPTIONS: Option[] = [
  { label: "Producer", value: "producer" },
  { label: "Camera Operator", value: "camera operator" },
  { label: "Director", value: "director" },
  { label: "Cinematographer", value: "cinematographer" },
  { label: "Editor", value: "editor" },
  { label: "Sound Mixer", value: "sound mixer" },
  { label: "Prop Master", value: "prop master" },
  { label: "Audio Technician", value: "audio technician" },
];

export default function EditPostPage({ initialPostId  }: { initialPostId : string }) {
  const params = useParams();
  console.log("Params from useParams:", params); // ดูค่าที่ได้

  const postId = params?.postId as string || initialPostId; // ✅ ดึงค่า postId อย่างถูกต้อง
  console.log("Current postId:", postId);

  const { toast } = useToast();
  const dispatch = useDispatch();
  //const router = useRouter();
  //const postIdFromURL = router.query.postId as string; // ดึง postId จาก URL
  const post = useSelector((state: RootState) => state.post);

  const { postName, description, mediaType, roles } = post;
  const images = useSelector((state: RootState) => state.post.images) || [];

  const form = useForm({
    defaultValues: useMemo(
      () => ({
        postname: postName || "",
        description: description || "",
        type: mediaType || "media",
        roles: roles || [],
      }),
      [postName, description, mediaType, roles],
    ),
  });

  // โหลดข้อมูลเฉพาะเมื่อ Redux state ยังไม่มีข้อมูล
  useEffect(() => {
    if (postId) {
      console.log("New postId detected:", postId);
      const loadPostData = async () => {
        const data = await fetchPostData(postId);
        dispatch(setInitialState(data)); // ✅ อัปเดต Redux ทันทีที่ `postId` เปลี่ยน
        form.reset({
          postname: data.postName,
          description: data.description,
          type: data.mediaType,
          roles: data.roles,
        });
      };
      loadPostData();
    }
  }, [postId, dispatch, form]);
  

  useEffect(() => {
    form.reset({
      postname: postName,
      description,
      type: mediaType,
      roles,
    });
  }, [postId, form]);

  useEffect(() => {
    console.log("Current form values:", form.getValues());
  }, [form.getValues()]);

  const onSubmit = async (values: any) => {
    console.log("Form submitted with values:", values); // ✅ Debug เช็คค่าที่ส่งมา

    const updatedData = {
      postName: values.postname,
      description: values.description,
      mediaType: values.type,
      roles: values.roles,
      images,
    };
    console.log("✅ Updated Data to be saved:", updatedData); // ✅ Debug จุดที่สอง
    dispatch(setInitialState(updatedData));
    await updateMockDatabase(postId, updatedData);

    console.log("🚀 Data update complete! Showing toast..."); // ✅ Debug จุดที่สาม
    toast({ title: "Post updated successfully!" });
  };

  const [files, setFiles] = useState<File[]>([]);

  const onImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const uploadedFiles = Array.from(event.target.files);
    const uploadedImages = uploadedFiles.map((file) => ({
      imgSrc: URL.createObjectURL(file),
      imgFile: file.name,
    }));

    setFiles((prev) => [...prev, ...uploadedFiles]); // เก็บ `File` ใน useState
    dispatch(setImages([...images, ...uploadedImages])); // Redux เก็บแค่ข้อมูลที่ serialize ได้
  };

  const removeImage = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedImages = images.filter((_, i) => i !== index);

    setFiles(updatedFiles); // อัปเดต useState
    dispatch(setImages(updatedImages)); // อัปเดต Redux
  };

  return (
    <div className="flex bg-mainblue-light justify-center min-h-screen">
      <div className="flex flex-wrap flex-row sm:w-[70%] w-[100%] my-12 px-18">
        <Card className="w-[100%]">
          <CardHeader>
            <CardTitle className="justify-center flex">Edit Post</CardTitle>
          </CardHeader>
          <div className="flex flex-row">
            <CardContent className="flex flex-col py-5 w-[60%]">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div>
                  <label>Post Name</label>
                  <Input
                    value={form.watch("postname")}
                    onChange={(e) => {
                      dispatch(setPostName(e.target.value));
                      form.setValue("postname", e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label>Description</label>
                  <Textarea
                    value={form.watch("description")}
                    onChange={(e) => {
                      dispatch(setDescription(e.target.value));
                      form.setValue("description", e.target.value);
                    }}
                  />
                </div>
                <div>
                  <label>Media Type</label>
                  <Select
                    value={mediaType}
                    onValueChange={(
                      value: "media" | "short" | "drama" | "ads",
                    ) => dispatch(setMediaType(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select media type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="drama">Drama</SelectItem>
                        <SelectItem value="ads">Ads</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label>Role Requirements</label>
                  <MultipleSelector
                    value={roles.map(({ label, value }) => ({ label, value }))}
                    defaultOptions={OPTIONS}
                    onChange={(selectedOptions) =>
                      dispatch(
                        setRoles(
                          selectedOptions.map((option) => ({
                            ...option,
                            disable: false,
                          })),
                        ),
                      )
                    }
                  />
                </div>
                <div>
                  <label>Images</label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImgChange}
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {images?.length > 0 ? (
                      images.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image.imgSrc}
                            alt={`Image ${index}`}
                            width={200}
                            height={200}
                          />
                          <button onClick={() => removeImage(index)}>
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No images uploaded yet.</p>
                    )}
                  </div>
                </div>
                <Button onClick={form.handleSubmit(onSubmit)}>Update Post</Button>
              </form>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
