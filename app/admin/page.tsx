'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Users,
  ShoppingCart,
  CreditCard,
  Wallet,
  Bell,
  MessageCircle,
  Truck,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  pendingWithdrawals: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeVendors: number;
  activeMarketers: number;
  systemAlerts: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'order_placed' | 'withdrawal_request' | 'system_alert';
  title: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface CriticalAlert {
  id: string;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  category: 'security' | 'system' | 'payment' | 'user';
  time: string;
  isResolved: boolean;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    pendingWithdrawals: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeVendors: 0,
    activeMarketers: 0,
    systemAlerts: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [criticalAlerts, setCriticalAlerts] = useState<CriticalAlert[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalUsers: 1247,
        totalOrders: 5634,
        pendingWithdrawals: 23,
        totalRevenue: 892450,
        monthlyRevenue: 156780,
        activeVendors: 156,
        activeMarketers: 89,
        systemAlerts: 7,
      });

      setRecentActivities([
        {
          id: '1',
          type: 'user_registration',
          title: 'مستخدم جديد',
          description: 'انضم أحمد محمد كبائع جديد',
          time: 'منذ 5 دقائق',
          status: 'success',
        },
        {
          id: '2',
          type: 'order_placed',
          title: 'طلب جديد',
          description: 'طلب بقيمة 450 ر.س من فاطمة علي',
          time: 'منذ 15 دقيقة',
          status: 'info',
        },
        {
          id: '3',
          type: 'withdrawal_request',
          title: 'طلب سحب',
          description: 'طلب سحب 2500 ر.س من محمد سالم',
          time: 'منذ 30 دقيقة',
          status: 'warning',
        },
        {
          id: '4',
          type: 'system_alert',
          title: 'تنبيه نظام',
          description: 'استخدام عالي للخادم - 85%',
          time: 'منذ ساعة',
          status: 'error',
        },
      ]);

      setCriticalAlerts([
        {
          id: '1',
          title: 'محاولة دخول مشبوهة',
          message: 'تم رصد محاولات دخول متعددة فاشلة من IP: 192.168.1.100',
          severity: 'high',
          category: 'security',
          time: 'منذ 10 دقائق',
          isResolved: false,
        },
        {
          id: '2',
          title: 'خطأ في نظام الدفع',
          message: 'فشل في معالجة 3 عمليات دفع في آخر ساعة',
          severity: 'high',
          category: 'payment',
          time: 'منذ 25 دقيقة',
          isResolved: false,
        },
        {
          id: '3',
          title: 'مساحة التخزين منخفضة',
          message: 'مساحة التخزين المتبقية أقل من 10%',
          severity: 'medium',
          category: 'system',
          time: 'منذ ساعة',
          isResolved: true,
        },
      ]);

      setLoading(false);
    }, 1000);
  }, [session, status, router]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <Users className="h-5 w-5" />;
      case 'order_placed':
        return <ShoppingCart className="h-5 w-5" />;
      case 'withdrawal_request':
        return <CreditCard className="h-5 w-5" />;
      case 'system_alert':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-400 bg-red-50';
      case 'medium':
        return 'border-yellow-400 bg-yellow-50';
      case 'low':
        return 'border-blue-400 bg-blue-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل لوحة الإدارة...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout title="لوحة الإدارة">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                مرحباً بك، {session?.user?.name}
              </h2>
              <p className="text-gray-600">
                إدارة شاملة لجميع جوانب المنصة التجارية
              </p>
            </div>
            <div className="bg-primary-100 p-4 rounded-full">
              <Users className="h-12 w-12 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full ml-4">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">طلبات السحب المعلقة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingWithdrawals}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600">إيرادات هذا الشهر</p>
                <p className="text-3xl font-bold text-purple-600">{stats.monthlyRevenue.toLocaleString()} ر.س</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Wallet className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">تنبيهات النظام</p>
                <p className="text-3xl font-bold text-red-600">{stats.systemAlerts}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities and Critical Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                أحدث العمليات
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                عرض الكل
              </button>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ml-3 ${getActivityColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{activity.title}</h4>
                    <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                تنبيهات حرجة
              </h3>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                عرض الكل
              </button>
            </div>

            <div className="space-y-4">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-r-4 ${getSeverityColor(alert.severity)} ${
                  !alert.isResolved ? 'ring-2 ring-red-200' : ''
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h4 className="font-medium text-gray-900">{alert.title}</h4>
                        {alert.isResolved ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <Clock className="h-4 w-4 text-red-600 mr-2" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity === 'high' ? 'عالي' : alert.severity === 'medium' ? 'متوسط' : 'منخفض'}
                        </span>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Management Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            إدارة سريعة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-blue-700">إدارة المستخدمين</p>
              </div>
            </button>

            <button className="flex items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
              <div className="text-center">
                <ShoppingCart className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-green-700">إدارة الطلبات</p>
              </div>
            </button>

            <button className="flex items-center justify-center p-6 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors group">
              <div className="text-center">
                <CreditCard className="h-8 w-8 text-yellow-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-yellow-700">طلبات السحب</p>
              </div>
            </button>

            <button className="flex items-center justify-center p-6 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
              <div className="text-center">
                <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-medium text-purple-700">التقارير</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}