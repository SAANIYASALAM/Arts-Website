# Layatharang & Chakravyuh 2026

College Arts and Sports Festival Management System for Model Engineering College

## 🎯 Features

- **Multi-role Authentication**: Admin and House Captain roles
- **Event Management**: Create and manage Arts and Sports events
- **Student Registration**: Register students for events with validation
- **Participation Limits**: 
  - Arts Individual: 4 events per student (participant)
  - Arts Group: 2 events per student (participant)
  - Sports Individual: 3 events per student
  - Sports Team: 2 events per student
- **Results & Winners**: Admin can enter competition results
- **Live Leaderboard**: Real-time house scores with Supabase Realtime
- **Row Level Security**: Secure data access based on user roles

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Form Handling**: React Hook Form + Zod
- **Real-time**: Supabase Realtime

## 📁 Project Structure

```
/app
  /(auth)
    /login              # Login page
  /(dashboard)
    /admin
      /events           # Event management (Admin only)
      /results          # Winner entry (Admin only)
    /captain
      /register         # Student registration (House Captain)
      /my-house         # House dashboard (House Captain)
  /leaderboard          # Public leaderboard
  
/components
  /ui                   # Shadcn UI components
  /forms                # Form components
  
/lib
  /supabase            # Supabase client/server configs
  /utils               # Utility functions
  
/database
  schema.sql           # PostgreSQL schema with RLS policies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SAANIYASALAM/Arts-Website.git
cd Arts-Website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Set up the database:
- Go to your Supabase project
- Navigate to SQL Editor
- Run the schema from `database/schema.sql`

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📊 Database Schema

The database includes the following main tables:
- **Houses**: College houses
- **Users**: Authentication and user roles
- **Students**: Student information
- **Arts_Events** & **Sports_Events**: Event definitions
- **Arts_Registrations** & **Sports_Registrations**: Event registrations
- **Arts_Winners** & **Sports_Winners**: Competition results

All tables have Row Level Security (RLS) policies enforcing proper access control.

## 🔐 Security

- Row Level Security (RLS) ensures users can only access their authorized data
- House Captains can only view/register students from their house
- Admins have full access to all data
- All mutations use Server Actions for security

## 🎨 User Flows

### Admin
1. Create Arts and Sports events
2. Set point values and participation limits
3. Enter competition winners
4. View all registrations and data

### House Captain  
1. View students in their house
2. Register students for events
3. View house registrations
4. Check house leaderboard position

### Public
1. View live leaderboard
2. See event lists
3. View competition results

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributors

- SAANIYASALAM

## 🙏 Acknowledgments

- Model Engineering College
- Layatharang & Chakravyuh organizing teams
