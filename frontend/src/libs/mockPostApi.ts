// mockApi.ts
let mockDatabase: Record<string, any> = {};

export const fetchPostData = async (postId: string) => {
    console.log("Fetching post data for postId:", postId); // Debug
    console.log("Current mockDatabase:", mockDatabase); // ดูข้อมูล mockDatabase
    return mockDatabase[postId] || {};
  
    // คืนค่าข้อมูลจาก mockDatabase ถ้ามี
  if (mockDatabase[postId]) return mockDatabase[postId];

  // ถ้าไม่มี ให้เพิ่มข้อมูล mock ลงใน mockDatabase
  const defaultData = {
    postName: `My Amazing Short Film: ${postId}`,
    description: "This is a short film about life, dreams, and reality.",
    mediaType: "short" as "media" | "short" | "drama" | "ads",
    roles: [
      { label: "Director", value: "director" },
      { label: "Editor", value: "editor" },
    ],
    images: [{ imgSrc: "/image/logo.png", imgFile: null }],
  };

  mockDatabase[postId] = defaultData;
  return defaultData;
};

export const updateMockDatabase = async (postId: string, updatedData: any) => {
  console.log("Updating post in mockDatabase:", postId, updatedData);
  mockDatabase[postId] = updatedData;
  return Promise.resolve();
};
