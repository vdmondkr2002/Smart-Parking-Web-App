import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {signUp,sendOTP,verifyEmail, signIn, getCurrentUser,postParkingLot, getFreeParkingLots, bookSlot, getBookedSlots, postFeedback, getUsersName, getUserHistory, getParkingLots, getParkingLotsNear, getParkingLotHistory, setProfilePic, cancelBookedSlot, deleteParkingLot, makeActiveParkingLot, getCancelledSlots,sendResetEmail, resetPassword, resendOTP, getRazorPayKey, checkoutRefund, checkoutBookSlot, getNews} from '../api/index.js'
import decode from 'jwt-decode'
import dayjs from 'dayjs'

const initialStore = {
    user: {},
    alert: {},
    freeParkingLots: [],
    bookedTimeSlots: [],
    usersName: [],
    parkingLotNames:[],
    parkingLotDetails:{},
    paymentOrder:{},
    inProgress1:false,
    inProgress2:false,
    news:[],

}

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

export const asyncresendOtp = createAsyncThunk('users/resendOtp',async(formData)=>{
    console.log(formData)
    try{
        const {data} = await resendOTP(formData);
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
    
    console.log("Get Booked Slots")
    console.log(formData)
    try{
        const {data} = await getFreeParkingLots(formData);
        console.log(formData)
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




export const asyncpostFeedback = createAsyncThunk('users/postFeedback',async(formData)=>{
    console.log("Post feedback form")
    try{
        const {data} = await postFeedback(formData);
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


export const asyncCancelParkingSlot = createAsyncThunk('parkings/cancelParkingSlot',async(formData)=>{
    try{
        console.log(formData)
        const {data} = await cancelBookedSlot(formData);
        return {alertData:{msg:data.msg,type:'success'},id:formData.id}
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

export const asyncgetUsersName = createAsyncThunk('admin/getUsersName',async()=>{
    try{
        const {data} = await getUsersName();
        return {alertData:{msg:data.msg,type:'success'},usersName:data.usersName}
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

export const asyncgetUserHistory = createAsyncThunk('admin/getUserHistory',async(formData)=>{
    try{
        const {data} = await getUserHistory(formData)
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

export const asyncgetParkingLots = createAsyncThunk('admin/getparkingLots',async()=>{
    try{
        console.log("getting parking lots")
        const {data} = await getParkingLots();
        return {alertData:{msg:data.msg,type:'success'},parkingLots:data.parkingLots}
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

export const asyncgetParkingLotsNear = createAsyncThunk('admin/getparkingLotsNear',async(formData)=>{
    try{
        const {data} = await getParkingLotsNear(formData);
        return {alertData:{msg:data.msg,type:'success'},parkingLots:data.parkingLots}
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

export const asyncgetParkingLotHistory = createAsyncThunk('admin/getParkingLotHistory',async(formData)=>{
    try{
        const {data} = await getParkingLotHistory(formData);
        console.log(data)
        return {alertData:{msg:data.msg,type:'success'},bookedTimeSlots:data.bookedTimeSlots,parkingLotDetails:data.parkingLotDetails}
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

export const asyncDeleteParkingLot = createAsyncThunk('admin/removeParkingLot',async(formData)=>{
    try{
        const {data} = await deleteParkingLot(formData);
        console.log(data)
        return {alertData:{msg:data.msg,type:'success'},id:formData}
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

export const asyncMakeActiveLot = createAsyncThunk('admin/makeActiveLot',async(formData)=>{
    try{
        const {data} = await makeActiveParkingLot(formData);
        console.log(data)
        return {alertData:{msg:data.msg,type:'success'},id:formData}
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

export const asyncgetCancelledSlots = createAsyncThunk('admin/cancelledSlots',async()=>{
    try{
        const {data} = await getCancelledSlots();
        console.log(data)
        return {alertData:{msg:data.msg,type:'success'},cancelledSlots:data.cancelledSlots}
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

export const asyncsetProfilePic = createAsyncThunk('users/profilePic',async(formData)=>{
    try{
        const {data} = await setProfilePic(formData);
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



export const asyncSendResetEmail = createAsyncThunk('users/resetEmail',async(formData)=>{
    try{
        const {data} = await sendResetEmail(formData)
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

export const asyncresetPassword = createAsyncThunk('users/resetPassword',async(formData)=>{
    try{
        const {data} = await resetPassword(formData)
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


export const asynccheckOutBookSlot = createAsyncThunk('payments/checkoutBookSlot',async(formData,userData)=>{
    try{
        
        const {data} = await checkoutBookSlot(formData)
        console.log(data)
        const {data:{key}} = await getRazorPayKey()
        const {order} = data
        const options = {
            key: key, // Enter the Key ID generated from the Dashboard
            amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "Smart Parker",
            description: `Payment To Book Parking Lot At ${userData.lotName}`,
            image: "https://lh3.googleusercontent.com/N8LxEaBwVEQ_B31XdQL1_NZ-4QbGK2Jhpvp1i_wJ3HFJASijQtU6BPnGGmSNwF9K_j9lExWOvnT4L96PNH0Vaq4lJM5Qga0_ukTl8g",
            order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            // callback_url: `${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/v1/payments/verifyBookingPayment`,
            callback_url: `${process.env.REACT_APP_BACKEND_URL}/api/v1/payments/verifyBookingPayment`,
            prefill: {
                "name": userData.name,
                "email": userData.email,
                "contact": '9292929292'
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#a272d0"
            }
        };
        const razor = new window.Razorpay(options)
        razor.open()
        
        return {alertData:{msg:data.msg,type:'success'},order:order}
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

export const asynccheckoutRefund = createAsyncThunk('payments/checkoutRefund',async(formData)=>{
    try{
        console.log(formData)
        const {data} = await checkoutRefund({amount:formData.amount})
        const {data:{key}} = await getRazorPayKey()
        const {order} = data
        console.log(data)
        const options = {
            key: key, // Enter the Key ID generated from the Dashboard
            amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "Smart Parker",
            description: `Payment for refund to ${formData.bookerName} for booking of a ${formData.vehicleType} at ${formData.name} between ${dayjs(formData.startTime)} and ${dayjs(formData.endTime)} `,
            image: "https://lh3.googleusercontent.com/N8LxEaBwVEQ_B31XdQL1_NZ-4QbGK2Jhpvp1i_wJ3HFJASijQtU6BPnGGmSNwF9K_j9lExWOvnT4L96PNH0Vaq4lJM5Qga0_ukTl8g",
            order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            callback_url: `${process.env.REACT_APP_BACKEND_URL}/api/v1/payments/verifyRefundPayment?slotID=${formData.id}`,
            prefill: {
                "name": 'Smart Parker',
                "email": 'smartparking678@gmail.com',
                "contact": '9292929292'
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#a272d0"
            }
        };
        const razor = new window.Razorpay(options)
        razor.open()
        return {alertData:{msg:data.msg,type:'success'},order:order}
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

export const asyncgetNews = createAsyncThunk('news/getNews',async()=>{
    try{
        const {data} = await getNews()
        console.log(data)
        return {alertData:{msg:data.msg,type:'success'},news:data.news}
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
            state.bookedTimeSlots = []
            state.freeParkingLots = []
            state.usersName = []
            state.parkingLotNames = []
            state.parkingLotDetails = {}
        },
        clearAlert:(state)=>{
            state.alert = {}
        },
        setAlert:(state,action)=>{
            state.alert = action.payload
        },
        clearFreeParkingLots:(state)=>{
            state.freeParkingLots = []
        },
        clearBookedTimeSlots:(state)=>{
            state.bookedTimeSlots = []
        },
        clearParkingLotDetails:(state)=>{
            state.parkingLotDetails = {}
        },
        setUserProfilePic:(state,action)=>{
            state.user = {...state.user,profilePic:action.payload}
        },
        setInProgress2:(state,action)=>{
            state.inProgress2 = action.payload
        }
    },
    extraReducers(builder){
        builder.addCase(asyncsendOTP.pending,(state,action)=>{
            state.inProgress1 = true
            state.alert = {msg:"Processing...",type:"info"}
        }).addCase(asyncsendOTP.fulfilled,(state,action)=>{
            state.alert = action.payload
            state.inProgress1 = false
            console.log("In otp reducer")
        }).addCase(asyncresendOtp.pending,(state,action)=>{
            state.inProgress1 = true
            state.alert = {msg:"Processing...",type:"info"}
        }).addCase(asyncresendOtp.fulfilled,(state,action)=>{
            state.alert = action.payload
            state.inProgress1 = false
            console.log("In resend otp reducer")
        }).addCase(asyncverifyEmail.pending,(state,action)=>{
            state.alert = {msg:"Processing...",type:"info"}
            state.inProgress1 = true
        }).addCase(asyncverifyEmail.fulfilled,(state,action)=>{
            state.alert = action.payload
            state.inProgress1 = false
            console.log("In verifyotp reducer")
        }).addCase(asyncsignIn.pending,(state,action)=>{
            state.alert = {msg:"Processing",type:"info"}
            state.inProgress1 = true
        }). addCase(asyncsignIn.fulfilled,(state,action)=>{
            console.log(action.payload)
            if(action.payload){
                if(action.payload.msg){
                   state.alert = action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.user = action.payload.userData
                }
                state.inProgress1 = false
            }
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
           
        })
        .addCase(asyncpostParkingLot.pending,(state)=>{
            state.inProgress1=true;
            state.alert = {msg:"Submitting Details",type:"info"}
        }).addCase(asyncpostParkingLot.fulfilled,(state,action)=>{
            state.alert=action.payload
            state.inProgress1=false
            console.log("In postParking reducer")
        }).addCase(asyncgetParkingLot.pending,(state)=>{
            state.inProgress1=true
        }). addCase(asyncgetParkingLot.fulfilled,(state,action)=>{
            console.log(action.payload)
            if(action.payload){
                if(action.payload.msg){
                   state.alert = action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.freeParkingLots = action.payload.freeParkingLots
                }
                state.inProgress1=false
            }
            
            console.log("In get free Parking reducer")
        }).addCase(asyncgetBookedSlots.pending,(state,action)=>{
            state.inProgress1 = true
        })
        .addCase(asyncgetBookedSlots.fulfilled,(state,action)=>{
            if(action.payload){
                if(action.payload.msg){
                    
                    state.alert=action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.bookedTimeSlots = action.payload.bookedTimeSlots
                }
                state.inProgress1=false
            }
        }).addCase(asyncpostFeedback.fulfilled,(state,action)=>{
            state.alert = action.payload
            console.log("in feedback reducer")
        }).addCase(asyncgetUsersName.fulfilled,(state,action)=>{
            
            if(action.payload){
                if(action.payload.msg){
                    state.alert=action.payload
                }else{
                    state.alert = action.payload.alertData;
                    state.usersName = action.payload.usersName;
                }
            }
        }).addCase(asyncgetUserHistory.pending,(state,action)=>{
            state.inProgress1 = true
        }).addCase(asyncgetUserHistory.fulfilled,(state,action)=>{
            if(action.payload){
                if(action.payload.msg){
                    state.alert=action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.bookedTimeSlots = action.payload.bookedTimeSlots
                }
                state.inProgress1 = false
            }
        }).addCase(asyncgetParkingLots.fulfilled,(state,action)=>{
            if(action.payload){
                if(action.payload.msg){
                    state.alert=action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.parkingLotNames = action.payload.parkingLots
                }
            }
        }).addCase(asyncgetParkingLotsNear.fulfilled,(state,action)=>{
            if(action.payload){
                if(action.payload.msg){
                    state.alert=action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.parkingLotNames = action.payload.parkingLots
                }
            }
        }).addCase(asyncgetParkingLotHistory.pending,(state)=>{
            state.inProgress1 = true
        }).addCase(asyncgetParkingLotHistory.fulfilled,(state,action)=>{
            console.log("Parking lot history reducer")
            if(action.payload){
                if(action.payload.msg){
                    console.log("Here2")
                    state.alert=action.payload

                }else{
                    console.log("Here")
                    state.alert = action.payload.alertData;
                    state.bookedTimeSlots = action.payload.bookedTimeSlots;
                    state.parkingLotDetails = action.payload.parkingLotDetails;
                }
                state.inProgress1 = false
            }
        }).addCase(asyncsetProfilePic.pending,(state)=>{
            state.alert = {msg:"Uploading photo..",type:'info'}
            state.inProgress2 = true
        }).addCase(asyncsetProfilePic.fulfilled,(state,action)=>{
            state.alert = action.payload
            state.inProgress2 = false
            console.log("In set profilepic reducer")
        }).addCase(asyncCancelParkingSlot.pending,(state)=>{
            state.alert = {msg:"Cancelling Slot..",type:"info"}
            state.inProgress2 = true
        }).
        addCase(asyncCancelParkingSlot.fulfilled,(state,action)=>{
            if(action.payload){
                if(action.payload.msg){
                    state.alert=action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.bookedTimeSlots = state.bookedTimeSlots.map(slot=>slot._id!==action.payload.id?slot:{...slot,cancelled:true})
                }
                state.inProgress2 = false
            }
            console.log("In cancel booked slot reducer")
        }).addCase(asyncDeleteParkingLot.pending,(state)=>{
            state.inProgress2 = true
        })
        .addCase(asyncDeleteParkingLot.fulfilled,(state,action)=>{
            if(action.payload){
                if(action.payload.msg){
                    state.alert=action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.bookedTimeSlots = state.bookedTimeSlots.map(slot=>slot.parkingLot!==action.payload.id?slot:{...slot,cancelled:true,adminCancelled:true})
                    state.parkingLotDetails = {...state.parkingLotDetails,isActive:false}
                    state.parkingLotNames = state.parkingLotNames.map(lot=>lot._id!==action.payload.id?lot:{...lot,isActive:false})
                }
                state.inProgress2 = false
            }
            
            console.log("delete parking lot reducer")
        }).addCase(asyncMakeActiveLot.pending,(state)=>{
            state.inProgress2 =true
        }).addCase(asyncMakeActiveLot.fulfilled,(state,action)=>{
            if(action.payload){
                if(action.payload.msg){
                    state.alert=action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.parkingLotDetails = {...state.parkingLotDetails,isActive:true}
                    state.parkingLotNames = state.parkingLotNames.map(lot=>lot._id!==action.payload.id?lot:{...lot,isActive:true})
                }
                state.inProgress2=false
            }
            console.log("Make Active Parking Lot Reducer")
        }).addCase(asyncgetCancelledSlots.pending,(state,action)=>{
            state.inProgress1 = true
        }).addCase(asyncgetCancelledSlots.fulfilled,(state,action)=>{
            if(action.payload){
                if(action.payload.msg){
                    state.alert=action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.bookedTimeSlots = action.payload.cancelledSlots
                }
                state.inProgress1 = false
            }
            console.log("Cancelled slots reducer")
        }).addCase(asyncSendResetEmail.pending,(state)=>{
            state.inProgress2 = true
            state.alert = {msg:"Processing...",type:'info'}
        }). addCase(asyncSendResetEmail.fulfilled,(state,action)=>{
            state.alert = action.payload
            state.inProgress2 = false
            console.log("Reset Email reducer")
        }).addCase(asyncresetPassword.pending,(state)=>{
            state.alert = {msg:"Resetting Password...",type:"info"}
            state.inProgress1 = true
        }) .addCase(asyncresetPassword.fulfilled,(state,action)=>{
            state.alert = action.payload
            state.inProgress1 = false
            console.log("Reset password reducer")
        }).addCase(asynccheckOutBookSlot.pending,(state,action)=>{
            state.inProgress2 = true
        }).addCase(asynccheckOutBookSlot.fulfilled,(state,action)=>{
            if(action.payload){
                if(action.payload.msg){
                    state.alert=action.payload
                }else{
                    // state.alert = action.payload.alertData
                    state.paymentOrder = action.payload.order
                }
                state.inProgress2 = false
            }
            console.log("checkout book slot reducer")
        }).addCase(asynccheckoutRefund.fulfilled,(state,action)=>{
            if(action.payload){
                if(action.payload.msg){
                    state.alert=action.payload
                }else{
                    state.alert = action.payload.alertData
                    // state.paymentOrder = action.payload.order
                }
            }
            console.log("checkout refund reducer")
        }).addCase(asyncgetNews.fulfilled,(state,action)=>{
            if(action.payload){
                if(!action.payload.news){
                    state.alert=action.payload
                }else{
                    state.alert = action.payload.alertData
                    state.news = action.payload.news
                }
            }
        })

    }
})



export const {setUser,setLogout,clearAlert,clearFreeParkingLots,clearBookedTimeSlots,clearParkingLotDetails,setAlert,setUserProfilePic,setInProgress2} = authSlice.actions
export default authSlice.reducer;