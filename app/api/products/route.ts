import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';

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
    // Check authentication and authorization
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { message: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'vendor') {
      return NextResponse.json(
        { message: 'هذه الميزة متاحة للبائعين فقط' },
        { status: 403 }
      );
    }

    await connectDB();

    const productData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'marketerPrice', 'wholesalePrice', 'sku', 'category'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json(
          { message: `${field} مطلوب` },
          { status: 400 }
        );
      }
    }

    // Validate that vendor is the authenticated user
    if (productData.vendor && productData.vendor !== session.user.id) {
      return NextResponse.json(
        { message: 'لا يمكنك إضافة منتجات لبائع آخر' },
        { status: 403 }
      );
    }

    // Set vendor to authenticated user
    productData.vendor = session.user.id;

    // Validate price relationships
    const { price, marketerPrice, wholesalePrice } = productData;
    if (marketerPrice >= price) {
      return NextResponse.json(
        { message: 'سعر المسوق يجب أن يكون أقل من السعر الأساسي' },
        { status: 400 }
      );
    }
    if (wholesalePrice >= price) {
      return NextResponse.json(
        { message: 'سعر تاجر الجملة يجب أن يكون أقل من السعر الأساسي' },
        { status: 400 }
      );
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ 
      sku: productData.sku,
      vendor: session.user.id 
    });
    if (existingProduct) {
      return NextResponse.json(
        { message: 'رمز المنتج موجود بالفعل في منتجاتك' },
        { status: 400 }
      );
    }

    // Validate category exists
    const categoryExists = await Category.findById(productData.category);
    if (!categoryExists) {
      return NextResponse.json(
        { message: 'التصنيف المحدد غير موجود' },
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
        { message: 'رمز المنتج موجود بالفعل في النظام' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}