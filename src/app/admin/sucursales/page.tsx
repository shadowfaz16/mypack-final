"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { BranchWithStats } from "@/types/database.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Building2, Plus, Edit, Trash2, Loader2, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

export default function SucursalesPage() {
  const [branches, setBranches] = useState<BranchWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchWithStats | null>(null);
  const [branchToDelete, setBranchToDelete] = useState<BranchWithStats | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    phone: "",
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    setLoading(true);
    const supabase = createClient();

    // Get branches with employee count
    const { data: branchesData } = await supabase
      .from("branches")
      .select("*")
      .order("name");

    if (branchesData) {
      const branchesWithEmployees = await Promise.all(
        branchesData.map(async (branch) => {
          const { data: employees } = await supabase
            .from("users")
            .select("id")
            .eq("branch_id", branch.id)
            .eq("role", "empleado");

          return {
            ...branch,
            employeeCount: employees?.length || 0,
          };
        })
      );

      setBranches(branchesWithEmployees);
    }

    setLoading(false);
  };

  const handleOpenDialog = (branch?: BranchWithStats) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        name: branch.name,
        address: branch.address,
        city: branch.city,
        state: branch.state,
        phone: branch.phone || "",
      });
    } else {
      setEditingBranch(null);
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        phone: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.address || !formData.city || !formData.state) {
      toast.error("Error", { description: "Completa todos los campos requeridos" });
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      if (editingBranch) {
        // Update existing branch
        const { error } = await supabase
          .from("branches")
          .update(formData)
          .eq("id", editingBranch.id);

        if (error) throw error;
        toast.success("Sucursal actualizada exitosamente");
      } else {
        // Create new branch
        const { error } = await supabase
          .from("branches")
          .insert({ ...formData, is_active: true });

        if (error) throw error;
        toast.success("Sucursal creada exitosamente");
      }

      setDialogOpen(false);
      fetchBranches();
    } catch (error) {
      console.error("Error saving branch:", error);
      toast.error("Error al guardar sucursal");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (branch: BranchWithStats) => {
    setBranchToDelete(branch);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!branchToDelete) return;

    setDeleting(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("branches")
      .delete()
      .eq("id", branchToDelete.id);

    if (error) {
      toast.error("Error al eliminar sucursal", {
        description: error.message,
      });
    } else {
      toast.success("Sucursal eliminada exitosamente");
      fetchBranches();
    }

    setDeleting(false);
    setDeleteDialogOpen(false);
    setBranchToDelete(null);
  };

  const handleToggleActive = async (branchId: string, currentStatus: boolean) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("branches")
      .update({ is_active: !currentStatus })
      .eq("id", branchId);

    if (error) {
      toast.error("Error al actualizar sucursal");
    } else {
      toast.success(currentStatus ? "Sucursal desactivada" : "Sucursal activada");
      fetchBranches();
    }
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
            <Building2 className="h-8 w-8 text-primary" />
            <span>Sucursales</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Administra las oficinas físicas en México
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Sucursal
        </Button>
      </div>

      {/* Branches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Sucursales</CardTitle>
          <CardDescription>
            {branches.length} sucursal{branches.length !== 1 ? "es" : ""} registrada{branches.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {branches.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">No hay sucursales configuradas</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Sucursal
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Empleados</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell>
                        <p className="font-semibold">{branch.name}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm">{branch.address}</p>
                            <p className="text-sm text-muted-foreground">
                              {branch.city}, {branch.state}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {branch.phone ? (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{branch.phone}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {branch.employeeCount} empleado{branch.employeeCount !== 1 ? "s" : ""}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={branch.is_active ? "default" : "secondary"}
                          size="sm"
                          onClick={() => handleToggleActive(branch.id, branch.is_active)}
                        >
                          {branch.is_active ? "Activa" : "Inactiva"}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(branch)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(branch)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBranch ? "Editar Sucursal" : "Nueva Sucursal"}
            </DialogTitle>
            <DialogDescription>
              {editingBranch
                ? "Modifica la información de la sucursal"
                : "Crea una nueva oficina física en México"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Monterrey Centro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Av. Ejemplo #123, Col. Centro"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Monterrey"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="Nuevo León"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+52 81 1234 5678"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                editingBranch ? "Guardar Cambios" : "Crear Sucursal"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta sucursal?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La sucursal &ldquo;{branchToDelete?.name}&rdquo; será eliminada.
              Los empleados asignados a esta sucursal quedarán sin sucursal asignada.
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
                "Eliminar Sucursal"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

