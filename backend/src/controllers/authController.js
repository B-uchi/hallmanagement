const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "24h",
  });
};

exports.signup = async (req, res) => {
  try {
    const { fullName, email, password, role, registrationNumber } = req.body;
    
    if (role === 'student' && !registrationNumber) {
      return res.status(400).json({ message: 'Registration number required for students' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      role,
      registrationNumber,
    });

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("error", error);
    res.status(400).json({ message: error.message });
  }
}; 