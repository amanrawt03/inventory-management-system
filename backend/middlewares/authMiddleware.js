import jwt from 'jsonwebtoken'

// Middleware to decode and verify the token
const authenticateToken = (req, res, next) => {
    // Use cookie-parser to parse cookies
    const cookies = req.cookies;

    // Get the token from the cookies
    const token = cookies.jwt; // Assuming the token is stored in a cookie named 'token'

    if (!token) {
        return res.sendStatus(401); // Unauthorized if no token is found
    }

    // Verify the token
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden if token is invalid
        }

        // Add user._id to the request object
        req.userId = user.user_id; 

        next(); // Proceed to the next middleware or route handler
    });
};

export default authenticateToken;