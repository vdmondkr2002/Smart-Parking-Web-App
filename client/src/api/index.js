import axios from 'axios';

const API = axios.create({baseURL:"http://localhost:5000/"})

API.interceptors.request.use((req)=>{
    if(localStorage.getItem('authToken')){

        req.headers.Authorization = `Bearer ${
            JSON.parse(localStorage.getItem('authToken'))
        }`
        console.log(req.headers.Authorization)
    }
    return req;
})

const urlUser = '/api/v1/users'

export const signUp = ()=>API.post(`${urlUser}/signUp`);

export const sendOTP = (formData)=>API.post(`${urlUser}/sendOTP`,formData)

export const verifyEmail = (formData)=>API.post(`${urlUser}/verifyEmail`,formData)

export const signIn = (formData)=>API.post(`${urlUser}/signIn`,formData)

export const getCurrentUser = ()=>API.get(`${urlUser}`)