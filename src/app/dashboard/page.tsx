import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, MapPin, Calendar, Download, Search, TruckIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }

  const supabase = await createClient();

  // Get user from Supabase
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", user.id)
    .single();

  if (!userData) {
    // User needs to be synced to Supabase
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Configurando tu cuenta... Por favor recarga la página.
        </p>
      </div>
    );
  }

  // Fetch user's shipments
  const { data: shipments } = await supabase
    .from("shipments")
    .select(`
      *,
      route:routes(name, estimated_days)
    `)
    .eq("user_id", userData.id)
    .order("created_at", { ascending: false });

  const activeShipments = shipments?.filter(
    (s) => s.assignment_status !== "completed"
  ) || [];
  
  const completedShipments = shipments?.filter(
    (s) => s.assignment_status === "completed"
  ) || [];

  const getStatusColor = (status: string) => {
    if (status === "completed") return "default";
    if (status === "active") return "secondary";
    if (status === "assigned") return "outline";
    return "outline";
  };

  const ShipmentCard = ({ shipment }: { shipment: Record<string, unknown> }) => {
    const trackingNumber = shipment.tracking_number as string;
    const destination = shipment.customer_destination as string;
    const status = shipment.assignment_status as string;
    const createdAt = shipment.created_at as string;
    // const totalCost = shipment.total_cost as number;
    const routeId = shipment.route_id as string | null;
    const currentStatus = shipment.current_status as string;
    const route = shipment.route as { name: string } | null;
    const estimatedDelivery = shipment.estimated_delivery as string | null;
    const guidePdfUrl = shipment.guide_pdf_url as string | null;
    
    return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {trackingNumber}
            </CardTitle>
            <CardDescription className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {destination}
            </CardDescription>
          </div>
          <Badge variant={getStatusColor(status)}>
            {status === "completed" ? "Entregado" :
             status === "active" ? "En Tránsito" :
             status === "assigned" ? "Asignado" : "Pendiente"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estado:</span>
            <span className="font-medium">
              {routeId ? currentStatus : "Pago Confirmado"}
            </span>
          </div>
          
          {route && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ruta:</span>
              <span className="font-medium">{route.name}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Fecha de pago:</span>
            <span className="font-medium">
              {format(new Date(createdAt), "PPP", { locale: es })}
            </span>
          </div>
          
          {estimatedDelivery && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Entrega estimada:</span>
              <span className="font-medium">
                {format(new Date(estimatedDelivery), "PPP", { locale: es })}
              </span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button asChild variant="default" className="flex-1">
            <Link href={`/tracking/${trackingNumber}`}>
              <Search className="mr-2 h-4 w-4" />
              Rastrear
            </Link>
          </Button>
          {guidePdfUrl && (
            <Button asChild variant="outline" className="flex-1">
              <a href={guidePdfUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Guía
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Envíos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipments?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Tránsito</CardTitle>
            <TruckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeShipments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entregados</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedShipments.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Track */}
      <Card>
        <CardHeader>
          <CardTitle>Rastreo Rápido</CardTitle>
          <CardDescription>
            Ingresa tu número de guía para rastrear cualquier envío
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex gap-2" action="/tracking" method="GET">
            <Input
              name="tracking"
              placeholder="MPM-20250128-00001"
              className="flex-1"
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Rastrear
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Shipments List */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Envíos</CardTitle>
          <CardDescription>
            Historial completo de tus paquetes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">
                Activos ({activeShipments.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completados ({completedShipments.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4 mt-4">
              {activeShipments.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tienes envíos activos</p>
                  <Button asChild className="mt-4">
                    <Link href="/cotizador">Crear Nuevo Envío</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeShipments.map((shipment) => (
                    <ShipmentCard key={shipment.id} shipment={shipment} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4 mt-4">
              {completedShipments.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No tienes envíos completados aún</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedShipments.map((shipment) => (
                    <ShipmentCard key={shipment.id} shipment={shipment} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* CTA for new shipment */}
      {(shipments?.length || 0) === 0 && (
        <Card className="bg-gradient-to-r from-primary to-green-600 text-primary-foreground">
          <CardContent className="pt-6 text-center space-y-4">
            <Package className="h-16 w-16 mx-auto opacity-90" />
            <h2 className="text-2xl font-bold">¡Envía tu primer paquete!</h2>
            <p className="opacity-90">
              Obtén una cotización instantánea y recibe tu guía en minutos
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/cotizador">
                Cotizar Envío
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

