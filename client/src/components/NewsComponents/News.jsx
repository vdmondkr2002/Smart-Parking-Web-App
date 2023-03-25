import { Container, Grid, Grow, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asyncgetNews } from "../../state";
import Alert from "../../Utils/Alert";
import NewsCard from "./NewsCard";

const News = ()=>{
    const styles = {
        newsCont:{
            width:"auto",
            marginTop:"5em"
        },
    }
    const news = useSelector(state=>state.auth.news)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(asyncgetNews())
    },[])
    
    return (
        <Grow in>
            
            <Container sx={styles.newsCont}>
                 <Alert/>
                <Grid container justifyContent="center" spacing={2}>
                    
                        {
                            news.length>0?(
                                news.map(n=>(
                                    <Grid item xs={12} sm={6}>
                                    <NewsCard author={n.author} title={n.title} description={n.description} url={n.url} image={n.urlToImage?n.urlToImage:null}/>
                                    </Grid>
                                )) 
                            ):(
                                <Grid item xs={12} sm={12}>
                                    <Typography variant="h4" fontWeight="bold">
                                                    No News Available Currently
                                                </Typography>
                                </Grid>
                            )
                        }
                </Grid>
            </Container>
        </Grow>
    )
}

export default News;