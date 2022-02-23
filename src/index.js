const express = require("express");
const app = express();
const usersRoutes = require('./routes/users');
const groupsRoutes = require('./routes/groups');
const authRoutes = require('./routes/authentication');

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Server app listening on port ' + port);
});

//Cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(express.json());
app.use('/groups', groupsRoutes);
app.use('/', usersRoutes);
app.use('/', authRoutes);

module.exports = app;
