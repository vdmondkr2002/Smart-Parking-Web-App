import {useState,useEffect} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {Snackbar} from '@mui/material'
import MuiAlert from '@mui/material/Alert'
import { clearAlert } from '../state'

const InnerAlert = (props)=>{
    return <MuiAlert elevation={6} variant="filled" {...props}/>
}

const Alert = ()=>{
    const dispatch = useDispatch()
    const alert = useSelector(state=>state.auth.alert)
    
    const [openAlert,setOpenAlert] = useState(false);

    useEffect(()=>{
        if(alert.msg){
            setOpenAlert(true);
        }
    },[alert])

    const handleCloseAlert = (e)=>{
        setOpenAlert(false)
        dispatch(clearAlert())
    }

    return (
        <>
        {
            openAlert?(
                <Snackbar 
                    anchorOrigin={{ horizontal: "center", vertical: "top" }}
                    open={openAlert}
                    autoHideDuration={5000}
                    onClose={handleCloseAlert}
                >
                    <div>
                        <InnerAlert onClose={handleCloseAlert} severity={alert?.type}>
                            <strong>{alert?.msg}</strong>
                        </InnerAlert>
                    </div>
                    
                </Snackbar>
            ):null
        }
        </>
    )

}

export default Alert