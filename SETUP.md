# Setup Guide

## Database Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your Project URL and anon key from Settings > API

### 2. Run the Database Schema

1. Open the SQL Editor in your Supabase dashboard
2. Copy the contents of `database/schema.sql`
3. Run the SQL to create all tables, enums, and RLS policies

### 3. Add Sample Data (Optional)

You can manually add houses and students through the Supabase table editor or SQL:

```sql
-- Add Houses
INSERT INTO Houses (house_name) VALUES 
('Red House'),
('Blue House'),
('Green House'),
('Yellow House');

-- Add Students (example)
INSERT INTO Students (name, class, year, house_id) VALUES
('John Doe', 'CS-A', 2024, 1),
('Jane Smith', 'CS-B', 2024, 1),
('Bob Johnson', 'EC-A', 2023, 2);

-- Create Admin User (after signing up via the app)
-- First sign up with email/password in the app, then update the Users table:
UPDATE Users 
SET role = 'Admin' 
WHERE user_id = 'your-user-uuid-here';

-- Create House Captain (after signing up)
UPDATE Users 
SET role = 'User', house_id = 1 
WHERE user_id = 'captain-user-uuid-here';
```

### 4. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Running the Application

### Development Mode

```bash
npm install
npm run dev
```

The app will run on [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## User Flow

### First Time Setup

1. **Admin Setup**:
   - Sign up with an email/password through the app
   - Manually update the Users table in Supabase to set role = 'Admin'
   - Log back in - you now have admin access
   
2. **Create Houses**: Add houses via Supabase table editor

3. **Add Students**: Bulk import or manually add students to respective houses

4. **Create Users**: Sign up house captains, then update their role and assign house_id

### Admin Workflow

1. Login as Admin
2. Navigate to Events
3. Create Arts and Sports events with:
   - Event name
   - Type (Single/Group or Individual/Team)
   - Slots per house
   - Max participants
   - Points for 1st, 2nd, 3rd place
4. Navigate to Results to enter winners after competitions

### House Captain Workflow

1. Login as House Captain
2. View "My House" to see your students
3. Navigate to "Register Students"
4. Select an event
5. Choose students (system validates participation limits)
6. Submit registration

### Public Access

Anyone can view the live leaderboard at `/leaderboard`

## Participation Limits

The system enforces these limits automatically:

- **Arts Single Events**: 4 per student (as participant)
- **Arts Group Events**: 2 per student (as participant)
- **Sports Individual**: 3 per student
- **Sports Team**: 2 per student

Note: Accompanists in arts events do NOT count towards limits.

## Troubleshooting

### Authentication Issues

- Ensure Supabase auth is enabled
- Check that email confirmations are disabled for development (Settings > Authentication > Email Auth)

### Permission Errors

- Verify RLS policies are created correctly
- Check user role is set properly in Users table
- Ensure house_id is assigned for captains

### Build Errors

- Clear `.next` folder and rebuild
- Ensure all dependencies are installed
- Check Node.js version (18+ required)

## API Structure

The app uses:
- Server Components for data fetching
- Server Actions for mutations
- Supabase RLS for security
- No API routes needed (uses Server Actions)

## Security

- Row Level Security (RLS) ensures data isolation
- Server Actions validate user permissions
- Captains can only access their house data
- Admins have full access
- Public can only view leaderboard and event lists
