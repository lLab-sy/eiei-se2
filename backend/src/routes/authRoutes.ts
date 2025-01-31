import express from 'express'; // Importing express and Router types
import AuthController from '../controllers/authController'; // Importing the controller functions

const router = express.Router(); // Explicitly typing the router as a Router instance

// Register route - POST /register
router.post('/register', AuthController.createUser);
// Login route - POST /login
router.post('/login', AuthController.loginUser);

// Export the router
export default router;
