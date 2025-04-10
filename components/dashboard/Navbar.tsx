// "use client";
// import React from "react";
// import Link from "next/link";
// import { Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Session } from "next-auth";
// import { AvatarMenuButton } from "./AvatarMenuButton";
// import Logo from "../global/Logo";
// import { cn } from "@/lib/utils";
// import { usePathname, useRouter } from "next/navigation";
// import { signOut } from "next-auth/react";
// import { sidebarLinks } from "@/config/sidebar";
// import { usePermission } from "@/hooks/usePermissions";
// import { UserDropdownMenu } from "../UserDropdownMenu";

// export default function Navbar({ session }: { session: Session }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { hasPermission } = usePermission();

//   // Filter sidebar links based on user permissions
//   const filteredLinks = sidebarLinks.filter((link) => {
//     // Check main link permission
//     if (!hasPermission(link.permission)) {
//       return false;
//     }

//     // If it's a dropdown, check if user has permission for any dropdown item
//     if (link.dropdown && link.dropdownMenu) {
//       return link.dropdownMenu.some((item) => hasPermission(item.permission));
//     }

//     return true;
//   });

//   // Flatten dropdown menus for mobile view
//   const mobileLinks = filteredLinks.reduce(
//     (acc, link) => {
//       // Add main link if it's not a dropdown
//       if (!link.dropdown) {
//         acc.push({
//           title: link.title,
//           href: link.href || "#",
//           icon: link.icon,
//           permission: link.permission,
//         });
//         return acc;
//       }

//       // Add dropdown items if user has permission
//       if (link.dropdownMenu) {
//         link.dropdownMenu.forEach((item) => {
//           if (hasPermission(item.permission)) {
//             acc.push({
//               title: item.title,
//               href: item.href,
//               icon: link.icon,
//               permission: item.permission,
//             });
//           }
//         });
//       }

//       return acc;
//     },
//     [] as Array<{ title: string; href: string; icon: any; permission: string }>
//   );

//   async function handleLogout() {
//     try {
//       await signOut();
//       router.push("/login");
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   return (
//     <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-muted/60 px-4 lg:h-[60px] lg:px-6">
//       <Sheet>
//         <SheetTrigger asChild>
//           <Button variant="outline" size="icon" className="shrink-0 md:hidden">
//             <Menu className="h-5 w-5" />
//             <span className="sr-only">Toggle navigation menu</span>
//           </Button>
//         </SheetTrigger>
//         <SheetContent side="left" className="flex flex-col">
//           <nav className="grid gap-2 text-lg font-medium">
//             <Logo href="/dashboard" />

//             {/* Render mobile navigation links */}
//             {mobileLinks.map((item, i) => {
//               const Icon = item.icon;
//               const isActive = item.href === pathname;

//               return (
//                 <Link
//                   key={i}
//                   href={item.href}
//                   className={cn(
//                     "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
//                     isActive && "bg-muted text-primary"
//                   )}
//                 >
//                   <Icon className="h-4 w-4" />
//                   {item.title}
//                 </Link>
//               );
//             })}
//           </nav>

//           <div className="mt-auto">
//             <Button onClick={handleLogout} size="sm" className="w-full">
//               Logout
//             </Button>
//           </div>
//         </SheetContent>
//       </Sheet>

//       <div className="w-full flex-1"></div>
//       <div className="p-4 ">
//         <UserDropdownMenu
//           username={session?.user?.name ?? ""}
//           email={session?.user?.email ?? ""}
//           avatarUrl={
//             session?.user?.image ??
//             "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(54)-NX3G1KANQ2p4Gupgnvn94OQKsGYzyU.png"
//           }
//         />
//       </div>
//       {/* <AvatarMenuButton session={session} /> */}
//     </header>
//   );
// }


"use client";
import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Session } from "next-auth";
import { AvatarMenuButton } from "./AvatarMenuButton";
import Logo from "../global/Logo";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { sidebarLinks } from "@/config/sidebar";
import { usePermission } from "@/hooks/usePermissions";
import { UserDropdownMenu } from "../UserDropdownMenu";

export default function Navbar({ session }: { session: Session }) {
  const router = useRouter();
  const pathname = usePathname();
  const { hasPermission } = usePermission();
  const user = session?.user;
  const userRole = session?.user?.roles[0].displayName;

  // Organization details - replace with your actual data source/API call
  // const organizationDetails = {
  //   name: {user},
  //   id: "org_12345abcde",
  //   userRole: "Administrator"
  // };

  // Filter sidebar links based on user permissions
  const filteredLinks = sidebarLinks.filter((link) => {
    // Check main link permission
    if (!hasPermission(link.permission)) {
      return false;
    }

    // If it's a dropdown, check if user has permission for any dropdown item
    if (link.dropdown && link.dropdownMenu) {
      return link.dropdownMenu.some((item) => hasPermission(item.permission));
    }

    return true;
  });

  // Flatten dropdown menus for mobile view
  const mobileLinks = filteredLinks.reduce(
    (acc, link) => {
      // Add main link if it's not a dropdown
      if (!link.dropdown) {
        acc.push({
          title: link.title,
          href: link.href || "#",
          icon: link.icon,
          permission: link.permission,
        });
        return acc;
      }

      // Add dropdown items if user has permission
      if (link.dropdownMenu) {
        link.dropdownMenu.forEach((item) => {
          if (hasPermission(item.permission)) {
            acc.push({
              title: item.title,
              href: item.href,
              icon: link.icon,
              permission: item.permission,
            });
          }
        });
      }

      return acc;
    },
    [] as Array<{ title: string; href: string; icon: any; permission: string }>
  );

  async function handleLogout() {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-muted/60 px-4 lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Logo href="/dashboard" />

              {/* Render mobile navigation links */}
              {mobileLinks.map((item, i) => {
                const Icon = item.icon;
                const isActive = item.href === pathname;

                return (
                  <Link
                    key={i}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      isActive && "bg-muted text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto">
              <Button onClick={handleLogout} size="sm" className="w-full">
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex items-center space-x-2 text-sm">
          <div className="text-muted-foreground">
            <div className="flex flex-col">
              <div className="flex gap-3 items-center">
              <span className="font-medium text-foreground">{user?.orgName??""}</span>
            <span className="hidden md:inline">{userRole} </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex-1"></div>
        <div className="p-4 ">
          <UserDropdownMenu
            username={session?.user?.name ?? ""}
            email={session?.user?.email ?? ""}
            avatarUrl={
              session?.user?.image ??
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%20(54)-NX3G1KANQ2p4Gupgnvn94OQKsGYzyU.png"
            }
          />
        </div>
        {/* <AvatarMenuButton session={session} /> */}
      </header>
      
      {/* Welcome Banner with Organization Details */}
      {/* <div className="bg-white border-b mb-4 px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-900">
              Welcome, {session?.user?.name || "User"}
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <span className="md:hidden">{user.name}</span>
              <span className="hidden md:inline">Role:{userRole} </span>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}