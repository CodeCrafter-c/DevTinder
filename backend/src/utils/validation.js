const validator = require("validator");


const validateSignUpData = function (req, res) {
  let { firstname, lastname, email, password } = req.body;

  // Trim everything first
  firstname = firstname?.trim();
  lastname = lastname?.trim();
  email = email?.trim();
  password = password?.trim();
  console.log(password);
  // Now validate as above...

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
  req.body.email=email;
  req.body.password=password;
};

const validateUserEditDetails = function(req) {
  
    const allowedUpdates = ["firstname", "lastname", "age", "About"];
    const userInputDetails = req.body;
    // console.log(userInputDetails);
    const firstname=req.body.firstname?.trim();
    const lastname=req.body.lastname?.trim();
    const age = Number(req.body.age);
    const about=req.body.About?.trim();

    

    const isUpdateAllowed = Object.keys(userInputDetails).every(
      (input) => {
        return allowedUpdates.includes(input);
      }
    );

    if(!isUpdateAllowed){
      throw new Error ("Update now allowed, Please pass only allowed fields");
    }

    // console.log(req.user)
    let loggedInUser=req.user.toObject();
    
    if(firstname){
      userInputDetails.firstname=firstname;
    }

    if(lastname){
      userInputDetails.lastname=lastname;
    }

    if(about){
      userInputDetails.about=about;
    }

    if(age){
      userInputDetails.age=age;
    }

    // console.log( req.user,Object.keys(req.user))

    // console.log(Object.keys(userInputDetails)); 
    Object.keys(loggedInUser).forEach((key)=>{     
      // console.log(key);
      if(Object.keys(userInputDetails).includes(key)){
        // console.log(key);
        req.user[key]=userInputDetails[key];
      }
    })
  
};

module.exports = {
  validateSignUpData,
  validateUserEditDetails
};
