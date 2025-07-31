const express = require('express');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getUserById,
  updateUser
} = require('../controllers/userController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/:id', getUserById);
router.put('/:id', updateUser);

module.exports = router;
