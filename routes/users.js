import { Router } from 'express';
import User from '../models/User.js';
import { logAnyMissingParams } from '../utils.js';

const router = Router();

// REGISTER
router.post('/', /*jwtCheck,*/ async (req, res) => {
    try {
        const { email, username } = req.body;
        const missing = logAnyMissingParams(req.body, 'email', 'username')
        if (missing.length) {
            return res.status(400).json({ error: missing })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        const newUser = {
            email,
            username,
            canvases: {}
        }

        const user = new User({ ...newUser });
        user.save();

        return res.status(201).json({ message: `User of username ${newUser.username} created`, data: newUser });
    } catch (error) {
        console.error("Error on Register:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;