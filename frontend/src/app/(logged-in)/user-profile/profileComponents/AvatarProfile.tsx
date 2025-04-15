'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dynamic from "next/dynamic";
import Image from "next/image"
import { useMemo } from "react";

export default function AvatarProfile({ img }: { img: { image: string } }) {
  const AvatarImageDynamic = useMemo(() => dynamic(() => import("@/components/ui/avatar").then((mod) => mod.AvatarImage), {
    ssr: false,
  }), [img]);
  return (
    <Avatar className="order-1 lg:order-2 w-[240px] h-[240px] lg:w-[150px] lg:h-[150px] flex justify-center items-center">
      <AvatarImageDynamic
        fetchPriority="high"
        src={img.image}
        loading="eager"
        alt="Profile Image"
        width={240}
        height={240}
        className="object-cover rounded-full"
      />
      <AvatarFallback className="border border-black rounded-full"></AvatarFallback>
    </Avatar>
  );
}