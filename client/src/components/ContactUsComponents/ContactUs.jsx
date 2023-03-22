import { Button, Link, TextField, useTheme } from "@mui/material";
import { Container, Grid, Grow, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import feedbackImg from '../../images/feedback_parking.svg'
import { asyncpostFeedback } from "../../state";
import Alert from "../../Utils/Alert";

const initialState = {
    firstName: '', lastName: '', country: '', feedback: ''
}

const ContactUs = () => {
    const theme = useTheme()
    const styles = {
        mainCont: {

            marginTop: "5em",
            width: "auto",
            marginBottom: "5em",
            padding: "2em",
        },
        paper: {
            padding: "2em",
            background: theme.palette.primary.dark,
            color: "white"
        },
        listItemText: {
            padding: "3px"
        },
        formContainer: {
            marginTop: "1rem"
        },
        form: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "70%",
            margin: "auto",
            "@media (max-width : 500px)": {
                width: "100%"
            },
        }
    }
    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch()
   

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("submitted")
        dispatch(asyncpostFeedback(formData))
    }
    return (

        <Grow in>
            <Container sx={styles.mainCont}>
                <Alert/>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {/* <Paper sx={styles.paper}  > */}
                        <Typography variant="h2">Contact Us</Typography>
                        <Typography variant="p">Thank you for showing interest in our services. Feel free to reach out to us on various social media platforms:</Typography>
                        <List>
                            <ListItem >
                                <Typography variant="h5" sx={styles.listItemText}>Email ID: </Typography>
                                <Link
                                    href="mailto:smartparking678@gmail.com"
                                    target="_blank"
                                    color="#012dfe"
                                >
                                   smartparking678@gmail.com
                                </Link>
                            </ListItem>
                            <ListItem>
                                <Typography variant="h5" sx={styles.listItemText}>Phone Number:</Typography>
                                <Link
                                    href="#"
                                    target="_blank"
                                    color="#012dfe"
                                >
                                   +91 97020 63963
                                </Link>
                            </ListItem>
                            <ListItem >
                                <Typography variant="h5" sx={styles.listItemText}>Twitter Handle:</Typography>
                                <Link
                                    href="https://www.twitter.com/"
                                    target="_blank"
                                    color="#012dfe"
                                >
                                    @parkingwheelz
                                </Link>
                                
                            </ListItem>
                            <ListItem>
                                <Typography variant="h5" sx={styles.listItemText}>Facebook ID:</Typography>
                                <Typography variant="a" component="a"> </Typography>
                                <Link
                                href="https://www.facebook.com/"
                                target="_blank"
                                color="#012dfe"
                            >
                                Park Wheelz
                            </Link>
                            </ListItem>
                        </List>
                        {/* </Paper> */}
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={styles.paper}>
                            <Grid container justifyContent="center" spacing={4}>
                                <Grid item xs={12}>
                                    <Typography sx={{ textAlign: "center", padding: "5px" }} variant="h2" component="h2">Submit Feedback</Typography>
                                    <Typography sx={{ textAlign: "center", padding: "5px" }} variant="p" component="p">Swing by for a cup of coffee, or leave us a message:</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <img src={feedbackImg} alt="Feedback" />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <Paper sx={{ padding: "1em",borderRadius:"20px",boxShadow:"10px 5px 5px darkviolet" }}>
                                        <form autoComplete="off" noValidate sx={styles.form} onSubmit={handleSubmit}>
                                            <Grid container sx={styles.formContainer} spacing={2}>
                                                <Grid item sm={12} xs={12} sx={styles.ipFields}>
                                                    <TextField
                                                        name="firstName"
                                                        type="text"
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        label="Enter Your first name"
                                                        onChange={handleChange}
                                                        value={formData.firstName}
                                                    />
                                                </Grid>
                                                <Grid item sm={12} xs={12} sx={styles.ipFields}>
                                                    <TextField
                                                        name="lastName"
                                                        type="text"
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        label="Enter Your last name"
                                                        onChange={handleChange}
                                                        value={formData.lastName}
                                                    />
                                                </Grid>
                                                <Grid item sm={12} xs={12} sx={styles.ipFields}>
                                                    <TextField
                                                        name="country"
                                                        type="text"
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        label="Enter Your Country name"
                                                        onChange={handleChange}
                                                        value={formData.country}
                                                    />
                                                </Grid>
                                                <Grid item sm={12} xs={12} sx={styles.ipFields}>
                                                    <TextField
                                                        name="feedback"
                                                        type="text"
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        multiline
                                                        label="Enter Your Feedback"
                                                        onChange={handleChange}
                                                        rows={6}
                                                        value={formData.feedback}
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button fullWidth sx={{ padding: "1em",fontWeight:"bold" }} variant="contained" type="submit">Submit</Button>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </Paper>

                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>

            </Container>
        </Grow>
    )
}

export default ContactUs;