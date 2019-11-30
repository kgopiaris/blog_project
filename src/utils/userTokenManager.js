const jwt = require("jsonwebtoken");

const userTokenGenerator = ({
  id = "",
  email = "",
  firstName = "",
  lastName = ""
} = {}) => {
  const token = jwt.sign(
    {
      sub: "user",
      id,
      email,
      firstName,
      lastName
    },
    process.env.JWT_KEY,
    {
      expiresIn: "5 years"
    }
  );
  return token;
};

const userTokenValidator = (token = "") => {
  try {
    const data = jwt.verify(token, process.env.JWT_KEY);
    return data;
  } catch (e) {
    console.error(e);
    return false;
  }
};

exports.userTokenValidator = userTokenValidator;
exports.userTokenGenerator = userTokenGenerator;
