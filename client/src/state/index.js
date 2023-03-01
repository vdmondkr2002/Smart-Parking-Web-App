import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {signUp,sendOTP,verifyEmail, signIn, getCurrentUser,postParkingLot, getFreeParkingLots, bookSlot, getBookedSlots} from '../api/index.js'
import decode from 'jwt-decode'

const initialStore = {
    user: {},
    alert: {},
    freeParkingLots: [],
    bookedTimeSlots: []
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

export const asyncpostParkingLot = createAsyncThunk('parkings/postParkingLot',async(formData)=>{
    console.log("posting parking lot")
    try{
        const {data} = await postParkingLot(formData);
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

export const asyncgetParkingLot = createAsyncThunk('parkings/getParkingLot',async(formData)=>{
    console.log("Get Parking Lot")
    console.log(formData)
    try{
        const {data} = await getFreeParkingLots(formData);
        
        return {alertData:{msg:data.msg,type:'success'},freeParkingLots:data.freeParkingLots}
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

export const asyncBookSlot = createAsyncThunk('parkings/bookSlot',async(formData)=>{
    console.log("Book parking slot")
    console.log(formData)
    try{
        const {data} = await bookSlot(formData);
        console.log(data)
        return {msg:data.msg,type:'success'}
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

export const asyncgetBookedSlots = createAsyncThunk('parkings/getBookedSlots',async()=>{
    console.log("Get Booked Slots")
    try{
        const {data} = await getBookedSlots();
        return {alertData:{msg:data.msg,type:'success'},bookedTimeSlots:data.bookedTimeSlots}
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
            state.bookedTimeSlots = {}
            state.freeParkingLots = {}
        },
        clearAlert:(state)=>{
            state.alert = {}
        },
        clearFreeParkingLots:(state)=>{
            state.freeParkingLots = []
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
            if(action.payload){
                if(action.payload.msg){
                    localStorage.removeItem('authToken')
                    state.user = {};
                }else{
                    state.user = action.payload
                }
                console.log("In loaduser reducer")
            }
           
        }).addCase(asyncpostParkingLot.fulfilled,(state,action)=>{
            state.alert=action.payload
            console.log("In postParking reducer")
        }).addCase(asyncgetParkingLot.fulfilled,(state,action)=>{
            if(action.payload){
                if(action.payload.msg){
                   state.alert = action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.freeParkingLots = action.payload.freeParkingLots
                }
            }
            
            console.log("In postParking reducer")
        }).addCase(asyncBookSlot.fulfilled,(state,action)=>{
            state.alert = action.payload
            console.log("In bookslot reducer")
        }).addCase(asyncgetBookedSlots.fulfilled,(state,action)=>{
            if(action.payload){
                if(action.payload.msg){
                    state.alert=action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.bookedTimeSlots = action.payload.bookedTimeSlots
                }
            }
        })

    }
})

export const {setUser,setLogout,clearAlert,clearFreeParkingLots} = authSlice.actions
export default authSlice.reducer;