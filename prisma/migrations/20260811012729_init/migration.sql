-- CreateTable
CREATE TABLE "DatasetVersion" (
    "id" SERIAL NOT NULL,
    "version" TEXT NOT NULL,
    "gameVersion" TEXT,
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DatasetVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Digimon" (
    "id" SERIAL NOT NULL,
    "fieldGuideNo" INTEGER,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "attribute" TEXT NOT NULL,
    "type" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "basePersonality" TEXT,
    "ridable" BOOLEAN,
    "hp1" INTEGER,
    "sp1" INTEGER,
    "atk1" INTEGER,
    "def1" INTEGER,
    "int1" INTEGER,
    "spi1" INTEGER,
    "speed1" INTEGER,
    "hp99" INTEGER,
    "sp99" INTEGER,
    "atk99" INTEGER,
    "def99" INTEGER,
    "int99" INTEGER,
    "spi99" INTEGER,
    "speed99" INTEGER,
    "isDlc" BOOLEAN NOT NULL DEFAULT false,
    "dlcWave" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Digimon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evolution" (
    "id" SERIAL NOT NULL,
    "fromDigimonId" INTEGER NOT NULL,
    "toDigimonId" INTEGER NOT NULL,
    "level" INTEGER,
    "hp" INTEGER,
    "sp" INTEGER,
    "atk" INTEGER,
    "def" INTEGER,
    "int" INTEGER,
    "spi" INTEGER,
    "speed" INTEGER,
    "talent" INTEGER,
    "bond" INTEGER,
    "agentRank" INTEGER,
    "special" TEXT,
    "method" TEXT NOT NULL DEFAULT 'digivolution',
    "sourceNote" TEXT,

    CONSTRAINT "Evolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collection" JSONB NOT NULL DEFAULT '[]',
    "team" JSONB NOT NULL DEFAULT '[]',
    "favorites" JSONB NOT NULL DEFAULT '[]',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DatasetVersion_version_key" ON "DatasetVersion"("version");

-- CreateIndex
CREATE UNIQUE INDEX "Digimon_fieldGuideNo_key" ON "Digimon"("fieldGuideNo");

-- CreateIndex
CREATE UNIQUE INDEX "Digimon_name_key" ON "Digimon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Digimon_slug_key" ON "Digimon"("slug");

-- CreateIndex
CREATE INDEX "Digimon_stage_idx" ON "Digimon"("stage");

-- CreateIndex
CREATE INDEX "Digimon_attribute_idx" ON "Digimon"("attribute");

-- CreateIndex
CREATE INDEX "Digimon_type_idx" ON "Digimon"("type");

-- CreateIndex
CREATE INDEX "Evolution_fromDigimonId_idx" ON "Evolution"("fromDigimonId");

-- CreateIndex
CREATE INDEX "Evolution_toDigimonId_idx" ON "Evolution"("toDigimonId");

-- CreateIndex
CREATE UNIQUE INDEX "Evolution_fromDigimonId_toDigimonId_key" ON "Evolution"("fromDigimonId", "toDigimonId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserState_userId_key" ON "UserState"("userId");

-- AddForeignKey
ALTER TABLE "Evolution" ADD CONSTRAINT "Evolution_fromDigimonId_fkey" FOREIGN KEY ("fromDigimonId") REFERENCES "Digimon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evolution" ADD CONSTRAINT "Evolution_toDigimonId_fkey" FOREIGN KEY ("toDigimonId") REFERENCES "Digimon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserState" ADD CONSTRAINT "UserState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
