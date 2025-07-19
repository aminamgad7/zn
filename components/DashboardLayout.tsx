'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Plus,
  ShoppingCart,
  Wallet,
  MessageCircle,
  Bell,
  Users,
  Heart,
  ExternalLink,
  Truck,
  FileText,
  Menu,
  X,
  LogOut,
  Store,
  Settings,
  BarChart3,
  CreditCard
} from 'lucide-react';

interface SidebarItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const getSidebarItems = (role: string): SidebarItem[] => {
    switch (role) {
      case 'vendor':
        return [
          { label: 'منتجاتي', icon: <Package className="h-5 w-5" />, href: '/vendor/products' },
          { label: 'رفع منتج', icon: <Plus className="h-5 w-5" />, href: '/vendor/products/new' },
          { label: 'الطلبات', icon: <ShoppingCart className="h-5 w-5" />, href: '/vendor/orders', badge: 3 },
          { label: 'المحفظة', icon: <Wallet className="h-5 w-5" />, href: '/vendor/wallet' },
          { label: 'مركز الرسائل', icon: <MessageCircle className="h-5 w-5" />, href: '/vendor/messages', badge: 2 },
          { label: 'الإشعارات', icon: <Bell className="h-5 w-5" />, href: '/vendor/notifications', badge: 5 },
        ];
      
      case 'marketer':
        return [
          { label: 'تصفح المنتجات', icon: <Package className="h-5 w-5" />, href: '/marketer/products' },
          { label: 'طلباتي', icon: <ShoppingCart className="h-5 w-5" />, href: '/marketer/orders' },
          { label: 'المفضلة', icon: <Heart className="h-5 w-5" />, href: '/marketer/favorites' },
          { label: 'المحفظة', icon: <Wallet className="h-5 w-5" />, href: '/marketer/wallet' },
          { label: 'مركز الرسائل', icon: <MessageCircle className="h-5 w-5" />, href: '/marketer/messages', badge: 1 },
          { label: 'الإشعارات', icon: <Bell className="h-5 w-5" />, href: '/marketer/notifications', badge: 3 },
          { label: 'EasyOrders/YouCan', icon: <ExternalLink className="h-5 w-5" />, href: '/marketer/external-orders' },
        ];
      
      case 'wholesaler':
        return [
          { label: 'المنتجات', icon: <Package className="h-5 w-5" />, href: '/wholesaler/products' },
          { label: 'الطلبات', icon: <ShoppingCart className="h-5 w-5" />, href: '/wholesaler/orders' },
          { label: 'المفضلة', icon: <Heart className="h-5 w-5" />, href: '/wholesaler/favorites' },
          { label: 'مركز الرسائل', icon: <MessageCircle className="h-5 w-5" />, href: '/wholesaler/messages' },
          { label: 'الإشعارات', icon: <Bell className="h-5 w-5" />, href: '/wholesaler/notifications', badge: 2 },
        ];
      
      case 'admin':
        return [
          { label: 'إدارة المستخدمين', icon: <Users className="h-5 w-5" />, href: '/admin/users' },
          { label: 'إدارة الطلبات', icon: <ShoppingCart className="h-5 w-5" />, href: '/admin/orders' },
          { label: 'طلبات السحب', icon: <CreditCard className="h-5 w-5" />, href: '/admin/withdrawals', badge: 4 },
          { label: 'المحفظة', icon: <Wallet className="h-5 w-5" />, href: '/admin/wallet' },
          { label: 'الإشعارات', icon: <Bell className="h-5 w-5" />, href: '/admin/notifications' },
          { label: 'رسائل واتساب', icon: <MessageCircle className="h-5 w-5" />, href: '/admin/whatsapp' },
          { label: 'شركات الشحن', icon: <Truck className="h-5 w-5" />, href: '/admin/shipping' },
          { label: 'سجل النظام', icon: <FileText className="h-5 w-5" />, href: '/admin/logs' },
        ];
      
      default:
        return [
          { label: 'لوحة التحكم', icon: <BarChart3 className="h-5 w-5" />, href: '/dashboard' },
          { label: 'المنتجات', icon: <Package className="h-5 w-5" />, href: '/products' },
          { label: 'الطلبات', icon: <ShoppingCart className="h-5 w-5" />, href: '/orders' },
          { label: 'الإعدادات', icon: <Settings className="h-5 w-5" />, href: '/settings' },
        ];
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      admin: 'مدير النظام',
      vendor: 'بائع',
      marketer: 'مسوق',
      wholesaler: 'تاجر جملة',
      customer: 'عميل',
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Settings className="h-6 w-6" />;
      case 'vendor':
        return <Store className="h-6 w-6" />;
      case 'marketer':
        return <BarChart3 className="h-6 w-6" />;
      case 'wholesaler':
        return <Package className="h-6 w-6" />;
      default:
        return <Users className="h-6 w-6" />;
    }
  };

  if (!session?.user) {
    return null;
  }

  const sidebarItems = getSidebarItems(session.user.role);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-primary-100 p-2 rounded-lg ml-3">
              {getRoleIcon(session.user.role)}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {getRoleDisplayName(session.user.role)}
              </h2>
              <p className="text-xs text-gray-500">{session.user.name}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-primary-700 hover:bg-primary-50 transition-colors duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="ml-3 text-gray-400 group-hover:text-primary-600">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gray-100 p-2 rounded-full ml-3">
                <Users className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:mr-64">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 mr-4">
                {title}
              </h1>
            </div>
            
            <div className="flex items-center space-x-reverse space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>
              
              {/* Messages */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg">
                <MessageCircle className="h-5 w-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-blue-400"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}