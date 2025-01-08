import { Router } from 'express';
import Canvas from '../models/Canvas.js';
import User from '../models/User.js';
import { checkAuth, logAnyMissingParams } from '../utils.js';

const router = Router();

router.post('/test', checkAuth, (req, res) => {
    res.sendStatus(200)
})

// ADD / UPDATE CANVAS
router.route('/').post(checkAuth, updateCanvas).put( checkAuth, updateCanvas);

// RENAME CANVAS
router.put('/rename', checkAuth, async (req, res) => {
    const { username, oldCanvasName, newCanvasName } = req.body

    const missing = logAnyMissingParams(req.body,  'username', 'oldCanvasName', 'newCanvasName')
    if (missing.length) {
        return res.status(400).json({ error: missing })
    }

    const user = await User.findOne({ username })

    if (!user) {
        return res.status(409).json({ error: 'User doesn\'t exist' });
    }
    
    if (!user.canvases.get(oldCanvasName)) {
        return res.status(409).json({ error: 'Canvas doesn\'t exist' });
    }

    user.canvases.set(newCanvasName, user.canvases.get(oldCanvasName))
    user.canvases.delete(oldCanvasName);
    user.save()

    res.status(201).json({ 
        message: `Canvas ${oldCanvasName} renamed to ${newCanvasName} for user ${user.username}` 
    });
})

// DELETE CANVAS
router.delete('/', async (req, res) => {
    const { username, canvasName } = req.body;
    const missing = logAnyMissingParams(req.body,  'username', 'canvasName', 'canvasData')
    if (missing.length) {
        return res.status(400).json({ error: missing })
    }

    const user = await User.findOne({ username })

    if (!user) {
        return res.status(409).json({ error: 'User doesn\'t exist' });
    }

    user.canvases.delete(canvasName)
    user.save();

    res.status(201).json({ 
        message: `Canvas ${canvasName} deleted for user ${user.username}` 
    });
})

async function updateCanvas(req, res) {
    try {
        const { username, canvasName, canvasData } = req.body;
        const missing = logAnyMissingParams(req.body,  'username', 'canvasName', 'canvasData')
        if (missing.length) {
            return res.status(400).json({ error: missing })
        }

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(409).json({ error: 'User doesn\'t exist' });
        }

        if (req.method === "POST" && user.canvases) {
            if (user.canvases.has(canvasName)) {
                return res.status(400).json({ error: 'A canvas with this name already exists. Use PUT request to update'});
            }
            if (user.canvases.size >= 30) {
                return res.status(400).json({ error: 'Cannot add canvas: Limit of 30 canvases reached'});
            }
        }

        user.canvases.set(canvasName, canvasData)
        user.save();

        res.status(201).json({ 
            message: `Canvas ${canvasName} ${req.method === "POST" ? 'created' : 'updated'} for user ${user.username}` 
        });
    } catch (error) {
        console.error("Error on adding canvas:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export default router;