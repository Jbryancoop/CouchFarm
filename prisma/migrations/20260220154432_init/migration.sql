-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'sales',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Couch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "fabricType" TEXT NOT NULL,
    "length" REAL,
    "width" REAL,
    "height" REAL,
    "notes" TEXT,
    "buyPrice" REAL,
    "sellPrice" REAL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CouchImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "couchId" TEXT NOT NULL,
    CONSTRAINT "CouchImage_couchId_fkey" FOREIGN KEY ("couchId") REFERENCES "Couch" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerInquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "preferredStyle" TEXT,
    "preferredColor" TEXT,
    "hasSleeper" BOOLEAN NOT NULL DEFAULT false,
    "hasReclining" BOOLEAN NOT NULL DEFAULT false,
    "budgetMin" REAL,
    "budgetMax" REAL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BuyRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "brand" TEXT,
    "style" TEXT,
    "color" TEXT,
    "condition" TEXT,
    "age" TEXT,
    "askingPrice" REAL,
    "description" TEXT,
    "images" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MarketingLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "destination" TEXT NOT NULL DEFAULT '/inventory',
    "platform" TEXT,
    "campaign" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "leads" INTEGER NOT NULL DEFAULT 0,
    "sales" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "couchId" TEXT,
    "couchTitle" TEXT NOT NULL,
    "sellPrice" REAL NOT NULL,
    "buyPrice" REAL,
    "paymentMethod" TEXT NOT NULL,
    "soldBy" TEXT,
    "customerName" TEXT,
    "notes" TEXT,
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingLink_slug_key" ON "MarketingLink"("slug");
