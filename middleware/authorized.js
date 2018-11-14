const User = require('../models/user');

let authorized = async (req, res, next) => {
  try {
    const token = req.header('x-auth');
    const user = await User.findByToken(token);
    if (!user || user.rol !== 1) return Promise.reject();
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send();
  }
};

module.exports = { authorized };
