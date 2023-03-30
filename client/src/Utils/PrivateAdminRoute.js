import { useEffect, useState } from "react";
import decode from 'jwt-decode'
import {Navigate, Outlet} from 'react-router-dom'
import { useDispatch,useSelector } from "react-redux";
import { checkLoggedIn } from "../state";

const PrivateAdminRoute = ({element:Component,...rest})=>{
    const user = useSelector(state=>state.auth.user)
    const [auth,setAuth] = useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(checkLoggedIn())
    },[])

    useEffect(()=>{
        const token = localStorage.getItem('authToken')
        const decodedToken = decode(token)  
        if(decodedToken.exp*1000< new Date().getTime() && decodedToken.role==="admin"){
            setAuth(true)
        }
    },[])

    return (
        <>
        {auth?<Outlet/>:<Navigate to="/login"/>}
        </>
    )
}

export default PrivateAdminRoute