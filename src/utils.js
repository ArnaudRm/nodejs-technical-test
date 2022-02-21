const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Ch@nG3_mE';

const checkToken = (req) => {
    let token = req.headers['authorization']

    if (!token) {
        return false;
    }
    const tokenWithoutBearer = token.substring(7);
    jwt.verify(tokenWithoutBearer, SECRET_KEY, (error, decoded) => {
        console.log(decoded);
        return !error;
    })
};

const generateToken = (userId) => {
    return jwt.sign(
        {userId},
        SECRET_KEY,
        {
            expiresIn: 60 * 60,
        }
    );
};

module.exports = {
    checkToken,
    generateToken,
};
