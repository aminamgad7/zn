import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ShoppingBag, Users, TrendingUp, Package } from 'lucide-react';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-primary-600 ml-2" />
              <h1 className="text-xl font-bold text-gray-900">متجر إلكتروني</h1>
            </div>
            <nav className="flex space-x-reverse space-x-8">
              {session ? (
                <div className="flex items-center space-x-reverse space-x-4">
                  <span className="text-gray-700">مرحباً، {session.user.name}</span>
                  <Link href="/dashboard" className="btn-primary">
                    لوحة التحكم
                  </Link>
                </div>
              ) : (
                <>
                  <Link href="/auth/signin" className="text-gray-700 hover:text-primary-600 transition-colors">
                    تسجيل الدخول
                  </Link>
                  <Link href="/auth/signup" className="btn-primary">
                    إنشاء حساب
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            منصة التجارة الإلكترونية
            <span className="text-primary-600 block">الشاملة</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            منصة متكاملة تدعم جميع أنواع التجارة الإلكترونية - من البيع بالتجزئة إلى الجملة والتسويق بالعمولة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-3">
              ابدأ الآن مجاناً
            </Link>
            <Link href="/products" className="btn-secondary text-lg px-8 py-3">
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              لماذا تختار منصتنا؟
            </h3>
            <p className="text-lg text-gray-600">
              نوفر حلول شاملة لجميع احتياجات التجارة الإلكترونية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">للبائعين</h4>
              <p className="text-gray-600">
                إدارة شاملة للمنتجات والمخزون مع واجهة سهلة الاستخدام
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">للمسوقين</h4>
              <p className="text-gray-600">
                نظام عمولات متقدم وأدوات تسويق فعالة لزيادة المبيعات
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">لتجار الجملة</h4>
              <p className="text-gray-600">
                أسعار خاصة وطلبات بكميات كبيرة مع خصومات متدرجة
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">للعملاء</h4>
              <p className="text-gray-600">
                تجربة تسوق مميزة مع خيارات دفع متنوعة وشحن سريع
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            جاهز لبدء رحلتك في التجارة الإلكترونية؟
          </h3>
          <p className="text-xl text-primary-100 mb-8">
            انضم إلى آلاف التجار الذين يثقون بمنصتنا
          </p>
          <Link href="/auth/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-block">
            ابدأ الآن
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <ShoppingBag className="h-8 w-8 text-primary-400 ml-2" />
                <h4 className="text-xl font-bold">متجر إلكتروني</h4>
              </div>
              <p className="text-gray-400">
                منصة التجارة الإلكترونية الشاملة في المنطقة العربية
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">الخدمات</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/products" className="hover:text-white transition-colors">المنتجات</Link></li>
                <li><Link href="/categories" className="hover:text-white transition-colors">الفئات</Link></li>
                <li><Link href="/vendors" className="hover:text-white transition-colors">البائعين</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">الدعم</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white transition-colors">مركز المساعدة</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">اتصل بنا</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">تابعنا</h5>
              <p className="text-gray-400">
                ابق على اطلاع بآخر العروض والمنتجات الجديدة
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 متجر إلكتروني. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}