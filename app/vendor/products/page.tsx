'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  marketerPrice: number;
  wholesalePrice: number;
  sku: string;
  quantity: number;
  images: string[];
  category: {
    name: string;
    slug: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
}

export default function VendorProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Check access
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  if (session?.user?.role !== 'vendor') {
    router.push('/dashboard');
    return null;
  }

  useEffect(() => {
    // Simulate loading products data
    setTimeout(() => {
      const sampleProducts: Product[] = [
        {
          _id: '1',
          name: 'هاتف ذكي متطور',
          description: 'هاتف ذكي بمواصفات عالية وكاميرا متقدمة',
          price: 2500,
          marketerPrice: 2200,
          wholesalePrice: 2000,
          sku: 'PHONE-001',
          quantity: 50,
          images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
          category: { name: 'إلكترونيات', slug: 'electronics' },
          isActive: true,
          isFeatured: true,
          createdAt: '2024-01-15',
        },
        {
          _id: '2',
          name: 'ساعة ذكية رياضية',
          description: 'ساعة ذكية مقاومة للماء مع مراقب معدل ضربات القلب',
          price: 800,
          marketerPrice: 720,
          wholesalePrice: 640,
          sku: 'WATCH-001',
          quantity: 0,
          images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
          category: { name: 'إكسسوارات', slug: 'accessories' },
          isActive: false,
          isFeatured: false,
          createdAt: '2024-01-10',
        },
        {
          _id: '3',
          name: 'سماعات لاسلكية',
          description: 'سماعات بلوتوث عالية الجودة مع إلغاء الضوضاء',
          price: 450,
          marketerPrice: 400,
          wholesalePrice: 337,
          sku: 'HEADPHONES-001',
          quantity: 25,
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
          category: { name: 'إلكترونيات', slug: 'electronics' },
          isActive: true,
          isFeatured: false,
          createdAt: '2024-01-08',
        },
      ];
      setProducts(sampleProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.isActive) ||
                         (filterStatus === 'inactive' && !product.isActive) ||
                         (filterStatus === 'out-of-stock' && product.quantity === 0);
    
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (product: Product) => {
    if (product.quantity === 0) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">نفد المخزون</span>;
    }
    if (!product.isActive) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">غير نشط</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">نشط</span>;
  };

  if (loading) {
    return (
      <DashboardLayout title="منتجاتي">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل المنتجات...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="منتجاتي">
      <div className="space-y-6">
        {/* Header */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-full ml-4">
                <Package className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">منتجاتي</h2>
                <p className="text-gray-600">إدارة منتجاتك ومخزونك</p>
              </div>
            </div>
            <Link href="/vendor/products/new" className="btn-primary flex items-center">
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج جديد
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full ml-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full ml-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">المنتجات النشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full ml-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">نفد المخزون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.quantity === 0).length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full ml-4">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المخزون</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.reduce((sum, p) => sum + p.quantity, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div className="relative">
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="input-field pr-10 appearance-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">جميع المنتجات</option>
                <option value="active">المنتجات النشطة</option>
                <option value="inactive">المنتجات غير النشطة</option>
                <option value="out-of-stock">نفد المخزون</option>
              </select>
            </div>

            <div className="text-sm text-gray-600 flex items-center">
              عرض {filteredProducts.length} من {products.length} منتج
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="card">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' ? 'لا توجد منتجات مطابقة' : 'لا توجد منتجات'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'جرب تغيير معايير البحث أو الفلترة'
                  : 'ابدأ بإضافة منتجك الأول'
                }
              </p>
              {(!searchTerm && filterStatus === 'all') && (
                <Link href="/vendor/products/new" className="btn-primary">
                  إضافة منتج جديد
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المنتج
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رمز المنتج
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الأسعار
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المخزون
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg ml-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.category.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono">
                          {product.sku}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div>عادي: {product.price} ر.س</div>
                          <div className="text-blue-600">مسوق: {product.marketerPrice} ر.س</div>
                          <div className="text-green-600">جملة: {product.wholesalePrice} ر.س</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          product.quantity === 0 ? 'text-red-600' : 
                          product.quantity < 10 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {product.quantity} قطعة
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(product)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <div className="flex items-center space-x-reverse space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900 p-1">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 p-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}