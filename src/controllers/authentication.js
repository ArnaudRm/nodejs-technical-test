const db = require('../firebase');
const {collection, addDoc} = require('firebase/firestore');
const {userExistsByEmail, getUserDocByEmail} = require('../helpers');
const {generateToken} = require('../helpers/jwt');

const subscribe = async (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
    } = req.body;

    const userExists = await userExistsByEmail(email);
    if (userExists) {
        return res.status(400).json({error: 'Email already exists'})
    }

    try {
        const user = {
            email,
            password,
            firstName,
            lastName,
        };
        await addDoc(collection(db, 'users'), user);
        delete user.password;
        res.status(201).json({data: user});
    } catch (e) {
        res.status(400).json({error: e});
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const userDoc = await getUserDocByEmail(email);
        const user = userDoc.data();
        const userId = userDoc.id;

        if (password !== user.password) {
            return res.status(401).json({error: 'Invalid credentials.'});
        }

        const data = {authJWT: generateToken(userId)};
        res.status(200).json({data});

    } catch (e) {
        res.status(500).json({error: e});
    }
}

module.exports = {
    subscribe,
    login,
}

