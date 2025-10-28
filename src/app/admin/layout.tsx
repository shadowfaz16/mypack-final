import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  PackageSearch,
  Package,
  Route,
  Users,
  DollarSign,
  Building2,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Envíos Pendientes",
      href: "/admin/envios-pendientes",
      icon: PackageSearch,
      badge: true,
    },
    {
      label: "Envíos Activos",
      href: "/admin/envios-activos",
      icon: Package,
    },
    {
      label: "Rutas",
      href: "/admin/rutas",
      icon: Route,
    },
    {
      label: "Clientes",
      href: "/admin/clientes",
      icon: Users,
    },
    {
      label: "Precios",
      href: "/admin/precios",
      icon: DollarSign,
    },
    {
      label: "Sucursales",
      href: "/admin/sucursales",
      icon: Building2,
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40 hidden lg:block">
        <div className="sticky top-0 h-screen flex flex-col">
          <div className="p-6">
            <h2 className="text-lg font-bold">Panel de Administración</h2>
            <p className="text-sm text-muted-foreground">MY PACK MX</p>
          </div>
          
          <Separator />
          
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      !
                    </span>
                  )}
                </Button>
              </Link>
            ))}
          </nav>

          <Separator />

          <div className="p-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Ver como Cliente</Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

