const jwt = require('jsonwebtoken');
const generateToken = (customerId) =>{
  const token = jwt.sign(
    {customerId},
    process.env.JWT_SECRET_KEY,
    {expiresIn : '1h'}
  )
  return token;
}
module.exports = generateToken;
