import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: {},
    profileImageURL : "",
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
        }
    }
})

export const { setUser, setProfileImageURL } = userSlice.actions
export default userSlice.reducer;