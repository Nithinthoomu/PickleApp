import express, { json } from 'express';
import mongoose from 'mongoose';
// import { connect, connection, Schema, model } from 'mongoose';
import cors from 'cors';

const { connect, connection, Schema, model } = mongoose;

const app = express();
app.use(cors());
app.use(json());

connect('mongodb://127.0.0.1:27017/pickleApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db=connection;
db.on('error',(err)=>{
  console.log("Error connecting to database",err);
})
db.once('open',()=>{
  console.log('Connected to Database')
})

const userSchme=new Schema({
  username:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  }
})

const User=model('User',userSchme);


//product schema
const productSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  quantities: [
    {
      size: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  currency: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});
const Product = model('Product', productSchema);

const orderSchema=new Schema({
  userEmail:{
    type:String,
    required:true,
  },
  items:[
    {
      // id:{type:Number,required:true},
      name:{type:String,required:true},
      type:{type:String,required:true},
      selectedSize:{type:String,required:true},
      selectedPrice:{type:Number,required:true},
      quantity:{type:Number,required:true},
      // currency:{type:String,required:true},
      // image:{type:String,required:true},
    },
  ],
  address:{
    name:{type:String,required:true},
    street:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    zip:{type:Number,required:true},
    phone:{type:String,required:true}
  },
  totalAmount:{
    type:Number,
    required:true,
  },
  currency:{
    type:String,
    required:true,
  },
  date:{
    type:Date,
    default:Date.now,
  },
})

const Order=model('Order',orderSchema);

app.get('/products', async (_req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/orders',async(req,res)=>{
  const {userEmail,items,address,totalAmount,currency}=req.body;
  if(!userEmail || !items || !address || !totalAmount || !currency){
    return res.status(400).json({message:"All fields are required"})
  }
  try{
    const newOrder=new Order({
      userEmail,
      items,
      address,
      totalAmount,
      currency,
      date:new Date(),
    })
    await newOrder.save();
    return res.status(201).json({success:true})
  }catch(err){
    console.error("error while placing order",err);
    res.status(500).json({message:"Internal server error"})
  }
})

app.get('/orders',async(req,res)=>{
  const {email}=req.query;
  if(!email){
    return res.status(400).json({message:"user email is required"})
  }
  try {
    const orders=await Order.find({userEmail:email});
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

app.get('/',(req,res)=>{
  res.send("welcome to backend of pickle app")
})

app.post('/register',async (req,res)=>{
  const{username,email,password}=req.body;
  if(!username || !email || !password){
    return res.status(400).json({success:false,message:"All fields are required"})
  }
  try{
    const existingUser=await User.findOne({email});
    if(existingUser){
      return res.status(400).json({success:false,message:"User already exists"})
    }
    const newUser=new User({
      username,
      email,
      password
    })
    await newUser.save();
    return res.status(200).json({success:true})
  }catch(error){
    console.error("error while registering",err);
    res.status(500).json({success:false,message:"Internal server error"})
  }
});

app.post('/signin',async (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) {
    return res.status(400).json({message: "Please fill all fields"});
  }
  try{
    const user=await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"user not found"})
    }
    if(user.password!==password){
      return res.status(400).json({message:"incorrect password"})
    }
    return res.status(200).json({success:true,user})
  }catch(err){
    console.log("error found while logging in",err);
    res.status(500).json({message:"Internal server error"})
  }
});

app.post('/update-profile', async (req, res) => {
  const { id, username, email } = req.body;
  if (!id || !username || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== id) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = await User.findByIdAndUpdate(
      id,
      { username, email },
      { new: true }
    );
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.listen(5000, () => {
  console.log("running on port 5000");
});