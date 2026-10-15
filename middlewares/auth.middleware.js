const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');
const authMiddleware = async (req,res,next) =>{
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  let decoded;
  try{
    decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
  } catch(error){
    return res.status(401).send('Unauthorized');
  }
  const customer = await Customer.findById(decoded.customerId);
  if (!customer) {
    return res.status(401).send('Unauthorized');
  }
  req.user = customer;
  next();

}
module.exports = authMiddleware;
