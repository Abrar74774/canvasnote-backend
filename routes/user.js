import { serialize } from 'cookie'
import jwt from 'jsonwebtoken'
import { Router } from 'express';
import User from '../models/User.js';
import { checkAuth, logAnyMissingParams } from '../utils.js';

const router = Router();

const cookieOptions = {
    httpOnly: true,
    path: '/',
    maxAge: process.env.TOKEN_TTL,
    expires: Date.now() + parseInt(process.env.TOKEN_TTL),
    // sameSite: 'strict', // strict
    // domain: process.env.FRONTEND_URL, // your domain
    // secure: true// true
};

// REGISTER
router.post('/', /*jwtCheck,*/ async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const missing = logAnyMissingParams(req.body, 'email', 'username', 'password')
        if (missing.length) {
            return res.status(400).json({ error: missing })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ error: 'Provided email is already registered' });
        }

        const newUser = {
            email,
            username,
            password,
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


router.post("/login", async (req, res, next) => {
    let { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser || existingUser.password !== password) {
        return res.status(409).json({ error: 'Invalid details' });
    }

    try {
        const token = jwt.sign(
            {
                userId: existingUser.id,
                email: existingUser.email
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.TOKEN_TTL }
        );

        const tokenCookie = serialize('token', token, cookieOptions);
        res.setHeader('Set-Cookie', [tokenCookie]);
        
        res.status(200).json({message: "success"});

    } catch (err) {
        console.log('Error authenticating', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/logout', checkAuth, async (req, res) => {
    try {
        // set to empty 
        const tokenCookie = serialize('token', '', cookieOptions);

        res.setHeader('Set-Cookie', [tokenCookie]);
        res.status(200).json({message: "success"});
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' });
    }
})

export default router;