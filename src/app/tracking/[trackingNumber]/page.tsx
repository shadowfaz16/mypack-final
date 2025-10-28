import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Calendar, CheckCircle, Circle, Download, Clock } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TrackingPageProps {
  params: {
    trackingNumber: string;
  };
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const supabase = await createClient();
  
  // Fetch shipment with route and status updates
  const { data: shipment, error } = await supabase
    .from("shipments")
    .select(`
      *,
      route:routes(*),
      status_updates(*, updated_by:users(full_name))
    `)
    .eq("tracking_number", params.trackingNumber)
    .single();

  if (error || !shipment) {
    notFound();
  }

  // Parse dimensions if available
  const dimensions = shipment.dimensions as { length: number; width: number; height: number } | null;

  // Sort status updates by timestamp
  const statusUpdates = (shipment.status_updates || []).sort(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Check if route is assigned
  const hasRouteAssigned = !!shipment.route_id && !!shipment.route;
  const routeStates = shipment.route?.states as string[] | undefined;

  return (
    <div className="flex flex-col py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Rastreo de Envío</h1>
            <p className="text-muted-foreground">
              Sigue tu paquete en tiempo real
            </p>
          </div>

          {/* Tracking Number Card */}
          <Card className="border-2 border-primary">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Número de Guía</p>
                <p className="text-3xl font-bold text-primary">{shipment.tracking_number}</p>
              </div>
            </CardContent>
          </Card>

          {/* Status Badge */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Estado Actual</p>
                  <p className="text-2xl font-semibold">
                    {hasRouteAssigned ? shipment.current_status : "Pago Confirmado - En Proceso de Asignación"}
                  </p>
                </div>
                <Badge 
                  variant={shipment.assignment_status === "completed" ? "default" : "secondary"}
                  className="text-lg px-4 py-2"
                >
                  {shipment.assignment_status === "completed" ? "Entregado" : 
                   shipment.assignment_status === "active" ? "En Tránsito" :
                   shipment.assignment_status === "assigned" ? "Asignado" : "Pendiente"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Two-Stage Display */}
          {!hasRouteAssigned ? (
            /* STAGE 1: Before Route Assignment */
            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>En Proceso de Asignación</span>
                </CardTitle>
                <CardDescription>
                  Tu envío está siendo procesado. Pronto verás más detalles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  ✅ <strong>Pago confirmado</strong> - Tu guía ha sido generada
                </p>
                <p className="text-sm text-muted-foreground">
                  Nuestro equipo está asignando la mejor ruta para tu envío según tu destino.
                  Una vez asignada, podrás ver el seguimiento completo con todos los estados de tu paquete.
                </p>
              </CardContent>
            </Card>
          ) : (
            /* STAGE 2: After Route Assignment */
            <>
              {/* Route Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Ruta Asignada</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold">{shipment.route?.name}</p>
                    {shipment.route?.description && (
                      <p className="text-sm text-muted-foreground">{shipment.route.description}</p>
                    )}
                    {shipment.estimated_delivery && (
                      <p className="text-sm">
                        <strong>Entrega estimada:</strong>{" "}
                        {format(new Date(shipment.estimated_delivery), "PPP", { locale: es })}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Seguimiento del Envío</CardTitle>
                  <CardDescription>
                    Estado actual y progreso de tu paquete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-8">
                    {routeStates?.map((state: string, index: number) => {
                      const isCompleted = index <= (shipment.current_status_index || 0);
                      const isCurrent = index === (shipment.current_status_index || 0);
                      
                      return (
                        <div key={index} className="relative flex items-start space-x-4">
                          {/* Timeline Line */}
                          {index < routeStates.length - 1 && (
                            <div
                              className={`absolute left-[15px] top-8 w-0.5 h-full ${
                                isCompleted ? "bg-primary" : "bg-muted"
                              }`}
                            />
                          )}
                          
                          {/* Icon */}
                          <div
                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                              isCompleted
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-muted bg-background"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 space-y-1">
                            <p
                              className={`font-semibold ${
                                isCurrent ? "text-primary" : isCompleted ? "" : "text-muted-foreground"
                              }`}
                            >
                              {state}
                            </p>
                            {isCurrent && (
                              <Badge variant="default">Estado Actual</Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Package Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-primary" />
                <span>Detalles del Paquete</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dimensions && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dimensiones</p>
                    <p className="font-semibold">
                      {dimensions.length} x {dimensions.width} x {dimensions.height} cm
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Peso</p>
                  <p className="font-semibold">{shipment.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destino</p>
                  <p className="font-semibold">
                    {shipment.destination_city}, {shipment.destination_state}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seguro</p>
                  <p className="font-semibold">
                    {shipment.insurance_purchased ? "✓ Contratado" : "✗ No contratado"}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dirección de Entrega</p>
                <p className="text-sm">{shipment.destination_address}</p>
                <p className="text-sm">
                  {shipment.destination_city}, {shipment.destination_state}{" "}
                  {shipment.destination_zipcode}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status History */}
          {statusUpdates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Historial de Actualizaciones</CardTitle>
                <CardDescription>
                  Registro completo de movimientos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusUpdates.map((update: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                    <div key={update.id} className="border-l-2 border-primary pl-4 pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-semibold">{update.status}</p>
                          {update.location && (
                            <p className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {update.location}
                            </p>
                          )}
                          {update.notes && (
                            <p className="text-sm text-muted-foreground">{update.notes}</p>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p className="flex items-center justify-end">
                            <Calendar className="h-3 w-3 mr-1" />
                            {format(new Date(update.timestamp), "PPP", { locale: es })}
                          </p>
                          <p>{format(new Date(update.timestamp), "p", { locale: es })}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {shipment.guide_pdf_url && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="flex-1">
                    <a href={shipment.guide_pdf_url} download target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar Guía
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <a href="/contacto">
                      Contactar Soporte
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

