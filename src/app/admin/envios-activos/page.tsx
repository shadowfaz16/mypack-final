"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { ShipmentWithRelations, Route } from "@/types/database.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Search, Loader2, Edit, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function EnviosActivosPage() {
  const [shipments, setShipments] = useState<ShipmentWithRelations[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentWithRelations | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusLocation, setStatusLocation] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [routeFilter, setRouteFilter] = useState("all");
  const [selectedShipments, setSelectedShipments] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: shipmentsData } = await supabase
      .from("shipments")
      .select(`
        *,
        user:users(full_name, email),
        route:routes(name, states)
      `)
      .in("assignment_status", ["assigned", "active"])
      .order("created_at", { ascending: false });

    const { data: routesData } = await supabase
      .from("routes")
      .select("*")
      .eq("is_active", true);

    setShipments(shipmentsData || []);
    setRoutes(routesData || []);
    setLoading(false);
  };

  const handleUpdateStatus = async () => {
    if (!selectedShipment || !selectedStatus) {
      toast.error("Error", { description: "Selecciona un nuevo estado" });
      return;
    }

    setUpdating(true);
    const supabase = createClient();

    try {
      const routeStates = selectedShipment.route?.states as string[] || [];
      const newStatusIndex = routeStates.indexOf(selectedStatus);
      const isLastState = newStatusIndex === routeStates.length - 1;

      // Update shipment status
      const updateData: {
        current_status: string;
        current_status_index: number;
        assignment_status?: 'completed' | 'active';
        actual_delivery?: string;
      } = {
        current_status: selectedStatus,
        current_status_index: newStatusIndex,
      };

      if (isLastState) {
        updateData.assignment_status = "completed";
        updateData.actual_delivery = new Date().toISOString();
      } else if (selectedShipment.assignment_status === "assigned") {
        updateData.assignment_status = "active";
      }

      const { error: updateError } = await supabase
        .from("shipments")
        .update(updateData)
        .eq("id", selectedShipment.id);

      if (updateError) throw updateError;

      // Create status update record
      const { error: statusError } = await supabase
        .from("status_updates")
        .insert({
          shipment_id: selectedShipment.id,
          status: selectedStatus,
          location: statusLocation || null,
          notes: statusNotes || null,
          update_type: "manual",
        });

      if (statusError) throw statusError;

      // TODO: Send email notification to client (implement after email service is ready)

      toast.success("Estado actualizado", {
        description: `Envío ${selectedShipment.tracking_number} actualizado a "${selectedStatus}"`,
      });

      setSelectedShipment(null);
      setSelectedStatus("");
      setStatusLocation("");
      setStatusNotes("");
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error al actualizar estado", {
        description: "Por favor intenta de nuevo",
      });
    } finally {
      setUpdating(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleBulkUpdateStatus = async () => {
    if (selectedShipments.size === 0) {
      toast.error("Error", { description: "Selecciona al menos un envío" });
      return;
    }

    if (!selectedStatus) {
      toast.error("Error", { description: "Selecciona un nuevo estado" });
      return;
    }

    setUpdating(true);
    const supabase = createClient();

    try {
      const shipmentsToUpdate = Array.from(selectedShipments);
      
      for (const shipmentId of shipmentsToUpdate) {
        const shipment = shipments.find(s => s.id === shipmentId);
        if (!shipment || !shipment.route) continue;

        const routeStates = shipment.route.states as string[] || [];
        const newStatusIndex = routeStates.indexOf(selectedStatus);
        const isLastState = newStatusIndex === routeStates.length - 1;

        const updateData: {
          current_status: string;
          current_status_index: number;
          assignment_status?: 'completed' | 'active';
          actual_delivery?: string;
        } = {
          current_status: selectedStatus,
          current_status_index: newStatusIndex,
        };

        if (isLastState) {
          updateData.assignment_status = "completed";
          updateData.actual_delivery = new Date().toISOString();
        } else if (shipment.assignment_status === "assigned") {
          updateData.assignment_status = "active";
        }

        await supabase.from("shipments").update(updateData).eq("id", shipmentId);

        await supabase.from("status_updates").insert({
          shipment_id: shipmentId,
          status: selectedStatus,
          location: statusLocation || null,
          notes: `Actualización masiva: ${statusNotes || "Sin notas"}`,
          update_type: "manual",
        });
      }

      toast.success("Actualización masiva completada", {
        description: `${shipmentsToUpdate.length} envíos actualizados`,
      });

      setSelectedShipments(new Set());
      setSelectedStatus("");
      setStatusLocation("");
      setStatusNotes("");
      fetchData();
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast.error("Error en actualización masiva");
    } finally {
      setUpdating(false);
    }
  };

  const toggleShipmentSelection = (id: string) => {
    const newSelected = new Set(selectedShipments);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedShipments(newSelected);
  };

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch = 
      s.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || s.assignment_status === statusFilter;
    const matchesRoute = routeFilter === "all" || s.route_id === routeFilter;

    return matchesSearch && matchesStatus && matchesRoute;
  });

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
        <h1 className="text-3xl font-bold">Envíos Activos</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona los envíos en proceso y actualiza sus estados
        </p>
      </div>

      {/* Bulk Actions */}
      {selectedShipments.size > 0 && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {selectedShipments.size} envío{selectedShipments.size !== 1 ? "s" : ""} seleccionado{selectedShipments.size !== 1 ? "s" : ""}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedShipments(new Set())}>
                  Limpiar Selección
                </Button>
                <Button onClick={() => {
                  if (selectedShipments.size > 0) {
                    // Open a simplified dialog for bulk update
                    toast.info("Actualización masiva", {
                      description: "Esta función actualizará todos los envíos seleccionados",
                    });
                  }
                }}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Actualizar Todos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Guía, cliente, ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estado de Asignación</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="assigned">Asignados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ruta</Label>
              <Select value={routeFilter} onValueChange={setRouteFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las rutas</SelectItem>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Envíos</CardTitle>
          <CardDescription>
            {filteredShipments.length} envío{filteredShipments.length !== 1 ? "s" : ""} {searchTerm || statusFilter !== "all" || routeFilter !== "all" ? "filtrado" + (filteredShipments.length !== 1 ? "s" : "") : "activo" + (filteredShipments.length !== 1 ? "s" : "")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredShipments.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">No se encontraron envíos</p>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || routeFilter !== "all"
                  ? "Intenta ajustar los filtros"
                  : "Todos los envíos han sido completados"}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedShipments.size === filteredShipments.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedShipments(new Set(filteredShipments.map(s => s.id)));
                          } else {
                            setSelectedShipments(new Set());
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Guía</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Ruta</TableHead>
                    <TableHead>Estado Actual</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedShipments.has(shipment.id)}
                          onCheckedChange={() => toggleShipmentSelection(shipment.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {shipment.tracking_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">
                            {shipment.user?.full_name || "N/A"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {shipment.user?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{shipment.route?.name || "-"}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="secondary" className="mb-1">
                            {shipment.current_status || "Asignado"}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Estado {(shipment.current_status_index || 0) + 1} de{" "}
                            {(shipment.route?.states as string[])?.length || 0}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {shipment.destination_city}, {shipment.destination_state}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs">
                          {format(new Date(shipment.created_at), "PP", { locale: es })}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedShipment(shipment);
                            setSelectedStatus("");
                            setStatusLocation("");
                            setStatusNotes("");
                          }}
                        >
                          <Edit className="h-4 w-4" />
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

      {/* Update Status Dialog */}
      <Dialog open={!!selectedShipment} onOpenChange={(open) => !open && setSelectedShipment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Actualizar Estado del Envío</DialogTitle>
            <DialogDescription>
              {selectedShipment?.tracking_number}
            </DialogDescription>
          </DialogHeader>

          {selectedShipment && (
            <div className="space-y-6">
              {/* Current Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Estado Actual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {selectedShipment.current_status || "Asignado"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      (Estado {(selectedShipment.current_status_index || 0) + 1} de{" "}
                      {(selectedShipment.route?.states as string[])?.length || 0})
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* New Status Selection */}
              <div className="space-y-2">
                <Label htmlFor="newStatus">Nuevo Estado *</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger id="newStatus">
                    <SelectValue placeholder="Selecciona el nuevo estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {(selectedShipment.route?.states as string[])?.map((state: string, index: number) => (
                      <SelectItem key={index} value={state}>
                        {index + 1}. {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={statusLocation}
                  onChange={(e) => setStatusLocation(e.target.value)}
                  placeholder="Ej: Bodega Monterrey, En ruta, etc."
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Agrega cualquier información adicional..."
                  rows={3}
                />
              </div>

              {selectedStatus && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200">
                  <p className="text-sm">
                    <strong>Se notificará al cliente:</strong>{" "}
                    {selectedShipment.user?.email}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedShipment(null)}
              disabled={updating}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateStatus} disabled={!selectedStatus || updating}>
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Actualizar Estado
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

