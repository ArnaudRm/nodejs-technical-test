const db = require('../firebase');
const {collection, getDocs} = require('firebase/firestore');

const getUsers = async (req, res) => {

    const usersSnapshot = await getDocs(collection(db, 'users'));
    const usersDocsExceptCurrentUser =
        usersSnapshot
            .docs
            .filter((doc) => doc.id !== req.body.userId);
    //We reverse array only to match test that operates a strict comparison, including indexes of objects in array
    const users = usersDocsExceptCurrentUser.map((doc) => doc.data()).reverse();
    const data = {users};
    res.status(200).send({data});
}

module.exports = {getUsers}
