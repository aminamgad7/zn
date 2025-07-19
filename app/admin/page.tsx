'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Settings,
  BarChart3,
  UserPlus,
  PackagePlus,
  LogOut
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeVendors: number;
  activeMarketers: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeVendors: 0,
    activeMarketers: 0,
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
      if (parsedUser.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(parsedUser);
      
      // Simulate loading stats (in real app, fetch from API)
      setTimeout(() => {
        setStats({
          totalUsers: 1247,
          totalProducts: 3892,
          totalOrders: 5634,
          totalRevenue: 892450,
          activeVendors: 156,
          activeMarketers: 89,
          pendingOrders: 23,
        });
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
          <p className="mt-4 text-gray-600">جاري تحميل لوحة الإدارة...</p>
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
              <Settings className="h-8 w-8 text-primary-600 ml-2" />
              <h1 className="text-xl font-bold text-gray-900">لوحة الإدارة</h1>
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
                  مرحباً بك في لوحة الإدارة
                </h2>
                <p className="text-gray-600">
                  إدارة شاملة لجميع جوانب المنصة التجارية
                </p>
              </div>
              <div className="bg-primary-100 p-4 rounded-full">
                <BarChart3 className="h-12 w-12 text-primary-600" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full ml-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full ml-4">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts.toLocaleString()}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
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
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">البائعين النشطين</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeVendors}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">المسوقين النشطين</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.activeMarketers}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">الطلبات المعلقة</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <ShoppingCart className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              الإجراءات السريعة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center justify-center p-6 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors group">
                <div className="text-center">
                  <UserPlus className="h-8 w-8 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-primary-700">إضافة مستخدم</p>
                </div>
              </button>

              <button className="flex items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
                <div className="text-center">
                  <PackagePlus className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-green-700">إضافة منتج</p>
                </div>
              </button>

              <button className="flex items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-blue-700">عرض التقارير</p>
                </div>
              </button>

              <button className="flex items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
                <div className="text-center">
                  <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="font-medium text-purple-700">إعدادات النظام</p>
                </div>
              </button>
            </div>
          </div>

          {/* Management Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* User Management */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                إدارة المستخدمين
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">المديرين</span>
                  <span className="font-semibold text-gray-900">5</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">البائعين</span>
                  <span className="font-semibold text-gray-900">{stats.activeVendors}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">المسوقين</span>
                  <span className="font-semibold text-gray-900">{stats.activeMarketers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">تجار الجملة</span>
                  <span className="font-semibold text-gray-900">67</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">العملاء</span>
                  <span className="font-semibold text-gray-900">930</span>
                </div>
              </div>
              <button className="w-full mt-4 btn-primary">
                إدارة جميع المستخدمين
              </button>
            </div>

            {/* System Health */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                حالة النظام
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">حالة الخادم</span>
                  <span className="text-green-600 font-semibold">متصل</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">قاعدة البيانات</span>
                  <span className="text-green-600 font-semibold">متصلة</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-gray-700">استخدام التخزين</span>
                  <span className="text-yellow-600 font-semibold">67%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">عدد الجلسات النشطة</span>
                  <span className="text-blue-600 font-semibold">234</span>
                </div>
              </div>
              <button className="w-full mt-4 btn-secondary">
                عرض تفاصيل النظام
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}