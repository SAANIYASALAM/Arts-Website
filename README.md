# Layatharang & Chakravyuh 2026

College Arts and Sports Festival Management System for Model Engineering College

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## 🎯 Features

### ✅ Implemented
- **Multi-role Authentication**: Admin and House Captain roles with Supabase Auth
- **Event Management**: Create and manage Arts and Sports events with custom point values
- **Student Database**: Organize students by house with class and year information
- **Live Leaderboard**: Real-time house scores calculated from competition results
- **Row Level Security**: Secure data access based on user roles and house assignments
- **Responsive UI**: Mobile-friendly interface with Tailwind CSS and Shadcn/UI
- **Server Actions**: Secure form submissions without API routes

### 🔄 Coming Soon
- **Student Registration**: Interactive forms to register students for events with validation
- **Winner Entry**: Admin interface to record competition results
- **Real-time Updates**: Supabase Realtime for instant leaderboard updates
- **Advanced Analytics**: Detailed statistics and reports

## 📊 Participation Limits

The system enforces the following participation limits automatically:
- **Arts Individual Events**: 4 per student (participant)
- **Arts Group Events**: 2 per student (participant)
- **Sports Individual Events**: 3 per student
- **Sports Team Events**: 2 per student

*Note: Accompanists in arts events do NOT count toward these limits.*

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI components
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth with RLS
- **Form Handling**: React Hook Form + Zod (planned)
- **Real-time**: Supabase Realtime (planned)

## 📁 Project Structure

```
/app
  /(auth)
    /login              # Login page with authentication
  /(dashboard)
    /admin
      /events           # Event management (Admin only)
      /results          # Winner entry (Admin only)
    /captain
      /my-house         # House dashboard (Captain)
      /register         # Student registration (Captain)
  /leaderboard          # Public leaderboard
  
/components
  /ui                   # Shadcn UI components
  
/lib
  /supabase            # Supabase client/server configs
  /utils               # Utility functions and validation
  /types               # TypeScript type definitions
  
/database
  schema.sql           # Complete PostgreSQL schema with RLS
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account (free tier works)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/SAANIYASALAM/Arts-Website.git
cd Arts-Website
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your Project URL and anon key
   - Run the SQL from `database/schema.sql` in the Supabase SQL Editor

4. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📖 Detailed Setup

See [SETUP.md](./SETUP.md) for comprehensive setup instructions including:
- Database initialization
- Sample data creation
- User role configuration
- Troubleshooting guide

## 📊 Database Schema

The database includes:
- **Houses**: College houses/teams
- **Users**: Authentication and user roles (Admin/Captain)
- **Students**: Student information linked to houses
- **Arts_Events** & **Sports_Events**: Event definitions with point values
- **Arts_Registrations** & **Sports_Registrations**: Event registrations
- **Arts_Reg_Details** & **Sports_Reg_Details**: Registration participants
- **Arts_Winners** & **Sports_Winners**: Competition results

All tables have Row Level Security (RLS) policies to ensure proper data access.

## 🔐 Security

- **Row Level Security (RLS)** ensures users only access authorized data
- **Server Actions** handle all data mutations securely
- **House Captains** can only view/manage their house students
- **Admins** have full system access
- **Public users** can only view the leaderboard

## 🎨 User Flows

### Admin Workflow
1. Login with admin credentials
2. Navigate to Events page
3. Create Arts and Sports events with point values
4. After competitions, enter winners via Results page
5. Monitor overall leaderboard

### House Captain Workflow
1. Login with captain credentials
2. View house students on "My House" page
3. Navigate to "Register Students"
4. Register students for events (system validates limits)
5. Track house performance on leaderboard

### Public Access
- Anyone can view the live leaderboard
- See event lists and competition results
- No login required

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 Implementation Status

See [IMPLEMENTATION.md](./IMPLEMENTATION.md) for detailed status of all features, what's implemented, and what's planned.

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **SAANIYASALAM** - [GitHub Profile](https://github.com/SAANIYASALAM)

## 🙏 Acknowledgments

- Model Engineering College
- Layatharang organizing team
- Chakravyuh organizing team
- All contributors and participants

## 📞 Support

For issues and questions:
1. Check [SETUP.md](./SETUP.md) for setup help
2. Review [IMPLEMENTATION.md](./IMPLEMENTATION.md) for feature status
3. Open an issue on GitHub

---

**Built with ❤️ for Model Engineering College**
