import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface Image {
  imgSrc: string;
  imgFile: string | null;
}

interface Role {
  label: string;
  value: string;
}

interface PostState {
  postName: string;
  description: string;
  mediaType: "media" | "short" | "drama" | "ads";
  roles: Role[];
  images: Image[];
}

const initialState: PostState = {
  postName: "",
  description: "",
  mediaType: "media",
  roles: [],
  images: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPostName: (state, action: PayloadAction<string>) => {
      console.log("Updating postName:", action.payload); 
      state.postName = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setMediaType: (state, action: PayloadAction<PostState["mediaType"]>) => {
      state.mediaType = action.payload;
    },
    setRoles: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
    resetPost(state) {
      return initialState;
    },
    setInitialState: (state, action: PayloadAction<PostState>) => {
      return action.payload;
    },
    setImages(state, action: PayloadAction<Image[]>) {
      state.images = action.payload;
    },
  },
});

const persistConfig = {
  key: "editPost",  // ต้องใช้ key ที่ไม่ซ้ำกับ root
  storage,
  whitelist: ["postName", "description", "mediaType", "roles", "images"], // ระบุเฉพาะ key ที่ต้องการ persist
};

export const { setPostName, setDescription, setMediaType, setRoles, resetPost, setInitialState, setImages  } =
  postSlice.actions;

  export default persistReducer(persistConfig, postSlice.reducer);
