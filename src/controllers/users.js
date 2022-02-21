const db = require('../firebase');
const {
    collection,
    addDoc,
    getDocs,
    query,
    where,
} = require('firebase/firestore');

const subscribe = async (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
    } = req.body;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        try {
            const user = {
                email,
                password,
                firstName,
                lastName,
            };
            await addDoc(usersRef, user);
            delete user.password;
            res.status(201).json({data: user});
        } catch (e) {
            res.status(400).json({error: e});
        }
    } else {
        res.status(400).json({error: 'Email already exists'})
    }
}

module.exports = {
    subscribe
}
