'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Eye,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Store
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  isActive: boolean;
  category: string;
}

interface VendorStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

export default function VendorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<VendorStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'vendor') {
        router.push('/dashboard');
        return;
      }
      setUser(parsedUser);
      
      // Simulate loading data (in real app, fetch from API)
      setTimeout(() => {
        setStats({
          totalProducts: 45,
          activeProducts: 42,
          totalOrders: 156,
          totalRevenue: 23450,
          pendingOrders: 8,
        });
        
        setProducts([
          {
            _id: '1',
            name: 'هاتف ذكي متطور',
            price: 2500,
            quantity: 15,
            isActive: true,
            category: 'إلكترونيات',
          },
          {
            _id: '2',
            name: 'ساعة ذكية رياضية',
            price: 800,
            quantity: 8,
            isActive: true,
            category: 'إكسسوارات',
          },
          {
            _id: '3',
            name: 'سماعات لاسلكية',
            price: 450,
            quantity: 0,
            isActive: false,
            category: 'إلكترونيات',
          },
        ]);
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل لوحة البائع...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-primary-600 ml-2" />
              <h1 className="text-xl font-bold text-gray-900">لوحة البائع</h1>
            </div>
            <div className="flex items-center space-x-reverse space-x-4">
              <span className="text-gray-700">مرحباً، {user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <LogOut className="h-5 w-5 ml-1" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  مرحباً بك في متجرك
                </h2>
                <p className="text-gray-600">
                  إدارة منتجاتك ومبيعاتك بسهولة
                </p>
              </div>
              <div className="bg-primary-100 p-4 rounded-full">
                <Package className="h-12 w-12 text-primary-600" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full ml-4">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full ml-4">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">المنتجات النشطة</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProducts}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full ml-4">
                  <ShoppingCart className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full ml-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} ر.س</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="bg-orange-100 p-3 rounded-full ml-4">
                  <ShoppingCart className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">الطلبات المعلقة</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              الإجراءات السريعة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center justify-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors group">
                <Plus className="h-6 w-6 text-primary-600 ml-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-primary-700">إضافة منتج جديد</span>
              </button>

              <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                <Package className="h-6 w-6 text-green-600 ml-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-green-700">إدارة المخزون</span>
              </button>

              <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                <ShoppingCart className="h-6 w-6 text-blue-600 ml-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-blue-700">عرض الطلبات</span>
              </button>

              <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                <TrendingUp className="h-6 w-6 text-purple-600 ml-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-purple-700">تقارير المبيعات</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                منتجاتي الأخيرة
              </h3>
              <button className="btn-primary">
                عرض جميع المنتجات
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المنتج
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الفئة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      السعر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الكمية
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
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {product.category}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.price.toLocaleString()} ر.س
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          product.quantity > 0 ? 'text-gray-900' : 'text-red-600'
                        }`}>
                          {product.quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-reverse space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}