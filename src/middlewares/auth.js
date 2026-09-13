const authMiddleware = (req, res, next) => {
  // Add your JWT or Session verification logic here later
  next(); 
};
module.exports = authMiddleware;