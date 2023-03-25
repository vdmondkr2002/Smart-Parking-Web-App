const { Grow, Container } = require("@mui/material")
const { useEffect } = require("react")
const { useDispatch } = require("react-redux")
const { useNavigate, useSearchParams } = require("react-router-dom")
const { setAlert } = require("../../state")

const PaymentSuccess = () => {
    const [params] = useSearchParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        if (params.type) {
            if (params.type === "book")
                dispatch(setAlert({ msg: "Booking success" }))
            else
                dispatch(setAlert({ msg: "Refund success" }))
        }

    }, [params])

    useEffect(() => {
        if (params) {
            if (params.type === "book")
                navigate("/profile")
            else
                navigate("/admindb")
        }

    }, [params])

    return (
        <Grow in>
            <Container sx={{ marginTop: "5em" }}>
                Payment Success
            </Container>
        </Grow>
    )
}

export default PaymentSuccess