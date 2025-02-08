import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface Role {
  label: string;
  value: string;
  disable?: boolean;
}

interface PostState {
  postName: string;
  description: string;
  mediaType: "media" | "short" | "drama" | "ads";
  roles: Role[];
}

const initialState: PostState = {
  postName: "",
  description: "",
  mediaType: "media",
  roles: [],
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
  },
});

const persistConfig = {
  key: "editPost",  // ต้องใช้ key ที่ไม่ซ้ำกับ root
  storage,
  whitelist: ["postName", "description", "mediaType", "roles"], // ระบุเฉพาะ key ที่ต้องการ persist
};

export const { setPostName, setDescription, setMediaType, setRoles, resetPost, setInitialState  } =
  postSlice.actions;

  export default persistReducer(persistConfig, postSlice.reducer);
