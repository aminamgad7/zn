'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ShoppingCart, Heart, Star } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
  vendor: {
    name: string;
  };
  isActive: boolean;
  isFeatured: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Sample products data (in a real app, this would come from API)
  const sampleProducts: Product[] = [
    {
      _id: '1',
      name: 'هاتف ذكي متطور',
      description: 'هاتف ذكي بمواصفات عالية وكاميرا متقدمة',
      price: 2500,
      comparePrice: 3000,
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
      category: { name: 'إلكترونيات', slug: 'electronics' },
      vendor: { name: 'متجر التقنية' },
      isActive: true,
      isFeatured: true,
    },
    {
      _id: '2',
      name: 'ساعة ذكية رياضية',
      description: 'ساعة ذكية مقاومة للماء مع مراقب معدل ضربات القلب',
      price: 800,
      comparePrice: 1000,
      images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
      category: { name: 'إكسسوارات', slug: 'accessories' },
      vendor: { name: 'متجر الساعات' },
      isActive: true,
      isFeatured: false,
    },
    {
      _id: '3',
      name: 'حقيبة ظهر عملية',
      description: 'حقيبة ظهر مقاومة للماء مع جيوب متعددة',
      price: 150,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
      category: { name: 'حقائب', slug: 'bags' },
      vendor: { name: 'متجر الحقائب' },
      isActive: true,
      isFeatured: true,
    },
    {
      _id: '4',
      name: 'سماعات لاسلكية',
      description: 'سماعات بلوتوث عالية الجودة مع إلغاء الضوضاء',
      price: 450,
      comparePrice: 600,
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
      category: { name: 'إلكترونيات', slug: 'electronics' },
      vendor: { name: 'متجر الصوتيات' },
      isActive: true,
      isFeatured: false,
    },
    {
      _id: '5',
      name: 'كتاب تطوير الذات',
      description: 'كتاب ملهم لتطوير المهارات الشخصية والمهنية',
      price: 75,
      images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
      category: { name: 'كتب', slug: 'books' },
      vendor: { name: 'مكتبة المعرفة' },
      isActive: true,
      isFeatured: true,
    },
    {
      _id: '6',
      name: 'قميص قطني مريح',
      description: 'قميص قطني عالي الجودة بألوان متنوعة',
      price: 120,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
      category: { name: 'ملابس', slug: 'clothing' },
      vendor: { name: 'متجر الأزياء' },
      isActive: true,
      isFeatured: false,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(sampleProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category.slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name, 'ar');
      default:
        return 0;
    }
  });

  const categories = [
    { name: 'جميع الفئات', slug: '' },
    { name: 'إلكترونيات', slug: 'electronics' },
    { name: 'ملابس', slug: 'clothing' },
    { name: 'إكسسوارات', slug: 'accessories' },
    { name: 'حقائب', slug: 'bags' },
    { name: 'كتب', slug: 'books' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-primary-600 ml-2" />
              <h1 className="text-xl font-bold text-gray-900">متجر إلكتروني</h1>
            </Link>
            <nav className="flex space-x-reverse space-x-8">
              <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600 transition-colors">
                تسجيل الدخول
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                إنشاء حساب
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">المنتجات</h2>
            <p className="text-gray-600">اكتشف مجموعة واسعة من المنتجات عالية الجودة</p>
          </div>

          {/* Filters */}
          <div className="card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="البحث في المنتجات..."
                  className="input-field pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  className="input-field pr-10 appearance-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <select
                className="input-field"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">الأحدث</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="name">الاسم</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <div key={product._id} className="card group hover:shadow-lg transition-shadow duration-200">
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {product.isFeatured && (
                    <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      مميز
                    </div>
                  )}
                  <button className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Product Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Vendor */}
                  <p className="text-xs text-gray-500 mb-2">
                    بواسطة: {product.vendor.name}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 mr-1">(4.0)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold text-gray-900">
                        {product.price} ر.س
                      </span>
                      {product.comparePrice && (
                        <span className="text-sm text-gray-500 line-through mr-2">
                          {product.comparePrice} ر.س
                        </span>
                      )}
                    </div>
                    {product.comparePrice && (
                      <span className="text-sm font-medium text-green-600">
                        وفر {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button className="flex-1 btn-primary text-sm py-2">
                      أضف للسلة
                    </button>
                    <Link
                      href={`/products/${product._id}`}
                      className="btn-secondary text-sm py-2 px-4"
                    >
                      عرض
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Products Found */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                لم يتم العثور على منتجات
              </h3>
              <p className="text-gray-600">
                جرب تغيير معايير البحث أو الفلترة
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}