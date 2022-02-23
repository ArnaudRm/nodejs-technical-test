const {userExistsByEmail} = require('../controllers/users');

const userExistsMiddleware = async (req, res, next) => {
    try {
        const userExists = await userExistsByEmail(req.body.email);
        if (!userExists) {
            return res.status(400).json({error: 'This account doesn\'t exist.'});
        }
        next();
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports = userExistsMiddleware;
