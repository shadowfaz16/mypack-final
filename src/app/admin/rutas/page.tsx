"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { Route } from "@/types/database.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Route as RouteIcon, Plus, Edit, Trash2, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function RutasPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Error al cargar rutas", {
        description: error.message,
      });
    } else {
      setRoutes(data || []);
    }

    setLoading(false);
  };

  const handleToggleActive = async (routeId: string, currentStatus: boolean) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("routes")
      .update({ is_active: !currentStatus })
      .eq("id", routeId);

    if (error) {
      toast.error("Error al actualizar ruta", {
        description: error.message,
      });
    } else {
      toast.success(
        currentStatus ? "Ruta desactivada" : "Ruta activada"
      );
      fetchRoutes();
    }
  };

  const handleDeleteClick = (route: Route) => {
    setRouteToDelete(route);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!routeToDelete) return;

    setDeleting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("routes")
      .delete()
      .eq("id", routeToDelete.id);

    if (error) {
      toast.error("Error al eliminar ruta", {
        description: error.message,
      });
    } else {
      toast.success("Ruta eliminada exitosamente");
      fetchRoutes();
    }

    setDeleting(false);
    setDeleteDialogOpen(false);
    setRouteToDelete(null);
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <RouteIcon className="h-8 w-8 text-primary" />
            <span>Gestión de Rutas</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra las rutas de envío y sus estados personalizados
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/rutas/nueva">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Ruta
          </Link>
        </Button>
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rutas Activas</CardTitle>
          <CardDescription>
            {routes.length} ruta{routes.length !== 1 ? "s" : ""} configurada{routes.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {routes.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">No hay rutas configuradas</p>
              <p className="text-muted-foreground mb-4">
                Crea tu primera ruta para comenzar a asignar envíos
              </p>
              <Button asChild>
                <Link href="/admin/rutas/nueva">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Primera Ruta
                </Link>
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre de Ruta</TableHead>
                    <TableHead>Estados</TableHead>
                    <TableHead>Días Estimados</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routes.map((route) => {
                    const states = route.states as string[];
                    return (
                      <TableRow key={route.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{route.name}</p>
                            {route.description && (
                              <p className="text-sm text-muted-foreground">
                                {route.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {states.slice(0, 3).map((state, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {state}
                              </Badge>
                            ))}
                            {states.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{states.length - 3} más
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {states.length} estado{states.length !== 1 ? "s" : ""} total{states.length !== 1 ? "es" : ""}
                          </p>
                        </TableCell>
                        <TableCell>
                          {route.estimated_days ? (
                            <span>{route.estimated_days} días</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant={route.is_active ? "default" : "secondary"}
                            size="sm"
                            onClick={() => handleToggleActive(route.id, route.is_active)}
                          >
                            {route.is_active ? "Activa" : "Inactiva"}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/admin/rutas/${route.id}/editar`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(route)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta ruta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La ruta &ldquo;{routeToDelete?.name}&rdquo; será eliminada permanentemente.
              Los envíos asignados a esta ruta no se verán afectados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar Ruta"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

