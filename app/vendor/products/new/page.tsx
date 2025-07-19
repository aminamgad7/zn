'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Package,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Tag,
  FileText,
  Save,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  marketerPrice: string;
  wholesalePrice: string;
  category: string;
  images: string[];
  sku: string;
  quantity: string;
  minQuantity: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    marketerPrice: '',
    wholesalePrice: '',
    category: '',
    images: [],
    sku: '',
    quantity: '',
    minQuantity: '1',
  });

  // Sample categories (in real app, fetch from API)
  const categories: Category[] = [
    { _id: '1', name: 'إلكترونيات', slug: 'electronics' },
    { _id: '2', name: 'ملابس', slug: 'clothing' },
    { _id: '3', name: 'إكسسوارات', slug: 'accessories' },
    { _id: '4', name: 'حقائب', slug: 'bags' },
    { _id: '5', name: 'كتب', slug: 'books' },
    { _id: '6', name: 'رياضة', slug: 'sports' },
    { _id: '7', name: 'منزل وحديقة', slug: 'home-garden' },
    { _id: '8', name: 'جمال وعناية', slug: 'beauty' },
  ];

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a cloud service like Cloudinary or AWS S3
      // For now, we'll create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setImagePreview(imageUrl);
        setFormData(prev => ({
          ...prev,
          images: [imageUrl]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      images: []
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('اسم المنتج مطلوب');
      return false;
    }
    if (!formData.description.trim()) {
      setError('وصف المنتج مطلوب');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('السعر يجب أن يكون أكبر من صفر');
      return false;
    }
    if (!formData.marketerPrice || parseFloat(formData.marketerPrice) <= 0) {
      setError('سعر المسوق يجب أن يكون أكبر من صفر');
      return false;
    }
    if (!formData.wholesalePrice || parseFloat(formData.wholesalePrice) <= 0) {
      setError('سعر تاجر الجملة يجب أن يكون أكبر من صفر');
      return false;
    }
    if (!formData.category) {
      setError('التصنيف مطلوب');
      return false;
    }
    if (!formData.sku.trim()) {
      setError('رمز المنتج مطلوب');
      return false;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      setError('الكمية يجب أن تكون أكبر من أو تساوي صفر');
      return false;
    }
    if (formData.images.length === 0) {
      setError('صورة المنتج مطلوبة');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        marketerPrice: parseFloat(formData.marketerPrice),
        wholesalePrice: parseFloat(formData.wholesalePrice),
        category: formData.category,
        vendor: session?.user?.id,
        images: formData.images,
        sku: formData.sku.trim(),
        quantity: parseInt(formData.quantity),
        minQuantity: parseInt(formData.minQuantity),
        isActive: true,
        isFeatured: false,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('تم إضافة المنتج بنجاح!');
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          marketerPrice: '',
          wholesalePrice: '',
          category: '',
          images: [],
          sku: '',
          quantity: '',
          minQuantity: '1',
        });
        setImagePreview('');
        
        // Redirect to products list after 2 seconds
        setTimeout(() => {
          router.push('/vendor/products');
        }, 2000);
      } else {
        setError(result.message || 'حدث خطأ في إضافة المنتج');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="إضافة منتج جديد">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-full ml-4">
                <Package className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">إضافة منتج جديد</h2>
                <p className="text-gray-600">أضف منتجاً جديداً إلى متجرك</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/vendor/products')}
              className="btn-secondary flex items-center"
            >
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة للمنتجات
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alerts */}
          {error && (
            <div className="card border-red-200 bg-red-50">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 ml-2 flex-shrink-0" />
                <div className="text-red-700">{error}</div>
              </div>
            </div>
          )}

          {success && (
            <div className="card border-green-200 bg-green-50">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 ml-2 flex-shrink-0" />
                <div className="text-green-700">{success}</div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <FileText className="h-5 w-5 ml-2" />
              المعلومات الأساسية
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنتج *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="input-field"
                  placeholder="أدخل اسم المنتج"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">
                  رمز المنتج (SKU) *
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  required
                  className="input-field"
                  placeholder="مثال: PROD-001"
                  value={formData.sku}
                  onChange={handleInputChange}
                  dir="ltr"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  وصف المنتج *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  className="input-field"
                  placeholder="أدخل وصفاً مفصلاً للمنتج"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  التصنيف *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="input-field"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">اختر التصنيف</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  الكمية المتوفرة *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  required
                  min="0"
                  className="input-field"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <DollarSign className="h-5 w-5 ml-2" />
              الأسعار
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  السعر الأساسي (ر.س) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500 mt-1">سعر البيع للعملاء العاديين</p>
              </div>

              <div>
                <label htmlFor="marketerPrice" className="block text-sm font-medium text-gray-700 mb-2">
                  سعر المسوق (ر.س) *
                </label>
                <input
                  type="number"
                  id="marketerPrice"
                  name="marketerPrice"
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                  value={formData.marketerPrice}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500 mt-1">السعر الخاص للمسوقين</p>
              </div>

              <div>
                <label htmlFor="wholesalePrice" className="block text-sm font-medium text-gray-700 mb-2">
                  سعر تاجر الجملة (ر.س) *
                </label>
                <input
                  type="number"
                  id="wholesalePrice"
                  name="wholesalePrice"
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                  value={formData.wholesalePrice}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-gray-500 mt-1">السعر الخاص لتجار الجملة</p>
              </div>
            </div>

            {/* Price Comparison */}
            {formData.price && formData.marketerPrice && formData.wholesalePrice && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">مقارنة الأسعار:</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">العملاء: </span>
                    <span className="font-medium">{parseFloat(formData.price).toFixed(2)} ر.س</span>
                  </div>
                  <div>
                    <span className="text-blue-700">المسوقين: </span>
                    <span className="font-medium">{parseFloat(formData.marketerPrice).toFixed(2)} ر.س</span>
                    {formData.price && (
                      <span className="text-green-600 text-xs mr-1">
                        (وفر {(((parseFloat(formData.price) - parseFloat(formData.marketerPrice)) / parseFloat(formData.price)) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-blue-700">تجار الجملة: </span>
                    <span className="font-medium">{parseFloat(formData.wholesalePrice).toFixed(2)} ر.س</span>
                    {formData.price && (
                      <span className="text-green-600 text-xs mr-1">
                        (وفر {(((parseFloat(formData.price) - parseFloat(formData.wholesalePrice)) / parseFloat(formData.price)) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <ImageIcon className="h-5 w-5 ml-2" />
              صورة المنتج
            </h3>

            <div className="space-y-4">
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-gray-600">اسحب وأفلت صورة هنا، أو</p>
                    <label htmlFor="image-upload" className="btn-primary cursor-pointer inline-block">
                      اختر صورة
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF حتى 10MB
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="معاينة المنتج"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 left-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                * الحقول المطلوبة
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.push('/vendor/products')}
                  className="btn-secondary"
                  disabled={loading}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 ml-2" />
                      حفظ المنتج
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}