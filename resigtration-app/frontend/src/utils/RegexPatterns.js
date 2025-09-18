
export const RegexPatterns =  {
    phone: /^(\+1[-\s.]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
    zipCode: /^\d{5}(-\d{4})?$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/i,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    socialSecurityNo: /^\d{3}-\d{2}-\d{4}$/,
    dateOfBirth: /^(0[1-9]|1[0-2])(\/|-)(0[1-9]|[12]\d|3[01])\2(19|20)\d{2}$/,
    userName: /^[A-Za-z_][A-Za-z0-9_]{2,19}$/,
    websiteUrl: /^(https?:\/\/)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/,
    creditCardNo: /^(?:\d{4}[- ]?){3}\d{4}$/,
    driverLicense: /^[A-Z0-9]{8,12}$/,
    timeFormat: /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i,
    hexaDecimalColorCode: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
};

  //   const validateForm = () => {
  //   if (!RegexPatterns.phone.test(form.phone)) {
  //     alert("Invalid Phone Number");
  //     return false;
  //   }
  //   if (!RegexPatterns.zipCode.test(form.zipCode)) {
  //     alert("Invalid Zip Code");
  //     return false;
  //   }
  //   if (!RegexPatterns.email.test(form.email)) {
  //     alert("Invalid Email");
  //     return false;
  //   }
  //   if (!RegexPatterns.password.test(form.password)) {
  //     alert("Password must follow the pattern");
  //     return false;
  //   }
  //   if (!RegexPatterns.socialSecurityNo.test(form.socialSecurityNo)) {
  //     alert("Invalid SSN");
  //     return false;
  //   }
  //   if (!RegexPatterns.dateOfBirth.test(form.dateOfBirth)) {
  //     alert("Invalid Date of Birth");
  //     return false;
  //   }
  //   if (!RegexPatterns.userName.test(form.userName)) {
  //     alert("Invalid Username");
  //     return false;
  //   }
  //   if (!RegexPatterns.websiteUrl.test(form.websiteUrl)) {
  //     alert("Invalid Website URL");
  //     return false;
  //   }
  //   if (!RegexPatterns.creditCardNo.test(form.creditCardNo)) {
  //     alert("Invalid Credit Card Number");
  //     return false;
  //   }
  //   if (!RegexPatterns.driverLicense.test(form.driverLicense)) {
  //     alert("Invalid Driver License");
  //     return false;
  //   }
  //   if (!RegexPatterns.timeFormat.test(form.timeFormat)) {
  //     alert("Invalid Time Format");
  //     return false;
  //   }
  //   if (!RegexPatterns.hexaDecimalColorCode.test(form.hexaDecimalColorCode)) {
  //     alert("Invalid Hexadecimal Color Code");
  //     return false;
  //   }
  //   return true;
  // };