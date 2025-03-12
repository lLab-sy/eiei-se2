import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {},
    profileImageURL : "/",
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers : {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setProfileImageURL: (state, action) => {
            state.profileImageURL = action.payload
        },
        clearStorage: (state, action) => {
            state.user = {}
            state.profileImageURL = "/"
        }
    }
})

export const { setUser, setProfileImageURL, clearStorage } = userSlice.actions
export default userSlice.reducer;