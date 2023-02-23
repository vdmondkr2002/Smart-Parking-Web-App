import { createSlice } from "@reduxjs/toolkit";

const initialStore = {
    user: {name:"Viraj",age:20}
}
const authSlice = createSlice({
    name:"auth",
    initialState:initialStore,
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload;
        },
        setLogout:(state)=>{
            state.user = null;
        }
    },
    
})

export const {setUser,setLogout} = authSlice.actions
export default authSlice.reducer;