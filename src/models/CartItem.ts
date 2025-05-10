import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.CartItem || mongoose.model('CartItem', CartItemSchema);
