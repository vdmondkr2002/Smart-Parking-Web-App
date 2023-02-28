import CropSquare from "@mui/icons-material/CropSquare";
import SquareIcon from "@mui/icons-material/Square";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

const ParkingSlot = ({prevChanged,setPrevChanged,changed,booked,id,setChanged})=>{
    const [slotBooked,setSlotBooked] = useState(booked)
    useEffect(()=>{
        if(id==prevChanged){
            setSlotBooked(false)
        }
        if(id==changed){
            setSlotBooked(true)
        }
    },[changed])
    const handleClick = ()=>{
        console.log(id)
        if(changed!=''){
            setPrevChanged(changed)
            setChanged(id)
        }else{
            setChanged(id)
        }
    }
    return (
        <Button onClick={handleClick}>
            {
                slotBooked?(
                    <SquareIcon fontSize="large"/>
                ):<CropSquare fontSize="large"/>
            }
        </Button>
        
    )
}

export default ParkingSlot;