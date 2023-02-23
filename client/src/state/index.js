import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {signUp,sendOTP} from '../api/index.js'

const initialStore = {
    user: {name:"Viraj",age:20},
    alert: {},
    
}

export const asyncsignUp = createAsyncThunk('users/signUp',async()=>{
    const {data} = await signUp();
    console.log(data)
    
    return data;
})

export const asyncsendOTP = createAsyncThunk('users/sendOTP',async(formData)=>{
    console.log(formData)
    const {data} = await sendOTP(formData);
    console.log(data)
    return data;
})

const authSlice = createSlice({
    name:"auth",
    initialState:initialStore,
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload;
        },
        setLogout:(state)=>{
            state.user = null;
        },
        clearAlert:(state)=>{
            state.alert = {}
        }
    },
    extraReducers(builder){
        builder.addCase(asyncsignUp.fulfilled,(state,action)=>{
            state.alert = action.payload
            console.log("In extra reducer")
        }).addCase(asyncsendOTP.fulfilled,(state,action)=>{
            state.alert = {...action.payload,type:"success"}
            console.log("In otp reducer")
        })

    }
})

export const {setUser,setLogout,clearAlert} = authSlice.actions
export default authSlice.reducer;