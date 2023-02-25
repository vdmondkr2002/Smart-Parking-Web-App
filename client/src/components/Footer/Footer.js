import logo from "../../images/Parking-logo.jpg";
import { Typography, CssBaseline, Link, Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "@emotion/react";

const Footer = () => {
    const theme = useTheme()
    const styles = {
        footer: {
            position: "center",
            background: "#DA9FF9",
        },

        flexContainer: {
            display: "flex",
            flexFlow: "row nowrap",
            background:
                "linear-gradient(90deg, rgba(218, 159, 249,1) 10%, rgb(121, 82, 179) 55%)",
            padding: "30px 0px 10px 0px",
            justifyContent: "center",
            alignItems: "ceter",
        },

        flexbox: {
            width: "33%",
            "@media (max-width : 700px)": {
                width: "100%",
            },
        },

        image1: {
            width: "300px",
            margin: "5px 0px 15px 0px ",
            position: "centre",
            transition: ".5s",
            "&:hover": {
                transform: "scale(1.3)",
            },
        },

        link: {
            listStyleType: "none",
            textAlign: "center",
            paddingInlineStart: "0px",
            transition: "1s",
        },

        linkName: {
            color: "black",
            transition: "0.5s",
            "&:hover": {
                color: "#E2F0F9",
                textShadow: "0 0 5px #E2F0F9",
            },
            textDecoration:'none'
        },

        name: {
            color: "#E85A4F",
            "&:hover": {
                color: "#E2F0F9",
            },
        },

        touch: {
            fontSize: "25px",
            fontWeight: "bold",
            padding: "0 0 30px 0",
            "@media (max-width : 700px)": {
                padding: "10px 0 5px 0",
            },
        },

        Icon: {
            margin: "10px 10px 10px 10px",
            fontSize: "40px",
            transform: "scale(.9)",
            zIndex: "-1",
            transition: ".5s",
            "&:hover::before": {
                transform: "scale(1.1)",
            },

            "&:hover": {
                color: "#eae7dc",
                textShadow: "0 0 5px #eae7dc",
                transform: "scale(1.3)",
            },
            "@media (max-width : 700px)": {
                margin: "0px 10px 10px 10px",
            },
        },

        displayInline: {
            display: 'inline'
        }
    }

    return (
        <>
            <Box sx={styles.footer}>
                <Box sx={styles.flexContainer} style={{ flexWrap: "wrap" }}>
                    <Box
                        sx={styles.flexbox}
                        style={{ flexGrow: "1", flex: "auto", flexDirection: "row" }}
                    >
                        <Typography align="center">
                            <Link href="#" color="inherit">
                                <img sx={styles.image1} src={logo} width="50%" alt="Smart Parking Logo" />
                            </Link>
                            <br />
                            <span
                                style={{ fontSize: "20px", fontWeight: "bold" }}
                                align="center"
                            >
                                Park Smart with smart parker 
                            </span>
                        </Typography>
                    </Box>

                    <Box sx={styles.flexbox} style={{ flexGrow: "1" }}>
                        <Typography sx={styles.touch} align="center">
                            Get in Touch
                            <br />
                        </Typography>
                        <Typography align="center">
                            <Link
                                href="https://www.facebook.com/"
                                target="_blank"
                                color="inherit"
                            >
                                <FacebookIcon sx={styles.Icon} />
                            </Link>
                            <Link
                                href="https://www.instagram.com/"
                                target="_blank"
                                color="inherit"
                            >
                                <InstagramIcon sx={styles.Icon} />
                            </Link>
                            <Link
                                href="https://github.com/vdmondkr2002/Smart-Parking-Web-App"
                                target="_blank"
                                color="inherit"
                            >
                                <GitHubIcon sx={styles.Icon} />
                            </Link>
                            <Link href="http://linkedin.com/" target="_blank" color="inherit">
                                <LinkedInIcon sx={styles.Icon} />
                            </Link>
                            <Link
                                href="#"
                                target="_blank"
                                color="inherit"
                            >
                                <EmailIcon sx={styles.Icon} />
                            </Link>
                        </Typography>
                    </Box>

                    <Box sx={styles.flexbox} style={{ flexGrow: "1" }}>
                        <Typography
                            style={{ fontSize: "20px", fontWeight: "bold" }}
                            align="center"
                        >
                            Quick Links
                        </Typography>
                        <Box align="center">
                            <List>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                    <ListItemText  primary={<Link
                                        to="/"
                                        component={RouterLink}
                                        key="Home"
                                        color="inherit"
                                        sx={styles.linkName}
                                    >
                                        Home
                                    </Link>}  align="center" />
                                    </ListItemButton >
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton >
                                    <ListItemText  primary={<Link
                                        to="/login"
                                        component={RouterLink}
                                        key="Home"
                                        color="inherit"
                                        sx={styles.linkName}
                                    >
                                        LogIn
                                    </Link>}  align="center" />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                    <ListItemText  primary={<Link
                                        to="/aboutus"
                                        component={RouterLink}
                                        key="Home"
                                        color="inherit"
                                        sx={styles.linkName}
                                    >
                                        About Us
                                    </Link>}  align="center" />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                            {/* <Lis sx={styles.displyInline} style={{ listStyleType: "none", textAlign: "center" }}>
                                <Link
                                        to="/"
                                        component={RouterLink}
                                        key="Home"
                                        color="inherit"
                                        sx={styles.linkName}
                                    >
                                        Home
                                    </Link>
                                <Link
                                        to="/all"
                                        component={RouterLink}
                                        key="Books"
                                        color="inherit"
                                        sx={styles.linkName}
                                    >
                                        Books
                                    </Link>
                                <Link
                                        to="/aboutus"
                                        component={RouterLink}
                                        key="About Us"
                                        color="inherit"
                                        sx={styles.linkName}
                                    >
                                        About Us
                                    </Link>
                                <li sx={styles.link}>
                                    <Link
                                        to="/add"
                                        component={RouterLink}
                                        key="Sell Books"
                                        color="inherit"
                                        sx={styles.linkName}
                                    >
                                        Sell Books
                                    </Link>
                                </li>
                            </ul> */}
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Typography
                        align="center"
                        style={{
                            fontSize: "13px",
                            position: "Centre",
                            padding: "5px 0 5px 0",
                            background: "black",
                            color: "white",
                        }}
                    >
                        {"Copyright © "}
                        <Link
                            color="inherit"
                            to="/"
                            component={RouterLink}
                            key="Home"
                            sx={styles.name}
                        >
                            SmartParker
                        </Link>{" "}
                        {new Date().getFullYear()}
                        {". "}
                        {"All Rights Reserved"}
                    </Typography>
                </Box>
            </Box>
        </>
    );
};

export default Footer;
