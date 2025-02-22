/*"use client"

// displayTest.tsx
import React, { useEffect, useState } from "react";
import getPostRoles from "@/libs/getPostRoles";
import getMediaTypes from "@/libs/getMediaTypes";


const DisplayTest = () => {
  const [mediaTypes, setMediaTypes] = useState<any>(null);
  const [postRoles, setPostRoles] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mediaResponse = await getMediaTypes();
        const rolesResponse = await getPostRoles();

        // ตั้งค่าผลลัพธ์ของ API แต่ละตัว
        setMediaTypes(mediaResponse.data);
        setPostRoles(rolesResponse.data);

        setLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Media Types</h1>
      <pre>{JSON.stringify(mediaTypes, null, 2)}</pre>

      <h1>Post Roles</h1>
      <pre>{JSON.stringify(postRoles, null, 2)}</pre>
    </div>
  );
};

export default DisplayTest;*/
