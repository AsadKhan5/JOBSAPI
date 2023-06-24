const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors/index");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError(
      "unable to provide Acess So Please Provide email or password"
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("no user found Please register first.");
  }
  const isAuth = await user.comparePassword(password);
  if (!isAuth) {
    throw new UnauthenticatedError("password do not match.");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login };
