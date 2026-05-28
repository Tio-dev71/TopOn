import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin
  const adminPass = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@topon.vn' },
    update: {},
    create: {
      email: 'admin@topon.vn',
      passwordHash: adminPass,
      role: 'ADMIN',
      isVerified: true,
      profile: { create: { fullName: 'TopOn Admin', avatarUrl: null } },
      wallet: { create: {} },
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create sample Advertiser
  const advPass = await bcrypt.hash('Test@123456', 12);
  const advertiser = await prisma.user.upsert({
    where: { email: 'brand@demo.vn' },
    update: {},
    create: {
      email: 'brand@demo.vn',
      passwordHash: advPass,
      role: 'ADVERTISER',
      isVerified: true,
      profile: { create: { fullName: 'Demo Brand' } },
      advertiserProfile: {
        create: {
          companyName: 'Demo Brand Vietnam',
          website: 'https://demo.vn',
          description: 'Thương hiệu làm đẹp hàng đầu Việt Nam',
          industry: 'Làm đẹp',
        },
      },
      wallet: { create: { balance: 50000000 } },
    },
  });
  console.log('✅ Advertiser created:', advertiser.email);

  // Create multiple sample Reviewers
  const reviewersData = [
    { email: 'reviewer@demo.vn', name: 'Nguyễn Thị Review', handle: '@nguyenreview', folIg: 25000, folTt: 80000, rate: 4.8 },
    { email: 'koc_beauty@demo.vn', name: 'Lê Beauty', handle: '@lebeauty_official', folIg: 15000, folTt: 120000, rate: 4.5 },
    { email: 'travel_boy@demo.vn', name: 'Trần Travel', handle: '@trantravel', folIg: 45000, folTt: 20000, rate: 4.9 },
    { email: 'foodie_vn@demo.vn', name: 'Vũ Foodie', handle: '@vufoodie', folIg: 60000, folTt: 300000, rate: 4.7 },
  ];

  for (const r of reviewersData) {
    const rPass = await bcrypt.hash('Test@123456', 12);
    await prisma.user.upsert({
      where: { email: r.email },
      update: {},
      create: {
        email: r.email,
        passwordHash: rPass,
        role: 'REVIEWER',
        isVerified: true,
        profile: { create: { fullName: r.name, city: 'Hồ Chí Minh', fields: ['Làm đẹp', 'Du lịch', 'Ẩm thực'] } },
        reviewerProfile: {
          create: {
            igHandle: r.handle,
            tiktokHandle: `${r.handle}_tiktok`,
            followersIg: r.folIg,
            followersTiktok: r.folTt,
            engagementRate: 4.5,
            specialties: ['Làm đẹp', 'Skincare', 'Du lịch', 'Ẩm thực'],
            avgRating: r.rate,
            totalCampaigns: Math.floor(Math.random() * 50),
          },
        },
        wallet: { create: { balance: 5000000 } },
      },
    });
  }
  console.log('✅ Reviewers created');

  // Create sample campaigns
  const advProfile = await prisma.advertiserProfile.findUnique({ where: { userId: advertiser.id } });
  if (advProfile) {
    const campaigns = [
      {
        title: 'Review Serum dưỡng sáng mùa hè',
        description: 'Tìm kiếm reviewer đánh giá sản phẩm serum dưỡng ẩm mới nhất. Cần nội dung chân thực và sáng tạo.',
        type: 'REVIEW' as const,
        budgetTotal: 20000000,
        budgetPerReviewer: 1500000,
        maxReviewers: 15,
        deadline: new Date('2025-06-30'),
        platforms: ['INSTAGRAM', 'TIKTOK'] as any[],
        categories: ['Làm đẹp', 'Skincare'],
        status: 'ACTIVE' as const,
        isFeatured: true,
      },
      {
        title: 'Check-in resort nghỉ dưỡng cao cấp',
        description: 'Trải nghiệm và đánh giá resort 5 sao tại Phú Quốc. Nội dung ảnh + video chất lượng cao.',
        type: 'CHECKIN' as const,
        budgetTotal: 30000000,
        budgetPerReviewer: 10000000,
        maxReviewers: 3,
        deadline: new Date('2025-07-15'),
        platforms: ['INSTAGRAM', 'YOUTUBE'] as any[],
        categories: ['Du lịch', 'Lifestyle'],
        status: 'ACTIVE' as const,
        isFeatured: true,
      },
      {
        title: 'Nồi chiên không dầu đa năng',
        description: 'Review sản phẩm nồi chiên không dầu mới nhất. Ưu tiên reviewer chuyên về đồ gia dụng, nấu ăn.',
        type: 'REVIEW' as const,
        budgetTotal: 15000000,
        budgetPerReviewer: 2000000,
        maxReviewers: 8,
        deadline: new Date('2025-06-20'),
        platforms: ['TIKTOK', 'YOUTUBE'] as any[],
        categories: ['Nhà bếp', 'Đồ gia dụng'],
        status: 'ACTIVE' as const,
        isFeatured: false,
      },
    ];

    for (const campaign of campaigns) {
      await prisma.campaign.create({
        data: { ...campaign, advertiserId: advProfile.id },
      });
    }
    console.log('✅ Sample campaigns created');
  }

  // Create blog posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Top 5 Influencer Marketing 2025 cho review TikTok',
        slug: 'top-5-influencer-marketing-2025-tiktok',
        excerpt: 'Khám phá những xu hướng influencer marketing hot nhất năm 2025 trên TikTok.',
        content: '<p>Nội dung bài viết...</p>',
        category: 'Chiến lược',
        author: 'TopOn Team',
        isPublished: true,
        publishedAt: new Date(),
        coverUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800',
      },
      {
        title: 'Bí quyết tăng engagement cho reviewer TikTok',
        slug: 'bi-quyet-tang-engagement-tiktok-reviewer',
        excerpt: 'Học cách tăng tỷ lệ tương tác và thu hút thương hiệu trên TikTok.',
        content: '<p>Nội dung bài viết...</p>',
        category: 'Hướng dẫn',
        author: 'TopOn Team',
        isPublished: true,
        publishedAt: new Date(),
        coverUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800',
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Blog posts seeded');

  // Create tips
  await prisma.tipsGuide.createMany({
    data: [
      { title: 'Cách viết caption hấp dẫn', content: '...', category: 'Nội dung', order: 1 },
      { title: 'Tối ưu hashtag TikTok', content: '...', category: 'TikTok', order: 1 },
      { title: 'Chụp ảnh sản phẩm chuyên nghiệp', content: '...', category: 'Nhiếp ảnh', order: 1 },
      { title: 'Cách đàm phán giá với brand', content: '...', category: 'Kinh doanh', order: 1 },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Tips seeded');

  console.log('\n🎉 Seed completed!');
  console.log('📧 Admin: admin@topon.vn / Admin@123456');
  console.log('📧 Advertiser: brand@demo.vn / Test@123456');
  console.log('📧 Reviewer: reviewer@demo.vn / Test@123456');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
