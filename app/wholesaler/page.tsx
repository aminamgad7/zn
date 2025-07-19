'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Package,
  ShoppingCart,
  Heart,
  Star,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface WholesalerStats {
  availableProducts: number;
  totalOrders: number;
  favoriteProducts: number;
  totalSavings: number;
}

interface Product {
  id: string;
  name: string;
  retailPrice: number;
  wholesalePrice: number;
  minQuantity: number;
  image: string;
  vendor: string;
  rating: number;
  discount: number;
  isFavorite: boolean;
}

interface OrderHistory {
  id: string;
  orderNumber: string;
  totalItems: number;
  totalAmount: number;
  savings: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  date: string;
}

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'price_drop' | 'stock_alert' | 'new_product';
  date: string;
  isRead: boolean;
}

export default function WholesalerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WholesalerStats>({
    availableProducts: 0,
    totalOrders: 0,
    favoriteProducts: 0,
    totalSavings: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user?.role !== 'wholesaler') {
      router.push('/dashboard');
      return;
    }

    // Simulate loading data
    setTimeout(() => {
      setStats({
        availableProducts: 850,
        totalOrders: 24,
        favoriteProducts: 32,
        totalSavings: 12450,
      });

      setProducts([
        {
          id: '1',
          name: 'هاتف ذكي متطور - عبوة 10 قطع',
          retailPrice: 2500,
          wholesalePrice: 2000,
          minQuantity: 10,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
          vendor: 'متجر التقنية',
          rating: 4.5,
          discount: 20,
          isFavorite: true,
        },
        {
          id: '2',
          name: 'ساعة ذكية رياضية - عبوة 20 قطعة',
          retailPrice: 800,
          wholesalePrice: 640,
          minQuantity: 20,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
          vendor: 'متجر الساعات',
          rating: 4.2,
          discount: 20,
          isFavorite: false,
        },
        {
          id: '3',
          name: 'سماعات لاسلكية - عبوة 15 قطعة',
          retailPrice: 450,
          wholesalePrice: 337,
          minQuantity: 15,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
          vendor: 'متجر الصوتيات',
          rating: 4.8,
          discount: 25,
          isFavorite: true,
        },
      ]);

      setOrderHistory([
        {
          id: '1',
          orderNumber: 'WHL-2024-001',
          totalItems: 50,
          totalAmount: 25000,
          savings: 6250,
          status: 'delivered',
          date: '2024-01-10',
        },
        {
          id: '2',
          orderNumber: 'WHL-2024-002',
          totalItems: 30,
          totalAmount: 15000,
          savings: 3750,
          status: 'shipped',
          date: '2024-01-12',
        },
      ]);

      setAlerts([
        {
          id: '1',
          title: 'انخفاض في السعر',
          message: 'انخفض سعر "هاتف ذكي متطور" بنسبة 5% إضافية للطلبات الكبيرة',
          type: 'price_drop',
          date: '2024-01-15',
          isRead: false,
        },
        {
          id: '2',
          title: 'تنبيه مخزون',
          message: 'كمية محدودة متبقية من "ساعة ذكية رياضية" - اطلب الآن',
          type: 'stock_alert',
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
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
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
      case 'shipped':
        return 'تم الشحن';
      case 'delivered':
        return 'تم التسليم';
      default:
        return status;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price_drop':
        return <TrendingDown className="h-5 w-5 text-green-600" />;
      case 'stock_alert':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'new_product':
        return <Package className="h-5 w-5 text-blue-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل لوحة تاجر الجملة...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="لوحة تاجر الجملة">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                مرحباً بك، {session?.user?.name}
              </h2>
              <p className="text-gray-600">
                اطلب بكميات كبيرة واحصل على أفضل الأسعار
              </p>
            </div>
            <div className="bg-primary-100 p-4 rounded-full">
              <Package className="h-12 w-12 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
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

          <div className="card">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full ml-4">
                <TrendingDown className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التوفير</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSavings.toLocaleString()} ر.س</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products and Order History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Products */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                المنتجات المتاحة
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                تصفح الكل
              </button>
            </div>

            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg ml-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                        <button className="text-red-500 hover:text-red-600">
                          <Heart className={`h-4 w-4 ${product.isFavorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{product.vendor}</p>
                      
                      <div className="flex items-center mb-2">
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

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">سعر التجزئة:</span>
                          <span className="text-xs text-gray-500 line-through">{product.retailPrice} ر.س</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">سعر الجملة:</span>
                          <span className="text-sm font-bold text-green-600">{product.wholesalePrice} ر.س</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">الحد الأدنى:</span>
                          <span className="text-xs text-gray-700">{product.minQuantity} قطعة</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-green-600">توفير {product.discount}%</span>
                          <span className="text-xs font-medium text-green-600">
                            {(product.retailPrice - product.wholesalePrice) * product.minQuantity} ر.س
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order History */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                سجل الطلبات
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                عرض الكل
              </button>
            </div>

            <div className="space-y-4">
              {orderHistory.map((order) => (
                <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">عدد القطع: <span className="font-medium">{order.totalItems}</span></p>
                      <p className="text-gray-600">المبلغ الإجمالي: <span className="font-medium">{order.totalAmount.toLocaleString()} ر.س</span></p>
                    </div>
                    <div>
                      <p className="text-green-600">التوفير: <span className="font-medium">{order.savings.toLocaleString()} ر.س</span></p>
                      <p className="text-gray-600">التاريخ: <span className="font-medium">{order.date}</span></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              التنبيهات
            </h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              عرض الكل
            </button>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-r-4 ${
                alert.type === 'price_drop' ? 'bg-green-50 border-green-400' :
                alert.type === 'stock_alert' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              } ${!alert.isRead ? 'ring-2 ring-primary-200' : ''}`}>
                <div className="flex items-start">
                  <div className="ml-3 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.date}</p>
                  </div>
                  {!alert.isRead && (
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