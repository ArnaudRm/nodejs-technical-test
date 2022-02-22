const db = require('../firebase');
const {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    documentId,
} = require('firebase/firestore');
const {
    getUserById,
    getUserDocByEmail,
    userExistsByEmail,
} = require('./users');

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

const inviteToGroup = async (req, res) => {

    const {email} = req.body;
    const {groupId} = req.params;

    //Check if user with given email exists
    // TODO REFACTOR : maybe create a middleware that takes care of checking this for all concerned routes
    const userExists = await userExistsByEmail(email);
    if (!userExists) {
        return res.status(400).json({error: 'User does not exist'});
    }

    const invitedUserDoc = await getUserDocByEmail(email);

    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    const actualGroupUsers = groupDoc.data().users

    const updatedGroupUsers = {
        ...actualGroupUsers,
        [invitedUserDoc.id]: true,
    }

    await updateDoc(groupRef, {
        users: updatedGroupUsers
    });

    const users = await getGroupUsers(groupId);

    const data = {
        groups: [
            {
                name: groupDoc.data().name,
                users,
            }
        ]
    }
    res.status(200).json({data});
}

const getLatestGroup = async (req, res) => {
    const groupSnapshot = await getDocs(collection(db, 'groups'));
    const latestGroup = groupSnapshot.docs[0]

    res.status(200).send({groupId: latestGroup.id});
}

const getGroupUsers = async (groupId) => {

    // get group by group Id
    const groupSnapshot = await getDoc(doc(db, 'groups', groupId))
    const groupData = groupSnapshot.data();

    const arrayUsersIds = Object.keys(groupData.users);

    // we get all users which ids are contained in group users array
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where(documentId(), 'in', arrayUsersIds));
    const usersSnapshot = await getDocs(q);
    const usersDocs = usersSnapshot.docs;

    return usersDocs.map((doc) => doc.data());
}


module.exports = {
    getGroups,
    createGroup,
    inviteToGroup,
    getLatestGroup,
}
