import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) =>{
    // Accept token from either custom 'token' header or standard 'Authorization: Bearer <token>'
    let token = req.headers.token || req.headers.authorization;
    if (token && typeof token === 'string' && token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    if(!token){
        return res.status(401).json({ success:false, message:"Not authorized. Please login again." });
    }

    try {
        const secret = process.env.JWT_SECRET || "dev_insecure_secret_change_me";
        const token_decode = jwt.verify(token, secret);
        // Attach only on req to avoid interfering with body parsers/multer
        req.userId = token_decode.id;
        next();
    } catch (error) {
        console.log('Auth error:', error.message);
        return res.status(401).json({success:false, message:"Invalid or expired token"});
    }
}

export default authMiddleware;