-- TopOn Database Migration
-- Generated from Prisma Schema

-- Enums
CREATE TYPE "Role" AS ENUM ('REVIEWER', 'ADVERTISER', 'ADMIN');
CREATE TYPE "CampaignType" AS ENUM ('AWARENESS', 'SALES', 'REVIEW', 'CHECKIN');
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED');
CREATE TYPE "ContentStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'LOCKED');
CREATE TYPE "ContentType" AS ENUM ('IMAGE', 'VIDEO', 'TEXT', 'LINK');
CREATE TYPE "TransactionType" AS ENUM ('TOPUP', 'ASSIGN', 'REFUND', 'WITHDRAW', 'SYSTEM');
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');
CREATE TYPE "Platform" AS ENUM ('FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'YOUTUBE');
CREATE TYPE "NotificationType" AS ENUM ('CAMPAIGN_INVITE', 'APPLICATION_APPROVED', 'APPLICATION_REJECTED', 'CONTENT_APPROVED', 'CONTENT_REJECTED', 'CONTENT_CHANGES_REQUESTED', 'PAYMENT_RECEIVED', 'WITHDRAWAL_PROCESSED', 'NEW_RATING', 'SYSTEM');

-- Users
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'REVIEWER',
    "googleId" TEXT,
    "facebookId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "twoFaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFaSecret" TEXT,
    "verifyToken" TEXT,
    "resetToken" TEXT,
    "resetTokenExp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");
CREATE UNIQUE INDEX "users_facebookId_key" ON "users"("facebookId");

-- Refresh Tokens
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- Profiles
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "fields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- Reviewer Profiles
CREATE TABLE "reviewer_profiles" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "igHandle" TEXT,
    "tiktokHandle" TEXT,
    "ytHandle" TEXT,
    "fbHandle" TEXT,
    "followersIg" INTEGER NOT NULL DEFAULT 0,
    "followersTiktok" INTEGER NOT NULL DEFAULT 0,
    "followersYt" INTEGER NOT NULL DEFAULT 0,
    "followersFb" INTEGER NOT NULL DEFAULT 0,
    "engagementRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalCampaigns" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reviewer_profiles_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "reviewer_profiles_userId_key" ON "reviewer_profiles"("userId");

-- Advertiser Profiles
CREATE TABLE "advertiser_profiles" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "companyName" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "description" TEXT,
    "industry" TEXT,
    "taxCode" TEXT,
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "advertiser_profiles_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "advertiser_profiles_userId_key" ON "advertiser_profiles"("userId");

-- Campaigns
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "advertiserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "CampaignType" NOT NULL DEFAULT 'REVIEW',
    "objectives" TEXT,
    "contentRequirements" TEXT,
    "budgetTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "budgetPerReviewer" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxReviewers" INTEGER NOT NULL DEFAULT 10,
    "deadline" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "platforms" "Platform"[] DEFAULT ARRAY[]::"Platform"[],
    "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverUrl" TEXT,
    "productImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- Campaign Applications
CREATE TABLE "campaign_applications" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "campaignId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "campaign_applications_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "campaign_applications_campaignId_reviewerId_key" ON "campaign_applications"("campaignId", "reviewerId");

-- Campaign Contents
CREATE TABLE "campaign_contents" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "applicationId" TEXT NOT NULL,
    "contentUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "contentType" "ContentType" NOT NULL DEFAULT 'IMAGE',
    "caption" TEXT,
    "link" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'SUBMITTED',
    "reviewNotes" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "campaign_contents_pkey" PRIMARY KEY ("id")
);

-- Content Approval Logs
CREATE TABLE "content_approval_logs" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "contentId" TEXT NOT NULL,
    "action" "ContentStatus" NOT NULL,
    "note" TEXT,
    "by" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "content_approval_logs_pkey" PRIMARY KEY ("id")
);

-- Wallets
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lockedBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "wallets_userId_key" ON "wallets"("userId");

-- Wallet Transactions
CREATE TABLE "wallet_transactions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "walletId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "balanceAfter" DOUBLE PRECISION NOT NULL,
    "referenceId" TEXT,
    "description" TEXT,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- Budget Allocations
CREATE TABLE "budget_allocations" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "campaignId" TEXT NOT NULL,
    "allocatedAmt" DOUBLE PRECISION NOT NULL,
    "usedAmt" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "budget_allocations_pkey" PRIMARY KEY ("id")
);

-- Withdrawal Requests
CREATE TABLE "withdrawal_requests" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "walletId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "accountName" TEXT,
    "paypalEmail" TEXT,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "withdrawal_requests_pkey" PRIMARY KEY ("id")
);

-- Ratings
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "campaignId" TEXT,
    "stars" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ratings_fromUserId_toUserId_campaignId_key" ON "ratings"("fromUserId", "toUserId", "campaignId");

-- Bookmarks
CREATE TABLE "bookmarks" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "advertiserId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "bookmarks_advertiserId_reviewerId_key" ON "bookmarks"("advertiserId", "reviewerId");

-- Notifications
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- Blog Posts
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "coverUrl" TEXT,
    "category" TEXT NOT NULL,
    "author" TEXT,
    "publishedAt" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- Tips Guides
CREATE TABLE "tips_guides" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tips_guides_pkey" PRIMARY KEY ("id")
);

-- Foreign Keys
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "reviewer_profiles" ADD CONSTRAINT "reviewer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "advertiser_profiles" ADD CONSTRAINT "advertiser_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "advertiser_profiles"("id") ON DELETE CASCADE;
ALTER TABLE "campaign_applications" ADD CONSTRAINT "campaign_applications_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE;
ALTER TABLE "campaign_applications" ADD CONSTRAINT "campaign_applications_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "reviewer_profiles"("id") ON DELETE CASCADE;
ALTER TABLE "campaign_contents" ADD CONSTRAINT "campaign_contents_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "campaign_applications"("id") ON DELETE CASCADE;
ALTER TABLE "content_approval_logs" ADD CONSTRAINT "content_approval_logs_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "campaign_contents"("id") ON DELETE CASCADE;
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE;
ALTER TABLE "budget_allocations" ADD CONSTRAINT "budget_allocations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE;
ALTER TABLE "withdrawal_requests" ADD CONSTRAINT "withdrawal_requests_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("id") ON DELETE CASCADE;
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "reviewer_profiles"("id") ON DELETE CASCADE;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
