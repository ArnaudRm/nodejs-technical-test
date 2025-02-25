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
} = require('../helpers');

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

    const {groupId} = req.params;

    const invitedUserDoc = await getUserDocByEmail(req.body.email);
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
    //Sort array to pass last test (toMatchObject compares position of objects in array)
    // And because of generated uid, the two users are not in the same index of array each time

    users.sort((a, b) => a.firstName.localeCompare(b.firstName)).reverse();

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
