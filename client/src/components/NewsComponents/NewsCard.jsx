import { Grid, Paper, Typography, useTheme,Link } from "@mui/material"

const NewsCard = ({ author, title, description, url, image }) => {
    const theme = useTheme()
    return (
        <Link
            href={url}
            target="_blank"
            sx={{textDecoration:"none"}}
        >
            <Paper sx={{ background: theme.palette.primary.light, padding: "1em", boxShadow: "10px 5px 5px gray" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" fontWeight="bold">{title}</Typography>
                    </Grid>
                    <Grid item xs={8}>
                        {description}
                    </Grid>
                    <Grid item xs={4}>
                        <img src={image} width="100%" />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: "right" }}>
                        - {author}
                    </Grid>
                </Grid>
            </Paper>
        </Link>
    )
}

export default NewsCard