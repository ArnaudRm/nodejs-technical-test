const {checkToken} = require('../helpers/jwt');

const authMiddleware = (req, res, next) => {
    try {
        const tokenRaw = req.headers.authorization;

        checkToken(tokenRaw)
            .then(decodedToken => {
                req.body.userId = decodedToken.userId;
                next();
            })
            .catch(e => {
                res.status(401).json({error: e})
            })
    } catch (error) {
        res.status(401).json({error})
    }
}

module.exports = authMiddleware;
