import axios from 'axios';

const API = axios.create({baseURL:"http://localhost:5000/"})

API.interceptors.request.use((req)=>{
    if(localStorage.getItem('authToken')){

        req.headers.Authorization = `Bearer ${
            JSON.parse(localStorage.getItem('authToken'))
        }`
    }
    return req;
})

const urlUser = '/api/v1/users'

export const signUp = ()=>API.post(`${urlUser}/signUp`);

export const sendOTP = (formData)=>API.post(`${urlUser}/sendOTP`,formData)

export const verifyEmail = (formData)=>API.post(`${urlUser}/verifyEmail`,formData)

export const signIn = (formData)=>API.post(`${urlUser}/signIn`,formData)

export const getCurrentUser = ()=>API.get(`${urlUser}`)

export const postFeedback = (formData)=>API.post(`${urlUser}/feedback`,formData)

const urlParkingLot = '/api/v1/parkingLots'

export const postParkingLot = (formData)=>API.post(`${urlParkingLot}`,formData)

export const getFreeParkingLots = (formData)=>API.get(`${urlParkingLot}`,{
    params:formData
})

export const bookSlot = (formData)=>API.post(`${urlParkingLot}/book`,formData)

export const getBookedSlots = ()=>API.get(`${urlParkingLot}/bookedSlots`)

const urlAdmin = '/api/v1/admin'

export const getUsersName = ()=>API.get(`${urlAdmin}/users`)

export const getUserHistory = (formData)=>API.get(`${urlAdmin}/userHistory`,{params:formData})

export const getParkingLotsNear = (formData)=>API.get(`${urlAdmin}/parkingLotsNear`,{params:formData})

export const getParkingLots = ()=>API.get(`${urlAdmin}/parkingLots`)

export const getParkingLotHistory = (formData)=>API.get(`${urlAdmin}/parkingLotHistory`,{params:formData})
