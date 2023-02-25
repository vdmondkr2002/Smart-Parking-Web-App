import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {signUp,sendOTP,verifyEmail, signIn, getCurrentUser} from '../api/index.js'
import decode from 'jwt-decode'

const initialStore = {
    user: {},
    alert: {},
    
}

export const asyncsignUp = createAsyncThunk('users/signUp',async()=>{
    const {data} = await signUp();
    console.log(data)
    
    return data;
})

export const asyncsendOTP = createAsyncThunk('users/sendOTP',async(formData)=>{
    console.log(formData)
    try{
        const {data} = await sendOTP(formData);
        console.log(data)
        return {...data,type:'success'};
    }catch(err){
        if(err.response){
            const data = err.response.data
            console.log(data)
            return {...data,type:"error"};
        }else{
            console.log(err);
        }
    }
    
    
})

export const asyncverifyEmail = createAsyncThunk('users/verifyEmail',async(formData)=>{
    console.log(formData)
    try{
        const {data} = await verifyEmail(formData);
        console.log(data)
        return {...data,type:'success'}
    }catch(err){
        if(err.response){
            const data = err.response.data
            console.log(data)
            return {...data,type:"error"};
        }else{
            console.log("Error",err);
        }
    }
})


export const asyncsignIn = createAsyncThunk('users/signIn',async(formData)=>{
    console.log(formData)
    try{
        const {data} = await signIn(formData);
        console.log(data)
        localStorage.setItem('authToken',JSON.stringify(data))
        const response = await getCurrentUser()
        const userData = response.data;
        return {alertData:{msg:"Logged In Successfully",type:"success"},userData:userData}
    }catch(err){
        if(err.response){
            const data = err.response.data
            console.log(data)
            return {alertData:{...data,type:"error"},userData:{}}
        }else{
            console.log("Error",err)
        }
    }
})

export const asyncloadUser = createAsyncThunk('users/loadUser',async()=>{
    console.log("loading user")
    try{
        if(localStorage.getItem('authToken')){
            console.log("user found")
            const token = localStorage.getItem('authToken')
            const decodedToken = decode(token);
            if(decodedToken.exp*1000<new Date().getTime()){
                return {msg:"LogOut"};
            }else{
                const {data} = await getCurrentUser()
                console.log(data)
                return data;
            }
        }
    }catch(err){
        console.log(err)
    }
})

const authSlice = createSlice({
    name:"auth",
    initialState:initialStore,
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload;
        },
        setLogout:(state)=>{
            localStorage.removeItem('authToken')
            state.user = {};
        },
        clearAlert:(state)=>{
            console.log("i am called")
            state.alert = {}
        }
    },
    extraReducers(builder){
        builder.addCase(asyncsignUp.fulfilled,(state,action)=>{
            state.alert = action.payload
            console.log("In extra reducer")
        }).addCase(asyncsendOTP.fulfilled,(state,action)=>{
            state.alert = action.payload
            console.log("In otp reducer")
        }).addCase(asyncverifyEmail.fulfilled,(state,action)=>{
            state.alert = action.payload
            console.log("In verifyotp reducer")
        }).addCase(asyncsignIn.fulfilled,(state,action)=>{
            state.alert = action.payload.alertData
            state.user = action.payload.userData
            console.log("In signIn reducer")
        }).addCase(asyncloadUser.fulfilled,(state,action)=>{
            if(action.payload.msg){
                localStorage.removeItem('authToken')
                state.user = {};
            }else{
                state.user = action.payload
            }
            console.log("In loaduser reducer")
        })

    }
})

export const {setUser,setLogout,clearAlert} = authSlice.actions
export default authSlice.reducer;