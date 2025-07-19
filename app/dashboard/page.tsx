'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
  }, [status, router]);

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'مدير',
      vendor: 'بائع',
      marketer: 'مسوق',
      wholesaler: 'تاجر جملة',
      customer: 'عميل',
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

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

  if (!session?.user) {
    return null;
  }

  const user = session.user;

  return (
    <DashboardLayout title="لوحة التحكم">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-full ml-4">
              <Users className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                مرحباً بك، {user.name}
              </h2>
              <p className="text-gray-600">
                نوع الحساب: <span className="font-medium">{getRoleDisplayName(user.role)}</span>
              </p>
              <p className="text-gray-600">
                البريد الإلكتروني: <span className="font-medium">{user.email}</span>
              </p>
              {user.phone && (
                <p className="text-gray-600">
                  رقم الهاتف: <span className="font-medium">{user.phone}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full ml-4">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full ml-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">المبيعات</p>
                <p className="text-2xl font-bold text-gray-900">0 ر.س</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full ml-4">
                <ShoppingCart className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full ml-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">العملاء</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            الإجراءات السريعة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.role === 'vendor' && (
              <>
                <button className="btn-primary text-center p-4">
                  إضافة منتج جديد
                </button>
                <button className="btn-secondary text-center p-4">
                  إدارة المخزون
                </button>
                <button className="btn-secondary text-center p-4">
                  عرض الطلبات
                </button>
              </>
            )}
            
            {user.role === 'marketer' && (
              <>
                <button className="btn-primary text-center p-4">
                  إنشاء حملة تسويقية
                </button>
                <button className="btn-secondary text-center p-4">
                  عرض العمولات
                </button>
                <button className="btn-secondary text-center p-4">
                  تقارير الأداء
                </button>
              </>
            )}
            
            {user.role === 'wholesaler' && (
              <>
                <button className="btn-primary text-center p-4">
                  طلب جملة جديد
                </button>
                <button className="btn-secondary text-center p-4">
                  عرض الأسعار الخاصة
                </button>
                <button className="btn-secondary text-center p-4">
                  تاريخ الطلبات
                </button>
              </>
            )}
            
            {user.role === 'admin' && (
              <>
                <button className="btn-primary text-center p-4">
                  إدارة المستخدمين
                </button>
                <button className="btn-secondary text-center p-4">
                  إدارة المنتجات
                </button>
                <button className="btn-secondary text-center p-4">
                  التقارير والإحصائيات
                </button>
              </>
            )}
            
            {user.role === 'customer' && (
              <>
                <button className="btn-primary text-center p-4">
                  تصفح المنتجات
                </button>
                <button className="btn-secondary text-center p-4">
                  عرض طلباتي
                </button>
                <button className="btn-secondary text-center p-4">
                  قائمة الأمنيات
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}