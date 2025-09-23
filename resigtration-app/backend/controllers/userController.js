let users = [];

const userRegistration = async (req, res) => {
  const {
    userName,
    email,
    phone,
    dateOfBirth,
    socialSecurityNo,
    driverLicense,
    gender,
    bloodGroup,
    zipCode,
    websiteUrl,
    creditCardNo,
    timeFormat,
    hexaDecimalColorCode,
    password,
  } = req.body;

  if (!userName || !email) {
    return res.status(400).json({ message: "Name and Email are required" });
  }

  const newUser = {
    id: users.length + 1,
    userName,
    email,
    phone,
    dateOfBirth,
    socialSecurityNo,
    driverLicense,
    gender,
    bloodGroup,
    zipCode,
    websiteUrl,
    creditCardNo,
    timeFormat,
    hexaDecimalColorCode,
    password,
  };

  users.push(newUser);

  res.status(201).json({
    ...newUser,
    message: "User registered successfully",
  });
};


const allUsers = async (req, res) => {
  res.status(200).json(users);
};


const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id == id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
};


const updateUser = (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id == id);

  if (!user) {
    return res.status(404).json({ message: "USer not found" });
  }

  res.status(200).json({
    ...users[user],
    message: "User update Successfully",
  });
};


const deleteUser = (req, res) => {
  const { id } = req.params;
  const user = users.find((u) => u.id == id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const deleteUser = users.splice(user, 1);

  res.status(200).json({
    ...deleteUser[0],
    message: "User Deleted Successfully",
  });
};

module.exports = {
  userRegistration,
  allUsers,
  getUserById,
  updateUser,
  deleteUser,
};
