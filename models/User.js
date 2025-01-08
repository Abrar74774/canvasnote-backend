import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  canvases: {
    type: Map,
    of: String, // Values of the object will be strings
    validate: {
      validator: function (canvases) {
        return canvases.size <= 30; // Limit to 30 keys
      },
      message: 'You can only save up to 30 canvases.',
    },
  },
});

const User = model('User', userSchema);

export default User;