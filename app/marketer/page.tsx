'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Heart,
  Star,
  ExternalLink,
  Bell,
  Eye,
  Plus
} from 'lucide-react';

interface MarketerStats {
  availableProducts: number;
  activeOrders: number;
  totalCommission: number;
  monthlyCommission: number;
  favoriteProducts: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  commission: number;
  image: string;
  vendor: string;
  rating: number;
  isFavorite: boolean;
}

interface ActiveOrder {
  id: string;
  orderNumber: string;
  productName: string;
  commission: number;
  status: 'pending' | 'confirmed' | 'completed';
  date: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'commission' | 'product' | 'order';
  date: string;
  isRead: boolean;
}

export default function MarketerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MarketerStats>({
    availableProducts: 0,
    activeOrders: 0,
    totalCommission: 0,
    monthlyCommission: 0,
    favoriteProducts: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user?.role !== 'marketer') {
      router.push('/dashboard');
      return;
    }

    // Simulate loading data
    setTimeout(() => {
      setStats({
        availableProducts: 1250,
        activeOrders: 12,
        totalCommission: 3450,
        monthlyCommission: 890,
        favoriteProducts: 45,
      });

      setProducts([
        {
          id: '1',
          name: 'هاتف ذكي متطور',
          price: 2500,
          commission: 125,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
          vendor: 'متجر التقنية',
          rating: 4.5,
          isFavorite: true,
        },
        {
          id: '2',
          name: 'ساعة ذكية رياضية',
          price: 800,
          commission: 80,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
          vendor: 'متجر الساعات',
          rating: 4.2,
          isFavorite: false,
        },
        {
          id: '3',
          name: 'سماعات لاسلكية',
          price: 450,
          commission: 45,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
          vendor: 'متجر الصوتيات',
          rating: 4.8,
          isFavorite: true,
        },
      ]);

      setActiveOrders([
        {
          id: '1',
          orderNumber: 'MKT-2024-001',
          productName: 'هاتف ذكي متطور',
          commission: 125,
          status: 'pending',
          date: '2024-01-15',
        },
        {
          id: '2',
          orderNumber: 'MKT-2024-002',
          productName: 'ساعة ذكية رياضية',
          commission: 80,
          status: 'confirmed',
          date: '2024-01-14',
        },
      ]);

      setNotifications([
        {
          id: '1',
          title: 'عمولة جديدة',
          message: 'تم إضافة عمولة 125 ر.س من بيع هاتف ذكي متطور',
          type: 'commission',
          date: '2024-01-15',
          isRead: false,
        },
        {
          id: '2',
          title: 'منتج جديد متاح',
          message: 'تم إضافة منتج جديد "لابتوب عالي الأداء" بعمولة 15%',
          type: 'product',
          date: '2024-01-14',
          isRead: false,
        },
      ]);

      setLoading(false);
    }, 1000);
  }, [session, status, router]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'confirmed':
        return 'مؤكد';
      case 'completed':
        return 'مكتمل';
      default:
        return status;
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل لوحة المسوق...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="لوحة المسوق">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                مرحباً بك، {session?.user?.name}
              </h2>
              <p className="text-gray-600">
                ابدأ في تسويق المنتجات واكسب عمولات مجزية
              </p>
            </div>
            <div className="bg-primary-100 p-4 rounded-full">
              <TrendingUp className="h-12 w-12 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full ml-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">المنتجات المتاحة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableProducts.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full ml-4">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">الطلبات النشطة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full ml-4">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي العمولات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCommission.toLocaleString()} ر.س</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full ml-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">عمولات هذا الشهر</p>
                <p className="text-2xl font-bold text-gray-900">{stats.monthlyCommission.toLocaleString()} ر.س</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full ml-4">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">المنتجات المفضلة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favoriteProducts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Products and Active Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Products */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                المنتجات المتاحة
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                عرض الكل
              </button>
            </div>

            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg ml-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <button className="text-red-500 hover:text-red-600">
                        <Heart className={`h-4 w-4 ${product.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{product.vendor}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center ml-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.rating})</span>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{product.price} ر.س</p>
                        <p className="text-xs text-green-600">عمولة: {product.commission} ر.س</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Orders */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                الطلبات النشطة
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                عرض الكل
              </button>
            </div>

            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{order.productName}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-green-600">عمولة: {order.commission} ر.س</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              الإشعارات
            </h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              عرض الكل
            </button>
          </div>

          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className={`p-4 rounded-lg border-r-4 ${
                notification.type === 'commission' ? 'bg-green-50 border-green-400' :
                notification.type === 'product' ? 'bg-blue-50 border-blue-400' :
                'bg-yellow-50 border-yellow-400'
              } ${!notification.isRead ? 'ring-2 ring-primary-200' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.date}</p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}