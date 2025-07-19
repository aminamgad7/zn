import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parent');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Build query
    const query: any = {};
    
    if (parentId) {
      query.parent = parentId === 'null' ? null : parentId;
    }
    
    if (!includeInactive) {
      query.isActive = true;
    }

    const categories = await Category.find(query)
      .populate('parent', 'name nameEn slug')
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const categoryData = await request.json();

    // Validate required fields
    if (!categoryData.name || !categoryData.slug) {
      return NextResponse.json(
        { message: 'الاسم والرابط المختصر مطلوبان' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug: categoryData.slug });
    if (existingCategory) {
      return NextResponse.json(
        { message: 'الرابط المختصر موجود بالفعل' },
        { status: 400 }
      );
    }

    // Create category
    const category = await Category.create(categoryData);
    
    // Populate parent if exists
    if (category.parent) {
      await category.populate('parent', 'name nameEn slug');
    }

    return NextResponse.json({
      message: 'تم إنشاء الفئة بنجاح',
      category,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Category creation error:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'الرابط المختصر موجود بالفعل' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}