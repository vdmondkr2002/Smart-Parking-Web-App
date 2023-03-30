import { useEffect, useState } from "react";
import {Navigate, Outlet} from 'react-router-dom'
import decode from 'jwt-decode'
import { useDispatch,useSelector } from "react-redux";
import { checkLoggedIn } from "../state";

const PrivateUserRoute = ({element:Component,...rest})=>{
    const user = useSelector(state=>state.auth.user)
    const [auth,setAuth] = useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(checkLoggedIn())
    },[])

    useEffect(()=>{
        const token = localStorage.getItem('authToken')
        if(token){
            const decodedToken = decode(token)  
            if(decodedToken.exp*1000< new Date().getTime() && decodedToken.role==="user"){
                setAuth(true)
            }
        }
        
    },[])

    return (
        <>
        {(auth||user._id)?<Outlet/>:<Navigate to="/login"/>}
        </>
    )
}

export default PrivateUserRoute