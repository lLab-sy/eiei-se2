import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostState {
  postname: string;
  description: string;
  type: "media" | "short" | "drama" | "ads";
  roles: { label: string; value: string }[];
  images: { imgSrc: string; imgFile?: File }[]; // เพิ่ม state สำหรับรูปภาพ
}

const initialState: PostState = {
  postname: "",
  description: "",
  type: "media",
  roles: [],
  images: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action: PayloadAction<Partial<PostState>>) => {
      return { ...state, ...action.payload };
    },
    resetPost: () => initialState,
    addImage: (state, action: PayloadAction<{ imgSrc: string}>) => {
      if (state.images.length < 3) {
        state.images.push(action.payload);
      }
    },
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter((img) => img.imgSrc !== action.payload);
    },
  },
});

export const { setPost, resetPost, addImage, removeImage } = postSlice.actions;
export default postSlice.reducer;
