import jwt from 'jsonwebtoken'

const authUser = async (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success:false,
            message:"User not logged in. Please provide a valid token.",
        });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            success:false,
            message:"Token missing from authorization header.",
        });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        const userId = token_decode._id || token_decode.id;

        if (!userId) {
            return res.status(401).json({
                success:false,
                message:"Invalid token payload.",
            });
        }

        req.userId = userId;
        req.body = req.body || {};
        req.body.userId = userId;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            success:false,
            message:error.message,
        });
    }
}
export default authUser