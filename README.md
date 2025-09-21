# Tra-verse: Your Trip, Your Way

**Tra-verse** is a premium AI-powered travel planning platform that creates personalized, optimized itineraries tailored perfectly to your style and interests. Built with Next.js 15, TypeScript, and modern web technologies.

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Itineraries**: Google Gemini integration for intelligent trip planning
- **Mobile-First Design**: Responsive UI with cosmic gradient themes
- **Multi-Step Onboarding**: Intuitive form wizard for trip preferences
- **Real-Time Status**: Async job processing with progress tracking
- **Interactive Components**: Smooth animations with Framer Motion

### 🛠️ Technical Stack
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes, Node.js
- **AI**: Google Gemini API with retry logic and validation
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: BullMQ + Redis for async processing
- **UI**: Framer Motion, Heroicons, custom animations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis (for job queue)
- Google Gemini API key

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file with:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/traverse"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

3. **Set up the database:**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push
```

4. **Start the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
tra-verse/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   └── trips/         # Trip-related endpoints
│   │   ├── globals.css        # Global styles & animations
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx          # Landing page
│   │   └── plan/             # Onboarding form
│   ├── lib/                   # Utility libraries
│   │   ├── database.ts       # Prisma database operations
│   │   ├── gemini-service.ts # Gemini AI integration
│   │   ├── job-queue.ts      # BullMQ queue management
│   │   ├── validation.ts     # Zod validation schemas
│   │   └── gemini-prompts.ts # AI prompt templates
│   └── types/                # TypeScript type definitions
│       └── index.ts
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

## 🎨 Design System

### Color Palette
- **Primary**: Deep navy/indigo gradients
- **Accent A**: Teal (#00c2a8) for CTAs
- **Accent B**: Galactic purple (#7c5cff) for highlights
- **Cosmic Theme**: Subtle gradients with glassmorphism effects

### Typography
- **Headings**: Inter/Poppins with gradient text effects
- **Body**: Geist font family (optimized loading)

### Animations
- **Framer Motion**: Page transitions and micro-interactions
- **Custom CSS**: Blob animations and gradient shifts
- **Loading States**: Skeleton animations and progress indicators

## 🔧 API Endpoints

### Trip Management
- `POST /api/trips` - Create new trip request
- `GET /api/trips/[id]` - Get completed itinerary
- `GET /api/trips/[id]/status` - Check generation progress
- `PUT /api/trips/[id]` - Regenerate/update itinerary

### Current Implementation Status
- ✅ Trip creation with validation
- ✅ Status polling endpoint
- ✅ Gemini AI integration with error handling
- ✅ Job queue system for async processing
- ✅ Comprehensive TypeScript types
- ✅ Database schema with Prisma

## 🚧 Development Roadmap

### Phase 1 (Current) - Foundation ✅
- [x] Project setup with modern dependencies
- [x] TypeScript type definitions
- [x] Database schema design
- [x] Gemini AI integration
- [x] Job queue implementation
- [x] Landing page with cosmic design
- [x] Multi-step onboarding form

### Phase 2 - Core Features (Next)
- [ ] Itinerary display components
- [ ] Interactive map integration
- [ ] Drag-and-drop editing
- [ ] User authentication
- [ ] Booking integrations

### Phase 3 - Advanced Features
- [ ] Real-time collaboration
- [ ] Social features
- [ ] Advanced personalization
- [ ] Mobile app development

## 🔒 Security & Best Practices

### Implemented
- **Input Validation**: Zod schemas for all API inputs
- **Rate Limiting**: Built into Gemini service
- **Error Handling**: Comprehensive error boundaries
- **Type Safety**: Full TypeScript coverage

### Planned
- **Authentication**: JWT-based user sessions
- **API Security**: Request signing and validation
- **Data Privacy**: PII masking and GDPR compliance
- **Monitoring**: Sentry integration and logging

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# E2E testing (when implemented)
npm run test:e2e

# Visual regression (when implemented)
npm run test:visual
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel with environment variables
```

