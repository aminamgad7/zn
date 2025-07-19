import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  slug: string;
  parent?: mongoose.Types.ObjectId;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'اسم الفئة مطلوب'],
    trim: true,
  },
  nameEn: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  descriptionEn: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'الرابط المختصر مطلوب'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  image: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
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

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);