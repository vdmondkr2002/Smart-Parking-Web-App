import { Container, Grow } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAlert } from "../../state";

const PaymentFailure = ()=>{
    const [params] = useSearchParams()
    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(()=>{
        if (params.type) {
        if(params.type==="book")
            dispatch(setAlert({msg:"Booking failed,try again"}))
        else
            dispatch(setAlert({msg:"Refund failed,try again"}))
        }
    },[])

    useEffect(()=>{
        if(params.type){
        if(params.type==="book")
            navigate("/home")
        else
            navigate("/admindb")
        }
    },[])

    return (
        <Grow in>
            <Container sx={{marginTop:"5em"}}>
                Payment Failure
            </Container>
        </Grow>
    )

}

export default PaymentFailure