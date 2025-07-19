'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface VendorStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  date: string;
}

interface SystemMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  isRead: boolean;
}

export default function VendorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<VendorStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user?.role !== 'vendor') {
      router.push('/dashboard');
      return;
    }

    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalProducts: 45,
        activeProducts: 42,
        totalOrders: 156,
        pendingOrders: 8,
        totalRevenue: 23450,
        monthlyRevenue: 5670,
      });

      setRecentOrders([
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          customerName: 'أحمد محمد',
          total: 450,
          status: 'pending',
          date: '2024-01-15',
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          customerName: 'فاطمة علي',
          total: 320,
          status: 'confirmed',
          date: '2024-01-14',
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          customerName: 'محمد سالم',
          total: 780,
          status: 'shipped',
          date: '2024-01-13',
        },
      ]);

      setSystemMessages([
        {
          id: '1',
          title: 'تحديث سياسة الإرجاع',
          message: 'تم تحديث سياسة الإرجاع والاستبدال. يرجى مراجعة التفاصيل الجديدة.',
          type: 'info',
          date: '2024-01-15',
          isRead: false,
        },
        {
          id: '2',
          title: 'منتج نفد من المخزون',
          message: 'المنتج "هاتف ذكي متطور" نفد من المخزون. يرجى تحديث الكمية.',
          type: 'warning',
          date: '2024-01-14',
          isRead: false,
        },
        {
          id: '3',
          title: 'تم تأكيد الطلب',
          message: 'تم تأكيد الطلب رقم ORD-2024-002 بنجاح.',
          type: 'success',
          date: '2024-01-14',
          isRead: true,
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

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل لوحة البائع...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="لوحة البائع">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                مرحباً بك، {session?.user?.name}
              </h2>
              <p className="text-gray-600">
                إدارة متجرك ومنتجاتك بسهولة من هنا
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
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString()} ر.س</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">الطلبات المعلقة</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إيرادات هذا الشهر</p>
                <p className="text-3xl font-bold text-green-600">{stats.monthlyRevenue.toLocaleString()} ر.س</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders and System Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                الطلبات الأخيرة
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                عرض الكل
              </button>
            </div>

            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-medium text-gray-900">{order.total} ر.س</p>
                      <p className="text-xs text-gray-500">{order.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Messages */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                رسائل النظام
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                عرض الكل
              </button>
            </div>

            <div className="space-y-4">
              {systemMessages.map((message) => (
                <div key={message.id} className={`p-4 rounded-lg border-r-4 ${
                  message.type === 'info' ? 'bg-blue-50 border-blue-400' :
                  message.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  message.type === 'success' ? 'bg-green-50 border-green-400' :
                  'bg-red-50 border-red-400'
                } ${!message.isRead ? 'ring-2 ring-primary-200' : ''}`}>
                  <div className="flex items-start">
                    <div className="ml-3 mt-1">
                      {getMessageIcon(message.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{message.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{message.message}</p>
                      <p className="text-xs text-gray-500">{message.date}</p>
                    </div>
                    {!message.isRead && (
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}