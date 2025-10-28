"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { ShipmentWithRelations, Route } from "@/types/database.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Search, MapPin, Package, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function EnviosPendientesPage() {
  const [shipments, setShipments] = useState<ShipmentWithRelations[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentWithRelations | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [assigning, setAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const supabase = createClient();

    // Fetch pending shipments
    const { data: shipmentsData } = await supabase
      .from("shipments")
      .select(`
        *,
        user:users(full_name, email)
      `)
      .eq("assignment_status", "pending_assignment")
      .order("created_at", { ascending: true });

    // Fetch active routes
    const { data: routesData } = await supabase
      .from("routes")
      .select("*")
      .eq("is_active", true)
      .order("name");

    setShipments(shipmentsData || []);
    setRoutes(routesData || []);
    setLoading(false);
  };

  const handleAssignRoute = async () => {
    if (!selectedShipment || !selectedRouteId) {
      toast.error("Error", {
        description: "Por favor selecciona una ruta",
      });
      return;
    }

    setAssigning(true);
    const supabase = createClient();

    try {
      // Get the selected route to get initial state
      const route = routes.find(r => r.id === selectedRouteId);
      const routeStates = route?.states as string[];
      const initialState = routeStates?.[0] || "Pago Confirmado";

      // Update shipment
      const { error: updateError } = await supabase
        .from("shipments")
        .update({
          route_id: selectedRouteId,
          assignment_status: "assigned",
          current_status: initialState,
          current_status_index: 0,
          assigned_at: new Date().toISOString(),
        })
        .eq("id", selectedShipment.id);

      if (updateError) throw updateError;

      // Create status update record
      const { error: statusError } = await supabase
        .from("status_updates")
        .insert({
          shipment_id: selectedShipment.id,
          status: initialState,
          location: "Sistema",
          notes: "Ruta asignada automáticamente",
          update_type: "automatic",
        });

      if (statusError) throw statusError;

      toast.success("Ruta asignada", {
        description: `Se asignó la ruta ${route?.name} al envío ${selectedShipment.tracking_number}`,
      });

      // Refresh data
      setSelectedShipment(null);
      setSelectedRouteId("");
      fetchData();
    } catch (error) {
      console.error("Error assigning route:", error);
      toast.error("Error al asignar ruta", {
        description: "Por favor intenta de nuevo",
      });
    } finally {
      setAssigning(false);
    }
  };

  const filteredShipments = shipments.filter((s) =>
    s.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.destination_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.destination_state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <AlertCircle className="h-8 w-8 text-red-600" />
          <span>Envíos Pendientes de Asignar</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Estos envíos necesitan que se les asigne una ruta para continuar
        </p>
      </div>

      {/* Alert */}
      {shipments.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="font-semibold">
                Hay {shipments.length} envío{shipments.length !== 1 ? "s" : ""} esperando asignación de ruta.
                Los clientes ya han pagado y recibido su guía.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Envío</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número de guía, cliente, ciudad, estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Envíos Pendientes</CardTitle>
          <CardDescription>
            {filteredShipments.length} envío{filteredShipments.length !== 1 ? "s" : ""} {searchTerm ? "encontrado" + (filteredShipments.length !== 1 ? "s" : "") : "pendiente" + (filteredShipments.length !== 1 ? "s" : "")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredShipments.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">
                {searchTerm ? "No se encontraron envíos" : "¡Excelente! No hay envíos pendientes"}
              </p>
              <p className="text-muted-foreground">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Todos los envíos tienen ruta asignada"}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número de Guía</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Fecha Pago</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-mono font-semibold">
                        {shipment.tracking_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{shipment.user?.full_name || "N/A"}</p>
                          <p className="text-sm text-muted-foreground">{shipment.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">{shipment.destination_city}</p>
                            <p className="text-sm text-muted-foreground">{shipment.destination_state}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {format(new Date(shipment.created_at), "PPP", { locale: es })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">
                          ${Number(shipment.total_cost).toLocaleString("es-MX")}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => setSelectedShipment(shipment)}
                          size="sm"
                        >
                          Asignar Ruta
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Route Dialog */}
      <Dialog open={!!selectedShipment} onOpenChange={(open) => !open && setSelectedShipment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asignar Ruta al Envío</DialogTitle>
            <DialogDescription>
              Selecciona la ruta apropiada según el destino del cliente
            </DialogDescription>
          </DialogHeader>

          {selectedShipment && (
            <div className="space-y-6">
              {/* Shipment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Detalles del Envío</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Número de Guía</Label>
                      <p className="font-mono font-semibold">{selectedShipment.tracking_number}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Cliente</Label>
                      <p className="font-semibold">{selectedShipment.user?.full_name || "N/A"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Destino Solicitado</Label>
                      <p className="font-semibold">{selectedShipment.customer_destination}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Ciudad y Estado</Label>
                      <p className="font-semibold">
                        {selectedShipment.destination_city}, {selectedShipment.destination_state}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Peso</Label>
                      <p className="font-semibold">{selectedShipment.weight} kg</p>
                    </div>
                    {selectedShipment.dimensions && (
                      <div>
                        <Label className="text-muted-foreground">Dimensiones</Label>
                        <p className="font-semibold text-sm">
                          {(selectedShipment.dimensions as { length: number; width: number; height: number })?.length} x {(selectedShipment.dimensions as { length: number; width: number; height: number })?.width} x {(selectedShipment.dimensions as { length: number; width: number; height: number })?.height} cm
                        </p>
                      </div>
                    )}
                    <div>
                      <Label className="text-muted-foreground">Seguro</Label>
                      <Badge variant={selectedShipment.insurance_purchased ? "default" : "outline"}>
                        {selectedShipment.insurance_purchased ? "Sí" : "No"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Route Selection */}
              <div className="space-y-2">
                <Label htmlFor="route">Seleccionar Ruta *</Label>
                <Select value={selectedRouteId} onValueChange={setSelectedRouteId}>
                  <SelectTrigger id="route">
                    <SelectValue placeholder="Elige una ruta" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        <div className="flex flex-col">
                          <span className="font-semibold">{route.name}</span>
                          {route.description && (
                            <span className="text-xs text-muted-foreground">{route.description}</span>
                          )}
                          {route.estimated_days && (
                            <span className="text-xs text-muted-foreground">
                              ~{route.estimated_days} días
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedRouteId && routes.find(r => r.id === selectedRouteId) && (
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                  <CardContent className="pt-6">
                    <Label className="text-sm font-semibold">Estados de la ruta:</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(routes.find(r => r.id === selectedRouteId)?.states as string[]).map((state, idx) => (
                        <Badge key={idx} variant="outline">
                          {idx + 1}. {state}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedShipment(null)} disabled={assigning}>
              Cancelar
            </Button>
            <Button onClick={handleAssignRoute} disabled={!selectedRouteId || assigning}>
              {assigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Asignando...
                </>
              ) : (
                "Confirmar Asignación"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

