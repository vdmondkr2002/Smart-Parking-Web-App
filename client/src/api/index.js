import axios from 'axios';

const API = axios.create({baseURL:"http://localhost:5000/"})

const urlUser = '/api/v1/users'

export const signUp = ()=>API.post(`${urlUser}/signUp`);

export const sendOTP = (formData)=>API.post(`${urlUser}/sendOTP`,formData)