generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          Role      @default(USER)
  totpSecret    String?
  totpEnabled   Boolean   @default(false)
  language      String    @default("he")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  checklistItems UserChecklistItem[]
  trips         UserTrip[]
  quizResults   UserQuizResult[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  parentId String?
  order    Int       @default(0)
  parent   Category? @relation("CategoryParent", fields: [parentId], references: [id])
  children Category[] @relation("CategoryParent")
  articles Article[]

  @@map("categories")
}

model Article {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.Text
  excerpt     String?
  categoryId  String?
  tags        String[]
  status      String   @default("draft") // draft | published | hidden
  metaTitle   String?
  metaDesc    String?
  authorId    String?
  period      String?  // before | after | reserves | all
  readTime    Int      @default(5)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  category Category? @relation(fields: [categoryId], references: [id])

  @@map("articles")
}

model ChecklistItem {
  id          String   @id @default(cuid())
  title       String
  description String?
  period      String   // 3months | 1month | 1week | release_day | 1week_after
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())

  userItems UserChecklistItem[]

  @@map("checklist_items")
}

model UserChecklistItem {
  id          String   @id @default(cuid())
  userId      String
  itemId      String
  completed   Boolean  @default(false)
  completedAt DateTime?

  user User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  item ChecklistItem @relation(fields: [itemId], references: [id], onDelete: Cascade)

  @@unique([userId, itemId])
  @@map("user_checklist_items")
}

model TripDestination {
  id                  String  @id @default(cuid())
  name                String
  nameEn              String?
  region              String
  flag                String?
  avgFlightIls        Int     @default(0)
  avgAccommodationIls Int     @default(0)
  avgFoodDaily        Int     @default(0)
  avgTransportDaily   Int     @default(0)
  avgActivitiesDaily  Int     @default(0)
  bookingDestId       String?
  tips                String? @db.Text
  isActive            Boolean @default(true)

  trips UserTrip[]

  @@map("trip_destinations")
}

model UserTrip {
  id            String   @id @default(cuid())
  userId        String
  destinationId String
  durationDays  Int
  budgetTotal   Int
  notes         String?  @db.Text
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  destination TripDestination @relation(fields: [destinationId], references: [id])

  @@map("user_trips")
}

model Course {
  id           String  @id @default(cuid())
  name         String
  provider     String
  url          String
  domain       String
  durationWeeks Int?
  priceRange   String?
  description  String? @db.Text
  isActive     Boolean @default(true)

  @@map("courses")
}

model QuizQuestion {
  id            String   @id @default(cuid())
  questionText  String
  options       Json
  domainWeights Json
  order         Int      @default(0)

  @@map("quiz_questions")
}

model UserQuizResult {
  id                 String   @id @default(cuid())
  userId             String
  domainScores       Json
  recommendedCourses Json
  createdAt          DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_quiz_results")
}
