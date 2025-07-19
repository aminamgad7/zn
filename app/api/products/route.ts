import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    // Build query
    const query: any = { isActive: true };

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Get products with pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .populate('category', 'name nameEn slug')
      .populate('vendor', 'name')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const productData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'sku', 'category', 'vendor'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json(
          { message: `${field} مطلوب` },
          { status: 400 }
        );
      }
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: productData.sku });
    if (existingProduct) {
      return NextResponse.json(
        { message: 'رمز المنتج موجود بالفعل' },
        { status: 400 }
      );
    }

    // Create product
    const product = await Product.create(productData);
    
    // Populate references
    await product.populate('category', 'name nameEn slug');
    await product.populate('vendor', 'name');

    return NextResponse.json({
      message: 'تم إنشاء المنتج بنجاح',
      product,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Product creation error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'رمز المنتج موجود بالفعل' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}