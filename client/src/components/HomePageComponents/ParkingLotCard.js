import { Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogTitle, Grid, Typography } from "@mui/material";
import PaidIcon from '@mui/icons-material/Paid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useEffect, useState } from "react";
import CropSquareIcon from '@mui/icons-material/CropSquare';
import SquareIcon from '@mui/icons-material/Square';
import ParkingSlot from "./ParkingSlot";
import { asyncBookSlot } from "../../state";
import { useDispatch } from "react-redux";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ParkingLotCard = ({ vehicleType,startTime,endTime,name, noOfFreeSlots, charges, distance, id, freeSlots, engagedSlots, address, lat, lng }) => {
    const styles = {
        dialog:{
            padding:"2em"
        }
    }
    const [open, setOpen] = useState(false)
    const [parkingSlots,setParkingSlots] = useState([...freeSlots,...engagedSlots])
    const [engagedSllots,setEngagedSllots] = useState(engagedSlots)
    const [changed,setChanged] = useState('')
    const [prevChanged,setPrevChanged] = useState('')
    const dispatch = useDispatch()
    useEffect(()=>{
        setParkingSlots([...freeSlots,...engagedSlots])
        setParkingSlots(parkingSlots.sort())
        console.log(freeSlots)
    },[open])




    const handleShowDetails = () => {
        console.log("clicked")
        console.log(id, freeSlots, engagedSlots, address, lat, lng)

        console.log(parkingSlots)
        setOpen(true)
    }

    const handleClose = () => {
        console.log("dialog closed")
        setChanged('')
        setOpen(false)
    }

    const handleBookSlot = ()=>{
        console.log(changed,id,startTime,endTime,vehicleType)
        const data = {startTime:startTime.format('YYYY-MM-DD HH:00'), endTime: endTime.format('YYYY-MM-DD HH:00'), lotId:id,slotId:changed,vehicleType:vehicleType}
        console.log(data)
        dispatch(asyncBookSlot(data))
    }

    return (
        <>
            <Card sx={{ maxWidth: 300, minHeight: 300 }}>
                <CardContent >
                    <Grid container spacing={2} alignItems="center" justifyContent="end">
                        <Grid item xs={2}>
                            <LocationOnIcon fontSize="large" />
                        </Grid>
                        <Grid item xs={10}>
                            <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                                {name}
                            </Typography>
                        </Grid>
                        <Grid item xs={8} sx={{ fontWeight: "bold" }}>
                            Total Charges:
                        </Grid>
                        <Grid item xs={4}>
                            {charges}
                        </Grid>
                        <Grid item xs={8} sx={{ fontWeight: "bold" }}>
                            Free Slots:
                        </Grid>
                        <Grid item xs={4}>
                            {noOfFreeSlots}
                        </Grid>
                        <Grid item xs={8} sx={{ fontWeight: "bold" }}>
                            Distance:
                        </Grid>
                        <Grid item xs={4}>
                            {distance} m
                        </Grid>
                    </Grid>

                    {/* <Typography variant="h5">
                    <PaidIcon />
                     {charges}
                </Typography>

                <Typography variant="h5">
                    : {noOfFreeBikeSlots}
                </Typography>
                <Typography variant="h5">
                    Distance: {distance}
                </Typography> */}
                </CardContent>
                <CardActions>
                    <Button variant="contained" onClick={handleShowDetails} fullWidth>Show Details</Button>
                </CardActions>
            </Card>
            <Dialog onClose={handleClose} open={open} sx={styles.dialog}>

                <Grid sx={styles.dialog} container spacing={2} alignItems="center" >
                    <Grid item xs={2}>
                        <LocationOnIcon fontSize="large" />
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant="h4" component="div" fontWeight="bold" gutterBottom>
                            {name}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ fontWeight: "bold" }}>
                        Time Slot For Booking:
                    </Grid>
                    <Grid item xs={8}>
                        <Grid container>
                            <Grid item xs={2}>
                                <AccessTimeIcon fontSize="large"/> 
                            </Grid>
                            <Grid item xs={10}>
                                <Typography variant="h6">
                                    {startTime.format('DD MMM hh:00 A')} - {endTime.format('DD MMM hh:00 A')}
                                </Typography>
                                
                            </Grid>
                        </Grid>
                        
                    </Grid>
                    <Grid item xs={8} sm={4} sx={{ fontWeight: "bold" }}>
                        Total Charges:
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        {charges}
                    </Grid>
                    <Grid item xs={8} sm={4} sx={{ fontWeight: "bold" }}>
                        Free Slots:
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        {noOfFreeSlots}
                    </Grid>
                    <Grid item xs={8} sm={4} sx={{ fontWeight: "bold" }}>
                        Distance:
                    </Grid>
                    <Grid item xs={4} sm={2}>
                        {distance} m
                    </Grid>
                    <Grid item xs={6}>

                    </Grid>
                    {
                        [...freeSlots,...engagedSlots].sort().map((slot)=>(
                            <Grid item xs={2}>
                                
                                    {engagedSllots.includes(slot)?<ParkingSlot prevChanged={prevChanged} setPrevChanged={setPrevChanged} setChanged={setChanged}  changed={changed} id={slot} booked={true}/>:<ParkingSlot prevChanged={prevChanged} setPrevChanged={setPrevChanged}  setChanged={setChanged} changed={changed} id={slot} booked={false}/>}
                                
                            </Grid>
                        ))
                    }
                    <Grid item xs={12}>
                        <Button fullWidth onClick={handleBookSlot} variant="contained">Book Slot</Button>
                    </Grid>
                </Grid>
            </Dialog>
        </>
    )
}

export default ParkingLotCard;