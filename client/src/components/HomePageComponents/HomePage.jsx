import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Alert from '../../Utils/Alert'


const HomePage = ()=>{
    const user = useSelector(state=>state.auth.user)
    const navigate = useNavigate()
    useEffect(()=>{
        if(!user._id){
            navigate("/login")
        }else{
            if(user.role==="admin"){
                navigate("/admindb")
            }
        }
    },[user])
    return (
        <div>
            <Alert/>
        </div>
    )
}

export default HomePage;