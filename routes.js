import dotenv from 'dotenv';
dotenv.config();
import { v4 as uuid } from 'uuid';
import { Router } from 'express';
import User from './models/User.js';

const router = Router();


// ADD A USER : POST /users
router.post('/users', /*jwtCheck,*/ async (req, res) => {
  try {
    const { sub, email, name } = req.body;
    console.log("this is the body: ", req.body)

    // Check if the user already exists in the database
    // const existingUser = await User.findOne({ sub });
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = {
      userId: uuid(),
      email,
      name,
      canvases: {}
    }
    const user = new User({...newUser, sub});
    user.save();

    res.status(201).json({ message: `User of id ${newUser.userId} created`, data: newUser });
  } catch (error) {
    console.error("Logging error here: ", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ADD A CANVAS:  POST /users/:userId/canvas
router.post('/users/:userId/canvas', /*jwtCheck,*/ errorHandler, async (req, res) => {
  const userId = req.params.userId;
  const canvasName = req.body.name;
  const canvasImageUrl = req.body.imageUrl;

  try {
    const user = await User.findOne({userId});
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!canvasName || !canvasImageUrl) {
      return res.status(400).json({ error: "Missing fields"})
    }

    user.canvases[canvasName] = canvasImageUrl;
    await User.findOneAndUpdate({userId}, user);

    res.json({ message: 'Canvas added successfully', canvasName, canvasImageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
})
// GET ALL CANVASES OF USER with userId : GET /user/:userId/canvas
.get('/users/:userId/canvas', /*jwtCheck,*/ errorHandler,async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user.canvases);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  });

// PUT /user/:userId/canvas/:canvasName
router.put('/users/:userId/canvas/:canvasName', /*jwtCheck,*/ errorHandler, async (req, res) => {
  const userId = req.params.userId;
  const canvasName = req.params.canvasName;
  const canvasImageUrl = req.body.imageUrl;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.canvases.hasOwnProperty(canvasName)) {
      user.canvases[canvasName] = canvasImageUrl;
      await user.save();
      res.json({ message: 'Canvas updated successfully', canvasName, canvasImageUrl });
    } else {
      res.status(404).json({ error: 'Canvas not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
