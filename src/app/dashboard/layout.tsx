import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { Package, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const navItems = [
    { href: "/dashboard", label: "Mis Envíos", icon: Package },
    { href: "/dashboard/perfil", label: "Mi Perfil", icon: User },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Cuenta</h1>
          <p className="text-muted-foreground">
            Bienvenido, {user.firstName || user.emailAddresses[0].emailAddress}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="flex items-center space-x-2">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

