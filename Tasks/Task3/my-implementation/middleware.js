const authmiddleware = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send('please login first');
  }
};

module.exports = authmiddleware;
