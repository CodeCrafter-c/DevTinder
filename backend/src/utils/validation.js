const { getRounds } = require("bcrypt");
const validator = require("validator");

const validateSignUpData = function (req, res) {
  let { firstname, lastname, email, password} = req.body;

  // Trim everything first
  firstname = firstname?.trim();
  lastname = lastname?.trim();
  email = email?.trim();
  password = password?.trim();
  // age=Number(age)
  // console.log(password);

  if (!firstname || !firstname.length) {
    throw new Error("Please enter a valid firstname");
  }

  if (lastname && !lastname.length) {
    throw new Error("Please enter valid last name");
  }

  if (!email) {
    throw new Error("Please enter your email");
  }

  if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email");
  }

  // if (!validator.isStrongPassword(password)) {
  //   throw new Error("Please enter a strong password!");
  // }

  req.body.firstname = firstname;
  req.body.lastname = lastname;
  req.body.email = email;
  req.body.password = password;
};


const validateUserEditDetails = function (req) {
  const allowedUpdates = ["firstname", "lastname", "age", "About", "gender"];
  const input = req.body;
  const updates = {};

  // Check for only allowed fields
  const isValidUpdate = Object.keys(input).every(key => allowedUpdates.includes(key));
  if (!isValidUpdate) {
    throw new Error("Update not allowed. Please pass only allowed fields.");
  }

  // Prepare sanitized + validated fields
  if (typeof input.firstname === "string" && input.firstname.trim()) {
    updates.firstname = input.firstname.trim();
  }

  if (typeof input.lastname === "string" && input.lastname.trim()) {
    updates.lastname = input.lastname.trim();
  }

  if (typeof input.About === "string" && input.About.trim()) {
    // console.log("about ",input.About)
    updates.About = input.About.trim(); // note: stored as "about" not "About"
  }

  const age = Number(input.age);
  if (!isNaN(age) && age > 0) {
    updates.age = age;
  }

  if (typeof input.gender === "string") {
    const gender = input.gender.toLowerCase().trim();
    if (["male", "female", "others"].includes(gender)) {
      updates.gender = gender;
    }
  }

  // Apply valid updates to req.user
  for (const key in updates) {
    req.user[key] = updates[key];
  }
};

const validateEmail=function(email){
  
  if(validator.isEmail(email)){
    return true;
  }
  else{
    throw new Error("Not a valid email")
  }
}

module.exports = {
  validateSignUpData,
  validateUserEditDetails,
  validateEmail
};
 