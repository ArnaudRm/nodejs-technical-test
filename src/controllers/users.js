const db = require('../firebase');
const {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    getDoc,
    doc,
} = require('firebase/firestore');
const {generateToken} = require('../utils');

const subscribe = async (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
    } = req.body;

    const userExists = await userExistsByEmail(email);
    if (userExists) {
        res.status(400).json({error: 'Email already exists'})
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

const getUsers = async (req, res) => {

    const usersSnapshot = await getDocs(collection(db, 'users'));
    const usersDocsExceptCurrentUser =
        usersSnapshot
            .docs
            .filter((doc) => doc.id !== req.body.userId);
    const users = usersDocsExceptCurrentUser.map((doc) => doc.data())
    const data = {users};
    res.status(200).send({data});
}


const userExistsByEmail = async (email) => {

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    return !snapshot.empty;
};

const getUserDocByEmail = async (email) => {

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    return snapshot.docs[0];
};

const getUserById = async (uid) => {
    const userSnapshot = await getDoc(doc(db, 'users', uid))
    return userSnapshot.data();
};

module.exports = {
    subscribe,
    login,
    getUsers,
    getUserById,
    getUserDocByEmail,
    userExistsByEmail,
}
