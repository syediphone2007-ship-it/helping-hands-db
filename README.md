# Disaster Relief Resource Management System

A comprehensive, production-ready full-stack web application for managing and coordinating disaster relief resources including shelters, food distribution, medical aid, and logistics.

## Features

- **Role-Based Access Control**: Admin, Volunteer, and Public user roles with secure authentication
- **Resource Management**: Full CRUD operations for disaster relief resources
- **Interactive Map**: Leaflet-powered map showing resource locations in real-time
- **Search & Filter**: Filter by resource type, status, and location
- **Responsive Design**: Mobile-friendly interface optimized for field use
- **Secure Backend**: Row-level security policies protecting sensitive data
- **Real-time Updates**: Live resource availability tracking

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for responsive design
- Shadcn/ui component library
- Leaflet for interactive maps
- React Router for navigation
- TanStack Query for data fetching

**Backend:**
- Lovable Cloud (Supabase-powered)
- PostgreSQL database
- Row Level Security (RLS)
- JWT-based authentication

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### Local Development

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd disaster-relief-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### First Time Setup

1. **Create an account**: Visit `/auth` and sign up
2. **Default role**: New users get "public" role by default
3. **Admin access**: To grant admin privileges, update user_roles table in the backend

## User Roles & Permissions

| Role | View Resources | Create Resources | Edit Resources | Delete Resources |
|------|---------------|------------------|----------------|------------------|
| Public | ✅ | ✅ | ❌ | ❌ |
| Volunteer | ✅ | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ |

## Database Schema

### Tables
- **profiles**: User profile information
- **user_roles**: Role assignments (admin/volunteer/public)
- **resources**: Disaster relief resources with location data

### Security
- All tables protected by Row Level Security
- Secure role-checking functions prevent privilege escalation
- Authentication required for write operations

## Deployment

### Deploy to Lovable Cloud (Recommended)
1. Click "Publish" in the Lovable editor
2. Your backend and database are already configured
3. Share the generated URL

### Self-Hosting
Follow the [Lovable self-hosting guide](https://docs.lovable.dev/tips-tricks/self-hosting)

## API Documentation

The system uses Lovable Cloud's auto-generated APIs. All database operations go through secure Supabase client with RLS policies.

### Sample API Usage

```typescript
// Fetch all resources
const { data } = await supabase
  .from('resources')
  .select('*')
  .order('created_at', { ascending: false });

// Create resource (requires authentication)
const { error } = await supabase
  .from('resources')
  .insert([resourceData]);
```

## Environment Variables

Automatically configured by Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Sample Data

The system includes 8 sample resources across all categories to demonstrate functionality.

## Support & Documentation

- [Lovable Documentation](https://docs.lovable.dev/)
- [Lovable Cloud Features](https://docs.lovable.dev/features/cloud)

## License

MIT License - Feel free to use for disaster relief coordination.
