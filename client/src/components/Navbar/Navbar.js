import { AppBar } from '@mui/material';
import {useEffect,useState} from 'react';
import DeskTopNav from './DeskTopNav';
import MobileNav from './MobileNav';


const Navbar = ()=>{
    const [mobileDrawer, setMobileDrawer] = useState({
        drawerOpen: false,
        mobileView: false,
      });
    
      useEffect(() => {
        const setResponsiveness = () => {
          return window.innerWidth < 900 && window.innerWidth > 100
            ? setMobileDrawer((prevState) => ({ ...prevState, mobileView: true }))
            : setMobileDrawer((prevState) => ({ ...prevState, mobileView: false }));
        };
        setResponsiveness();
    
        window.addEventListener("resize", setResponsiveness);
      }, []);

    return (
        <AppBar position='fixed'>
          {
            mobileDrawer.mobileView?(
              <MobileNav mobileDrawer={mobileDrawer} setMobileDrawer={setMobileDrawer}/>
            ):(
              <DeskTopNav/>
            )
          }
        </AppBar>
    )
}

export default Navbar;