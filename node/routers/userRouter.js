const router = require("express").Router();
const User = require("../models/userModel");
const applications = require("../models/applicationModel");
const slots = require("../models/slotsModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// register

router.post("/", async (req, res) => {
  try {
    const { username, email, password, passwordVerify } = req.body;
    //   validation

    if (!username || !email || !password || !passwordVerify)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ errorMessage: "Enter a password with at least 6 characters" });

    if (password !== passwordVerify)
      return res
        .status(400)
        .json({ errorMessage: "Please enter the same password" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        errorMessage: "An account already exist in this email",
      });
    // hash the password

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //  save a new user account

    const newUser = new User({
      username,
      email,
      passwordHash,
    });
    const savedUser = newUser.save();

    // sign  the token
    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET
    );

    // send the token in a cookie

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// log in

router.post("/login", async (req, res) => {
  try {
    console.log("api called");
    const { email, password } = req.body;

    //    validate
    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ errorMessage: "Enter a password with at least 6 characters" });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(401).json({ errorMessage: "Wrong email or password" });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: "Wrong email or password" });

    // sign  the token
    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    // send the token in a cookie
    console.log(existingUser);
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// log out

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
});

router.get("/loggedin", (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    res.send(true);

    next();
  } catch (err) {
    console.error(err);
    res.json(false);
  }
});

router.post("/submitApplication", async (req, res) => {
  try {
    let formData = req.body;
    formData.status = "New";
    console.log(formData);

    const existingCompany = await applications.findOne({
      email: formData.email,
    });
    if (existingCompany)
      return res.status(400).json({
        errorMessage: "An application already exist in this email",
      });

    const newApplication = new applications(formData);
    const savedApplication = newApplication.save();

    res.send("done");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// adminside

router.post("/adminlogin", async (req, res) => {
  try {
    console.log("api called");
    const { email, password } = req.body;

    //    validate
    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ errorMessage: "Enter a password with at least 6 characters" });

    if (password != "123456" || email != "admin@gmail.com")
      return res.status(401).json({ errorMessage: "Wrong email or password" });

    if (password == "123456" && email == "admin@gmail.com")
      res.json({
        email: "admin@gmail.com",
      });
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

//   form data details get data

router.get("/newApplications", async (req, res) => {
  try {
    const newApplications = await applications.find({ status: "New" });
    res.json(newApplications);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/statusPending",async (req, res) => {
  try {
    let id = req.body.id;
    // id = JSON.stringify(id);
    id = mongoose.Types.ObjectId(id)
    console.log(id);
    const newApplications = await applications.findOneAndUpdate(
      { _id: id },
      { status: "Pending" }
    );
    res.send("done");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});


router.get("/pendingApplications",async(req,res)=>{
  try {
    const pendingApplications = await applications.find({ status: "Pending" });
    res.json(pendingApplications);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
})

router.post("/statusApproved",async (req, res) => {
  try {
    let id = req.body.id;
    // id = JSON.stringify(id);
    id = mongoose.Types.ObjectId(id)
    console.log(id);
    const newApplications = await applications.findOneAndUpdate(
      { _id: id },
      { status: "Approved" }
    );
    res.send("done");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.post("/statusDeclined",async (req, res) => {
  try {
    let id = req.body.id;
    // id = JSON.stringify(id);
    id = mongoose.Types.ObjectId(id)
    console.log(id);
    const newApplications = await applications.findOneAndUpdate(
      { _id: id },
      { status: "Declined" }
    );
    res.send("done");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/slotDetails",async(req,res)=>{
  try {
    const approvedApplications = await applications.find({ status: "Approved" });
    res.json(approvedApplications);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
})


router.get("/slots",async (req,res)=>{
  try {
    const Slots = await slots.find();
    console.log(Slots)
    res.json(Slots);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
})

router.post("/inputSlots",async (req,res)=>{
  

    try {
      let slot=req.body
      console.log(slot)
      const slotData = new slots({name:null});
      const savedApplication =await slotData.save();
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
})

router.post("/bookSlot",async(req,res)=>{
  console.log("ethi")
  try {
    let slotId = req.body.ID;
    let company =req.body.company
    // id = JSON.stringify(id);
    slotId = mongoose.Types.ObjectId(slotId)
    company = mongoose.Types.ObjectId(company)

    console.log(slotId);
    console.log(company)
    const newApplications = await slots.findOneAndUpdate(
      { _id: slotId },
      { name:company }
    ).then(async()=>{
      await applications.findOneAndUpdate({_id:company},{status:"Booked"})
    })
    res.send("done");
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
})

// router.post("/applicationStatus",async(req,res)=>{
//   try {
//     let 
//     const applicationStatus = await applications.find();
//     res.json(applicationStatus);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send();
//   }
// })


module.exports = router;
