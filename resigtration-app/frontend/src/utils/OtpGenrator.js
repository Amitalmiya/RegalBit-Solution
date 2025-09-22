export const OtpGenrator = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const genrateOtpExpiry = (valiSec = 60) => {
    const otp = OtpGenrator();
    const expireTime = Date.now() + valiSec * 1000;
    return {otp, expireTime};
}