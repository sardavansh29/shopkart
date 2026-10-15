const Customer = require('../models/customer.model');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken')

const registerCustomer = async (req,res) =>{
  const {fullName,email,password,phone} = req.body;
  if (!fullName || !email || !password || !phone) {
    return res.status(400).send('All fields are Not present');
  }
  if ( password.length < 6){
    return res.status(400).send('Password must be atleast 6 charactes');
  }
  const existingCustomer = await Customer.findOne({email});
  if ( existingCustomer){
    return res.status(409).send('Email already exists')
  }
  
  const hashed_passwd = await bcrypt.hash(password,10)
  const newCustomer = await Customer.create({
    fullName,
    email,
    password : hashed_passwd,
    phone
  })
  const customerData = newCustomer.toObject();
  delete customerData.password
  res.status(201).send(customerData);
}

const loginCustomer = async (req,res) =>{
  const {email,password} = req.body;
  const customer = await Customer.findOne({email});
  if ( !customer){
    return res.status(401).send('Invalid Credentials')
  }
  const isPasswordCorrect = await bcrypt.compare(
    password,
    customer.password
  )
  if (!isPasswordCorrect){
    return res.status(401).send('Invalid Credentials')
  }
  const token = generateToken(customer._id);
  res.cookie('token',token,{httpOnly : true});
  return res.status(200).send({
    success : true,
    message : 'Login Successful'
  })
}

const getProfile = (req,res) =>{
  const customer = req.user;
  const customerData = customer.toObject();
  delete customerData.password;
  return res.status(200).send(customerData);
}

const logoutCustomer = (req,res) =>{
  res.clearCookie('token');
  return res.status(200).send({
    success: true,
    message: 'Logout Successful'
  });
}
module.exports = {registerCustomer,loginCustomer,getProfile,logoutCustomer};
