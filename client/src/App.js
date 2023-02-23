import React, { useMemo } from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';

import {Container,AppBar,} from '@mui/material'
import Navbar from './components/Navbar/Navbar';
import Home from './components/HomePageComponents/Home';
import AboutUs from './components/AboutUsComponents/About';
import {CssBaseline,ThemeProvider} from "@mui/material";
import {createTheme} from '@mui/material/styles';
import { themeSettings } from './theme/theme';

const App = ()=>{
    const theme = useMemo(()=>createTheme(themeSettings()));
    
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Container maxWidth="lg">
                    <Navbar/>
                    <Routes>
                        <Route exact path="/" element={<Home/>}/>
                        <Route exact path="/aboutus" element={<AboutUs/>}/>
                    </Routes>
                </Container>
            </ThemeProvider>
        </Router>
       
    )
}

export default App;  