import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'wallet';
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'العميل مطلوب'],
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'الكمية يجب أن تكون أكبر من صفر'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'السعر يجب أن يكون أكبر من أو يساوي صفر'],
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'المجموع يجب أن يكون أكبر من أو يساوي صفر'],
    },
  }],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'المجموع الفرعي يجب أن يكون أكبر من أو يساوي صفر'],
  },
  tax: {
    type: Number,
    default: 0,
    min: [0, 'الضريبة يجب أن تكون أكبر من أو تساوي صفر'],
  },
  shipping: {
    type: Number,
    default: 0,
    min: [0, 'الشحن يجب أن يكون أكبر من أو يساوي صفر'],
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'الخصم يجب أن يكون أكبر من أو يساوي صفر'],
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'المجموع الكلي يجب أن يكون أكبر من أو يساوي صفر'],
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'wallet'],
    required: [true, 'طريقة الدفع مطلوبة'],
  },
  shippingAddress: {
    name: {
      type: String,
      required: [true, 'اسم المستلم مطلوب'],
    },
    phone: {
      type: String,
      required: [true, 'رقم الهاتف مطلوب'],
    },
    street: {
      type: String,
      required: [true, 'الشارع مطلوب'],
    },
    city: {
      type: String,
      required: [true, 'المدينة مطلوبة'],
    },
    state: {
      type: String,
      required: [true, 'المحافظة مطلوبة'],
    },
    zipCode: {
      type: String,
      required: [true, 'الرمز البريدي مطلوب'],
    },
    country: {
      type: String,
      required: [true, 'البلد مطلوب'],
    },
  },
  notes: {
    type: String,
  },
  trackingNumber: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);