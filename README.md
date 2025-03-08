RBAC => https://claude.ai/chat/5f6fe7be-2487-4a32-a466-7d4ba286e735

# Role-Based Access Control (RBAC) NextJS Application

A comprehensive Next.js application with Role-Based Access Control, authentication, and authorization features.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Authentication Setup](#authentication-setup)
- [Usage](#usage)
- [Authorization](#authorization)

## Prerequisites

- Node.js 18 or later
- PNPM package manager
- PostgreSQL database (we're using Neon DB)
- Git

## Getting Started

1. Clone the repository:

```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables (see next section)
4. Initialize the database
5. Start the development server:

```bash
pnpm dev
```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

### Database Configuration

```env
DATABASE_URL="postgresql://[username]:[password]@[host]/[database]?sslmode=require"
```

To get this:

1. Create an account at [Neon DB](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard
4. Replace placeholders with your credentials

### Authentication Providers

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set homepage URL to `http://localhost:3000`
4. Set callback URL to `http://localhost:3000/api/auth/callback/github`
5. Copy credentials and add to `.env`:

```env
GITHUB_CLIENT_ID="your_client_id"
GITHUB_SECRET="your_client_secret"
```

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable OAuth 2.0
4. Configure OAuth consent screen
5. Create credentials (OAuth client ID)
6. Set authorized redirect URI to `http://localhost:3000/api/auth/callback/google`
7. Add to `.env`:

```env
GOOGLE_CLIENT_ID="your_client_id"
GOOGLE_CLIENT_SECRET="your_client_secret"
```

### NextAuth Configuration

Generate a secret using:

```bash
openssl rand -base64 32
```

Add to `.env`:

```env
NEXTAUTH_SECRET="your_generated_secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### Email Service (Resend)

1. Create account at [Resend](https://resend.com)
2. Get API key and add to `.env`:

```env
RESEND_API_KEY="your_api_key"
```

### File Upload (UploadThing)

1. Create account at [UploadThing](https://uploadthing.com)
2. Get API key and add to `.env`:

```env
UPLOADTHING_TOKEN='your_token'
```

## Database Setup

1. Push the schema to your database:

```bash
pnpm prisma db push
```

2. Seed the database with initial data:

```bash
pnpm prisma db seed
```

This will create:

- Default roles (Admin and User)
- Admin user (email: admin@admin.com, password: Admin@2025)
- Regular user (email: user@user.com, password: User@2025)

## Authorization

### Server-Side Protection

```typescript
// In server components
import { getServerPermissions, PermissionGate } from "@/utils/server-permissions";

export default async function ProtectedPage() {
  const { hasPermission } = await getServerPermissions();

  // Direct permission check
  if (!hasPermission("users.read")) {
    return <NotAuthorized />;
  }

  // Using PermissionGate component
  return (
    <div>
      <h1>Users Page</h1>
      <PermissionGate permission="users.create">
        <button>Create User</button>
      </PermissionGate>
    </div>
  );
}
```

### Client-Side Protection

```typescript
// In client components
'use client';
import { usePermission } from "@/hooks/usePermission";

export default function UserTable() {
  const { hasPermission } = usePermission();

  return (
    <div>
      {hasPermission("users.create") && (
        <button>Create User</button>
      )}
    </div>
  );
}
```

## Available Permissions

The system includes permissions for:

- Dashboard management
- User management
- Role management
- Sales and orders
- Inventory management
- Settings and configurations
- Reports and analytics

Each module has these permission types:

- `create`: Create new items
- `read`: View items
- `update`: Modify existing items
- `delete`: Remove items

Example: `users.create`, `users.read`, etc.

## Development Guidelines

1. Always use permission checks for protected routes
2. Use server-side checks when possible
3. Client-side checks are for UI elements only
4. Keep permissions consistent with the schema
5. Test both authenticated and unauthenticated states

## Common Issues

1. Database connection issues:

   - Check if your DATABASE_URL is correct
   - Ensure your IP is allowed in Neon DB

2. Authentication issues:

   - Verify callback URLs in OAuth providers
   - Check NEXTAUTH_URL setting

3. Permission issues:
   - Run database seed
   - Check user role assignments
   - Verify permission strings match exactly

## Contributing

1. Create a feature branch
2. Make changes
3. Write tests
4. Submit PR

## License

MIT
