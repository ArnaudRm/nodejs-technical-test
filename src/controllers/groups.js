const db = require('../firebase');
const {
    collection,
    getDocs,
} = require('firebase/firestore');

const getGroups = async (req, res) => {

    const groupsSnapshot = await getDocs(collection(db, 'groups'));
    const groups = groupsSnapshot.docs.map((doc) => doc.data())
    const data = {groups};

    res.status(200).send({data});
}

module.exports = {
    getGroups,
}
