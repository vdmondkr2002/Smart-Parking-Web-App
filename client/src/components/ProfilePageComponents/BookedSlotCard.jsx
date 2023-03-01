import AccessTime from "@mui/icons-material/AccessTime"
import LocationOn from "@mui/icons-material/LocationOn"
import { Button, Card, CardActions, CardContent, Grid, Typography } from "@mui/material"

const BookedSlotCard = ({ name, charges, startTime, endTime, vehicleType }) => {
    const handleShowDetails = () => {
        console.log(startTime, endTime)
    }
    return (
        <Card sx={{ maxWidth: 320, minHeight: 300 }}>
            <CardContent >
                <Grid container spacing={2} alignItems="center" justifyContent="end">
                    <Grid item xs={2}>
                        <LocationOn fontSize="large" />
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
                        Vehicle Type:
                    </Grid>
                    <Grid item xs={4}>
                        {vehicleType}
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={2}>
                                <AccessTime fontSize="large" />
                            </Grid>
                            <Grid item xs={10}>
                                <Typography variant="h6">
                                    {startTime.format('DD MMM hh:00 A')} - {endTime.format('DD MMM hh:00 A')}
                                </Typography>

                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
            <CardActions>
                <Button variant="contained" onClick={handleShowDetails} fullWidth>Show Details</Button>
            </CardActions>
        </Card>
    )
}

export default BookedSlotCard