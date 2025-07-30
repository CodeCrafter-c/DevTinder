const generateOTP = function(length = 6) {
    const min = Math.pow(10, length - 1); 
    const max = Math.pow(10, length) - 1; 
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    return otp.toString();
};
module.exports={
    generateOTP
}