### Self-Hosted
```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Setup
- **Database**: Vercel Postgres or self-hosted PostgreSQL
- **Redis**: Upstash Redis or self-hosted
- **File Storage**: Vercel Blob or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini** for AI-powered itinerary generation
- **Vercel** for the amazing Next.js platform
- **Tailwind CSS** for the utility-first styling approach
- **Framer Motion** for beautiful animations

---

## 🚀 SEO Optimization

Tra Verse is fully optimized for search engines with comprehensive SEO implementation:

### ✅ Implemented Features

#### **1. SEO Metadata**
- **Title Tag**: "Tra-verse: Your Trip, Your Way." (28 characters)
- **Meta Description**: "Adventure on your terms with travel plans tailored perfectly to your style and interests!" (89 characters)
- **Keywords**: AI travel planning, personalized itineraries, smart travel maps, instant booking
- **Canonical URLs**: Implemented for proper indexing
- **Robots Meta**: Optimized for search engine crawling

#### **2. Social Media Sharing**
- **Open Graph Tags**: Complete OG implementation for Facebook, LinkedIn
- **Title**: "Tra-verse: Your Trip, Your Way."
- **Description**: "Adventure on your terms with travel plans tailored perfectly to your style and interests!"
- **Twitter Cards**: Summary Large Image cards for Twitter/X
- **Image Optimization**: 1200x630 social sharing image
- **Rich Previews**: Enhanced link previews across all platforms

#### **3. Technical SEO**
- **Structured Data**: JSON-LD schema for WebApplication
- **Mobile Optimization**: Responsive design with proper viewport
- **Performance**: Optimized images, preloading, DNS prefetching
- **Accessibility**: Proper alt texts, semantic HTML, ARIA labels

#### **4. Favicon Implementation**
- **Multi-format Favicons**: ICO, PNG, SVG formats
- **Device-Specific Icons**: Apple Touch, Android Chrome, Windows Tiles
- **Safari Integration**: Pinned tab support
- **Web App Manifest**: PWA-ready configuration

### 🛠️ SEO Setup Instructions

#### **Favicon Generation**
```bash
# Generate all favicon sizes for different screens
npm run seo:generate-favicons

# This creates 35+ different icon sizes:
# ✅ Standard Favicons: 16x16, 32x32, 48x48 (favicon.ico)
# ✅ Apple Touch Icons: 57x57 to 1024x1024 (iOS devices)
# ✅ Android Chrome: 36x36 to 512x512 (Android devices)
# ✅ Microsoft Tiles: 70x70 to 558x558 (Windows tiles)
# ✅ Safari Pinned Tab: Monochrome SVG for Safari bookmarks
# ✅ General Purpose: 24x24 to 512x512 (various devices)
```

#### **Image Optimization**
```bash
# Install image optimization tools
npm install -g imagemin-cli

# Optimize images
imagemin public/tra-verse.jpg --out-dir=public --plugin=mozjpeg
```

#### **SEO Verification**
```bash
# Run SEO checks
npm run seo:check

# Lighthouse audit
npm run seo:lighthouse
```

#### **Search Console Setup**
1. **Google Search Console**:
   - Add property: `https://tra-verse.com`
   - Upload HTML verification file
   - Submit sitemap: `https://tra-verse.com/sitemap.xml`

2. **Bing Webmaster Tools**:
   - Add site and verify ownership
   - Submit sitemap

#### **Analytics Integration**
```javascript
// Add to _app.js or layout.tsx
// Google Analytics
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

// Microsoft Clarity
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
</script>
```

### 📊 SEO Performance Targets

- **Lighthouse Score**: >90 (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: All metrics in green
- **Mobile Usability**: 100/100
- **Page Speed**: <3 seconds load time
- **Search Rankings**: Target top 10 for "AI travel planning"

### 🔍 SEO Monitoring

#### **Key Metrics to Track**
- Organic search traffic
- Keyword rankings
- Click-through rates
- Conversion rates
- Bounce rates

#### **Tools**
- **Google Search Console**: Search performance, indexing status
- **Google Analytics**: User behavior, conversions
- **Screaming Frog**: Technical SEO audits
- **Ahrefs/Moz**: Backlink monitoring, competitor analysis

### 🎯 Content Strategy

#### **Target Keywords**
- Primary: "AI travel planning", "personalized travel itineraries"
- Secondary: "smart travel maps", "instant booking travel"
- Long-tail: "AI-powered trip planning app", "automated itinerary generator"

#### **Content Optimization**
- **Headers**: H1, H2, H3 properly structured
- **Internal Linking**: Strategic cross-linking between pages
- **Image Alt Texts**: Descriptive with keywords
- **Meta Descriptions**: Unique per page, under 160 characters

---

**Built with ❤️ for travel enthusiasts worldwide**
# tra-verse
 
 