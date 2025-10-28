"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RouteBuilder } from "@/components/route-builder";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface EditRutaPageProps {
  params: {
    id: string;
  };
}

export default function EditRutaPage({ params }: EditRutaPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    estimatedDays: "",
    states: ["Pago Confirmado"],
  });

  useEffect(() => {
    fetchRoute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRoute = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      toast.error("Error al cargar ruta", {
        description: error.message,
      });
      router.push("/admin/rutas");
    } else {
      setFormData({
        name: data.name,
        description: data.description || "",
        estimatedDays: data.estimated_days?.toString() || "",
        states: data.states as string[],
      });
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.states.length < 2) {
      toast.error("Error de validación", {
        description: "La ruta debe tener al menos 2 estados",
      });
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("routes")
        .update({
          name: formData.name,
          description: formData.description || null,
          estimated_days: formData.estimatedDays ? parseInt(formData.estimatedDays) : null,
          states: formData.states,
        })
        .eq("id", params.id);

      if (error) throw error;

      toast.success("Ruta actualizada exitosamente", {
        description: `La ruta "${formData.name}" ha sido actualizada`,
      });

      router.push("/admin/rutas");
    } catch (error) {
      console.error("Error updating route:", error);
      toast.error("Error al actualizar ruta", {
        description: "Por favor intenta de nuevo",
      });
    } finally {
      setSaving(false);
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
          <h1 className="text-3xl font-bold">Editar Ruta</h1>
          <p className="text-muted-foreground mt-2">
            Modifica la configuración de esta ruta
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/rutas">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de la Ruta</CardTitle>
                <CardDescription>
                  Detalles básicos de la ruta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Ruta *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Laredo → Ciudad Destino"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe esta ruta, sus paradas y características..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedDays">Días Estimados de Entrega</Label>
                  <Input
                    id="estimatedDays"
                    type="number"
                    min="1"
                    value={formData.estimatedDays}
                    onChange={(e) => setFormData({ ...formData, estimatedDays: e.target.value })}
                    placeholder="3"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estados de la Ruta</CardTitle>
                <CardDescription>
                  Define los estados por los que pasará el envío
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RouteBuilder
                  initialStates={formData.states}
                  onChange={(newStates) => setFormData({ ...formData, states: newStates })}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/rutas">Cancelar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-sm">⚠️ Advertencia</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                <p>
                  Modificar los estados puede afectar a envíos actualmente asignados a esta ruta.
                  Los envíos existentes mantendrán su estado actual pero podrían no coincidir con los nuevos estados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

