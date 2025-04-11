const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = 8000;
require('dotenv').config();
const jwt = require('jsonwebtoken');
const app = express();
require('./db');
const User = require('./MODELS/UserSchema');
const bcrypt = require('bcrypt');

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

function authenticateToken(req , res, next){
   
    const token = req.headers.authorization.split(' ')[1]; // expected format: Bearer <token>

    const { id } = req.body;
    console.log('token' , token);
    if(!token) {
        const error = new Error('Token Not found');
          next(error); 
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);
       if(id && decoded.id !==id)
        {
          //  return res.status(401).json({message : 'Auth Error'});
          const error = new Error('Invalid Token');
          next(error);
       }
       req.id = decoded;
        next();
    }
    catch (err) {
        // console.log(err);
        // res.status(500).json({message : 'Invalid Token'});
        next(err);
    }
}
app.get('/' , (req , res) => {
    res.send('API works')
});
app.post('/register' , async(req , res) => {
    try{
        const{password , email , age , gender , name } = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            return res.status(409).json({message : 'Email already exists'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);
        const newUser = new User({
            name , 
            password:hashedPassword , 
            email , 
            age , 
            gender
        });
        await newUser.save();
        res.status(201).json({
            message : 'New User registered Successfully'
        });
    }
    catch(err){
         res.status(500).json({message:err.message})
    }
});
app.post('/login' , async(req , res , next) => {
    try{
        const{email , password} = req.body;
        const existingUser = await User.findOne({email});
        if(!existingUser)
        {
            return res.status(401).json({message : 'Invalid Credentials'});
        }
        const isPasswordCorrect = await bcrypt.compare(password , existingUser.password);
        if(!isPasswordCorrect)
        {
            return res.status(401).json({message:'Wrong Password'});
        }
        const accesstoken = jwt.sign({id:existingUser._id} , process.env.JWT_SECRET_KEY , {
            expiresIn :'30s'
        });
        const refreshToken = jwt.sign({id:existingUser._id} , process.env.JWT_REFRESH_SECRET_KEY );
        existingUser.refreshToken = refreshToken;
        await existingUser.save();
        res.cookie('refreshToken' , refreshToken, { httpOnly:true , path : 'refresh_token'})
        res.status(200).json({
            accesstoken , 
            refreshToken , 
            message :'User logged in successfully'
        });
    }
    catch(err){
      next(err);
    }
});
app.get('/getmyprofile', authenticateToken , async(req , res) =>{
     const { id } = req.body;
     const user = await User.findById(id);
    user.password = undefined;
     res.status(200).json({user});
   
});

app.get('/refresh_token' , async(req , res , next) => {
    const token = req.cookies.refreshToken;
    //res.send(token);
    if(!token)
    {
        const error = new Error('Token not found');
         return next(error);
    }
    jwt.verify(token , process.env.JWT_REFRESH_SECRET_KEY , async(err , decoded) => {
        if(err)
        {
            const error = new Error('Invalid Token');
            return next(error);
        }
        const id = decoded.id;
        const existingUser = await User.findById(id);
    
        if(!existingUser || token !==existingUser.refreshToken)
        {
            const error = new Error('Invalid Token');
            return next(error);
        }
        const accesstoken = jwt.sign({id:existingUser._id} , process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn : '40s'
        });
        const refreshToken = jwt.sign({id:existingUser._id} , process.env.JWT_REFRESH_SECRET_KEY);
        existingUser.refreshToken = refreshToken;
        await existingUser.save();
        res.cookie('refreshToken' , refreshToken , {httpOnly :true , path : '/refresh_token'})
        res.status(200).json({
            accesstoken , 
            refreshToken , 
            message :'Token refreshed successfully'
        });
    })
   

});
app.use((err , req , res , next) => {
    console.log('error middleware called ' , err);
    res.status(500).json({message : err.message});
})
app.listen(PORT , () =>{
    console.log(`Server is listening on the port ${PORT}`);
});