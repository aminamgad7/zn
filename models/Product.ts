import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  nameEn?: string;
  description: string;
  descriptionEn?: string;
  price: number;
  marketerPrice?: number;
  wholesalePrice?: number;
  comparePrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  quantity: number;
  minQuantity: number;
  category: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  images: string[];
  specifications: {
    key: string;
    value: string;
  }[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'اسم المنتج مطلوب'],
    trim: true,
  },
  nameEn: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'وصف المنتج مطلوب'],
  },
  descriptionEn: {
    type: String,
  },
  price: {
    type: Number,
    required: [true, 'سعر المنتج مطلوب'],
    min: [0, 'السعر يجب أن يكون أكبر من صفر'],
  },
  marketerPrice: {
    type: Number,
    min: [0, 'سعر المسوق يجب أن يكون أكبر من صفر'],
  },
  wholesalePrice: {
    type: Number,
    min: [0, 'سعر الجملة يجب أن يكون أكبر من صفر'],
  },
  comparePrice: {
    type: Number,
    min: [0, 'سعر المقارنة يجب أن يكون أكبر من صفر'],
  },
  cost: {
    type: Number,
    min: [0, 'التكلفة يجب أن تكون أكبر من صفر'],
  },
  sku: {
    type: String,
    required: [true, 'رمز المنتج مطلوب'],
    unique: true,
    trim: true,
  },
  barcode: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'الكمية مطلوبة'],
    min: [0, 'الكمية يجب أن تكون أكبر من أو تساوي صفر'],
  },
  minQuantity: {
    type: Number,
    default: 1,
    min: [0, 'الحد الأدنى للكمية يجب أن يكون أكبر من أو يساوي صفر'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'فئة المنتج مطلوبة'],
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'البائع مطلوب'],
  },
  images: [{
    type: String,
    required: true,
  }],
  specifications: [{
    key: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  weight: {
    type: Number,
    min: [0, 'الوزن يجب أن يكون أكبر من صفر'],
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  seoTitle: {
    type: String,
    trim: true,
  },
  seoDescription: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);