import jwt from "jsonwebtoken"

export const createUserToken = async (user, req, res) => {

    const token = jwt.sign({
        name: user.name,
        id: user._id
    }, process.env.JWT_SECRET)

    res.status(200).json({message: "Authenticate",
        token: token,
        userId: user._id
    })
}