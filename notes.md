```
// Example usage in a client component
'use client';

import { usePermissions } from "@/lib/auth";

export default function ProtectedClientComponent() {
  const { hasPermission } = usePermissions();

  if (!hasPermission("users.read")) {
    return <NotAuthorized />;
  }

  return (
    <div>
      {/* Your component content */}
    </div>
  );
}

// Example with multiple permission checks
export default async function ComplexPage() {
  // Check if user has any of these permissions
  await checkAnyPermission(["users.create", "users.update"]);

  // Or check if user has all of these permissions
  await checkAllPermissions(["users.read", "roles.read"]);

  return (
    <div>
      {/* Your page content */}
    </div>
  );
}
```

// Example usage in a Server Component
import { getServerPermissions, PermissionGate } from "@/utils/server-permissions";

export default async function UserDashboard() {
const { hasPermission, hasAnyPermission } = await getServerPermissions();

return (
<div className="p-4">
<h1>User Dashboard</h1>

      {/* Using direct permission check */}
      {hasPermission("users.create") && (
        <button className="bg-blue-500 text-white px-4 py-2">
          Create User
        </button>
      )}

      {/* Using PermissionGate component */}
      <PermissionGate permission="users.delete">
        <button className="bg-red-500 text-white px-4 py-2">
          Delete User
        </button>
      </PermissionGate>

      {/* Checking multiple permissions */}
      {hasAnyPermission(["users.update", "users.manage"]) && (
        <div className="mt-4">
          <h2>User Management Section</h2>
          {/* Management content */}
        </div>
      )}
    </div>

);
}

// Example with multiple components and permissions
export async function UsersTable() {
const { hasPermission } = await getServerPermissions();

return (
<table className="min-w-full">
<thead>
<tr>
<th>Name</th>
<th>Email</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
<tr>
<td>John Doe</td>
<td>john@example.com</td>
<td className="space-x-2">
<PermissionGate permission="users.update">
<button className="text-blue-500">Edit</button>
</PermissionGate>

            <PermissionGate permission="users.delete">
              <button className="text-red-500">Delete</button>
            </PermissionGate>
          </td>
        </tr>
      </tbody>
    </table>

);
}

// Example with nested permissions and complex UI
export async function AdminDashboard() {
const { hasAllPermissions } = await getServerPermissions();

const isFullAdmin = hasAllPermissions([
"users.manage",
"roles.manage",
"settings.manage"
]);

return (
<div>
{isFullAdmin ? (
<div className="bg-green-100 p-4 rounded">
<h2>Full Admin Access</h2>
{/_ Full admin content _/}
</div>
) : (
<div className="bg-yellow-100 p-4 rounded">
<h2>Limited Access</h2>
{/_ Limited access content _/}
</div>
)}
</div>
);
}
