const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arabic-ecommerce';

// User schema (simplified for seeding)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'vendor', 'marketer', 'wholesaler', 'customer'],
    default: 'customer',
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedAdminUser() {
  try {
    console.log('🔗 جاري الاتصال بقاعدة البيانات...');
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@platform.com' });
    
    if (existingAdmin) {
      console.log('⚠️  المستخدم المدير موجود بالفعل');
      console.log(`📧 البريد الإلكتروني: ${existingAdmin.email}`);
      console.log(`👤 الاسم: ${existingAdmin.name}`);
      console.log(`🔑 الدور: ${existingAdmin.role}`);
      console.log(`✅ الحالة: ${existingAdmin.isActive ? 'نشط' : 'غير نشط'}`);
      return;
    }

    // Hash the password
    console.log('🔐 جاري تشفير كلمة المرور...');
    const hashedPassword = await bcrypt.hash('Admin@123', 12);

    // Create admin user
    console.log('👤 جاري إنشاء المستخدم المدير...');
    const adminUser = new User({
      name: 'مدير النظام',
      email: 'admin@platform.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+966500000000',
      address: {
        street: 'شارع الملك فهد',
        city: 'الرياض',
        state: 'منطقة الرياض',
        zipCode: '12345',
        country: 'المملكة العربية السعودية',
      },
      isActive: true,
    });

    await adminUser.save();

    console.log('🎉 تم إنشاء المستخدم المدير بنجاح!');
    console.log('📋 تفاصيل المستخدم المدير:');
    console.log(`👤 الاسم: ${adminUser.name}`);
    console.log(`📧 البريد الإلكتروني: ${adminUser.email}`);
    console.log(`🔑 كلمة المرور: Admin@123`);
    console.log(`🎭 الدور: ${adminUser.role}`);
    console.log(`📱 رقم الهاتف: ${adminUser.phone}`);
    console.log(`✅ الحالة: ${adminUser.isActive ? 'نشط' : 'غير نشط'}`);
    console.log(`📅 تاريخ الإنشاء: ${adminUser.createdAt}`);
    console.log('');
    console.log('🔐 معلومات تسجيل الدخول:');
    console.log('   البريد الإلكتروني: admin@platform.com');
    console.log('   كلمة المرور: Admin@123');
    console.log('');
    console.log('🚀 يمكنك الآن تسجيل الدخول إلى لوحة الإدارة!');

  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم المدير:', error.message);
    
    if (error.code === 11000) {
      console.error('💡 السبب: البريد الإلكتروني موجود بالفعل');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 تم قطع الاتصال بقاعدة البيانات');
    process.exit(0);
  }
}

// Run the seed function
console.log('🌱 بدء عملية إنشاء المستخدم المدير...');
console.log('=====================================');
seedAdminUser();