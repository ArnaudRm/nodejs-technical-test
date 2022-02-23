const db = require("../firebase");
const {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc,
} = require("firebase/firestore");

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
    getUserById,
    getUserDocByEmail,
    userExistsByEmail,
}
