const jwt = require('jsonwebtoken');
const SECRET_KEY = 'Ch@nG3_mE';

const checkToken =  (token) => {
    return new Promise((resolve, reject) => {
        if (!token) {
            reject('Token is not present');
        }
        const tokenWithoutBearer = token.substring(7);
        jwt.verify(tokenWithoutBearer, SECRET_KEY, (error,decoded) => {
            if(error) {
                reject(error);
            }
            resolve(decoded);
        })
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
