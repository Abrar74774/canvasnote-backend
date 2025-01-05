import { Schema, model } from 'mongoose';

const canvasSchema = new Schema(
    {
        username: { type: String, required: true },
        canvases: { type: Object, default: {} }
    },
    {
        collection: 'canvases'
    }
);

const Canvas = model('Canvas', canvasSchema);

export default Canvas;