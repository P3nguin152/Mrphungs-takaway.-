import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface IOrder extends Document {
  customerName: string;
  phone: string;
  deliveryAddress: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'accepted' | 'ready' | 'completed' | 'cancelled';
  deliveryNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: String,
});

const orderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
    deliveryNotes: String,
  },
  { timestamps: true }
);

// Create the model or return the existing one to prevent model redefinition
export const Order = (mongoose.models.Order as mongoose.Model<IOrder>) || mongoose.model<IOrder>('Order', orderSchema);
