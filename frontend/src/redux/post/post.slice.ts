import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostState {
  postname: string;
  description: string;
  type: "media" | "short" | "drama" | "ads";
  roles: { label: string; value: string }[];
}

const initialState: PostState = {
  postname: "",
  description: "",
  type: "media",
  roles: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action: PayloadAction<Partial<PostState>>) => {
      return { ...state, ...action.payload };
    },
    resetPost: () => initialState,
  },
});

export const { setPost, resetPost } = postSlice.actions;
export default postSlice.reducer;
