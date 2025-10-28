import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PackageSearch, Package, TruckIcon, CheckCircle, DollarSign, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch stats
  const { data: allShipments } = await supabase
    .from("shipments")
    .select("*");

  const { data: pendingAssignment } = await supabase
    .from("shipments")
    .select("*")
    .eq("assignment_status", "pending_assignment");

  const { data: activeShipments } = await supabase
    .from("shipments")
    .select("*")
    .in("assignment_status", ["assigned", "active"]);

  const { data: completedToday } = await supabase
    .from("shipments")
    .select("*")
    .eq("assignment_status", "completed")
    .gte("actual_delivery", new Date().toISOString().split("T")[0]);

  // Calculate revenue (month to date)
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: monthlyShipments } = await supabase
    .from("shipments")
    .select("total_cost")
    .eq("payment_status", "paid")
    .gte("created_at", monthStart.toISOString());

  const monthlyRevenue = monthlyShipments?.reduce((sum, s) => sum + Number(s.total_cost), 0) || 0;

  // Recent activity
  const { data: recentShipments } = await supabase
    .from("shipments")
    .select(`
      *,
      route:routes(name),
      user:users(full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de operaciones MY PACK MX
        </p>
      </div>

      {/* Alert for pending assignments */}
      {(pendingAssignment?.length || 0) > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-semibold">
                    {pendingAssignment?.length ?? 0} envío{(pendingAssignment?.length ?? 0) !== 1 ? "s" : ""} pendiente{(pendingAssignment?.length ?? 0) !== 1 ? "s" : ""} de asignar ruta
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Estos envíos necesitan atención inmediata
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link href="/admin/envios-pendientes">
                  Ver Pendientes
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendientes de Asignar
            </CardTitle>
            <PackageSearch className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignment?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Requieren asignación de ruta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Envíos Activos
            </CardTitle>
            <TruckIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeShipments?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              En tránsito o asignados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Entregados Hoy
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Completados el día de hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos del Mes
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${monthlyRevenue.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              MXN (mes actual)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Tareas comunes de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button asChild variant="default" className="w-full">
              <Link href="/admin/envios-pendientes">
                <PackageSearch className="mr-2 h-4 w-4" />
                Asignar Rutas
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/envios-activos">
                <Package className="mr-2 h-4 w-4" />
                Actualizar Estados
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/rutas/nueva">
                <TruckIcon className="mr-2 h-4 w-4" />
                Nueva Ruta
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimos 10 envíos creados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentShipments?.map((shipment) => (
              <div key={shipment.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{shipment.tracking_number}</p>
                    <Badge variant={
                      shipment.assignment_status === "completed" ? "default" :
                      shipment.assignment_status === "active" ? "secondary" :
                      shipment.assignment_status === "assigned" ? "outline" : "destructive"
                    }>
                      {shipment.assignment_status === "completed" ? "Entregado" :
                       shipment.assignment_status === "active" ? "Activo" :
                       shipment.assignment_status === "assigned" ? "Asignado" : "Pendiente"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {shipment.user?.full_name || shipment.user?.email || "Usuario"} → {shipment.destination_city}, {shipment.destination_state}
                  </p>
                  {shipment.route && (
                    <p className="text-xs text-muted-foreground">
                      Ruta: {shipment.route.name}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    ${Number(shipment.total_cost).toLocaleString("es-MX")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(shipment.created_at), "PPP", { locale: es })}
                  </p>
                </div>
              </div>
            ))}

            {recentShipments?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay envíos recientes</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Pendientes de Asignar:</span>
                <span className="font-semibold">{pendingAssignment?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Asignados:</span>
                <span className="font-semibold">
                  {allShipments?.filter(s => s.assignment_status === "assigned").length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Activos:</span>
                <span className="font-semibold">
                  {allShipments?.filter(s => s.assignment_status === "active").length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Completados:</span>
                <span className="font-semibold">
                  {allShipments?.filter(s => s.assignment_status === "completed").length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total de Envíos:</span>
                <span className="font-semibold">{allShipments?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Con Seguro:</span>
                <span className="font-semibold">
                  {allShipments?.filter(s => s.insurance_purchased).length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Peso Total Procesado:</span>
                <span className="font-semibold">
                  {(allShipments?.reduce((sum, s) => sum + Number(s.weight), 0) || 0).toFixed(2)} kg
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Ingresos Totales:</span>
                <span className="font-semibold">
                  ${(allShipments?.reduce((sum, s) => sum + Number(s.total_cost), 0) || 0).toLocaleString("es-MX")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

