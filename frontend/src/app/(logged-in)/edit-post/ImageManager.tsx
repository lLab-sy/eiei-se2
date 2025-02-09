"use client"
import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ImagePair {
  imgSrc: string;
  imgFile: File;
}

export default function ImageManager() {
  const [images, setImages] = useState<ImagePair[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if(!fileList) return;
    const files: File[] = Array.from(fileList);
    const newImages = files.map((file) => ({
      imgSrc: URL.createObjectURL(file),
      imgFile: file,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (imgSrc: string) => {
    setImages(images.filter((img) => img.imgSrc !== imgSrc));
  };

  return (
    <div>
      <Input type="file" multiple onChange={handleImageUpload} />
      <div className="flex flex-wrap">
        {images.map((img) => (
          <div key={img.imgSrc} className="relative group">
            <Image
              src={img.imgSrc}
              alt="Preview"
              width={100}
              height={100}
              className="rounded"
            />
            <X
              className="absolute top-1 right-1 cursor-pointer"
              onClick={() => removeImage(img.imgSrc)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
