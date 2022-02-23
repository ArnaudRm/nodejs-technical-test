const db = require('../firebase');
const {collection, getDocs} = require('firebase/firestore');

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

module.exports = {getUsers}
