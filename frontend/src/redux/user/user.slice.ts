import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: '',
    user: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers : {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload // Change this later to secure token
        },

    }
})

export const { setUser, setToken } = userSlice.actions
export default userSlice.reducer;