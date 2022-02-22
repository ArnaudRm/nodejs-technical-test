const db = require('../firebase');
const {
    collection,
    getDocs,
    getDoc,
    addDoc,
    doc,
    query,
    where,
    documentId,
} = require('firebase/firestore');
const {getUserById} = require('./users');

const getGroups = async (req, res) => {

    const groupsSnapshot = await getDocs(collection(db, 'groups'));
    const groups = groupsSnapshot.docs.map((doc) => doc.data())
    const data = {groups};

    res.status(200).send({data});
}

const createGroup = async (req, res) => {

    const {name, userId} = req.body;
    await addDoc(collection(db, 'groups'), {
        name,
        // We store user a list of user ids instead of whole user data, for performance and future scalability
        // See https://firebase.google.com/docs/database/web/structure-data
        users: {[userId]: true}
    });

    // Getting user data via his id
    const user = await getUserById(userId);
    const data = {
        groups: [
            {
                name,
                users: [user]
            }
        ]
    }
    res.status(201).json({data});
}

const getGroupUsers = async (groupId) => {

    // get group by group Id
    const groupSnapshot = await getDoc(doc(db, 'groups', groupId))
    const usersIds = groupSnapshot.data().users;

    // we get all users which ids are contained in group users array
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where(documentId(), 'in', usersIds));
    const usersSnapshot = await getDocs(q);
    const usersDocs = usersSnapshot.docs;

    return usersDocs.map((doc) => doc.data());
}


module.exports = {
    getGroups,
    createGroup,
}
