"use client";

import { useState } from "react";
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

export default function NuevaRutaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    estimatedDays: "",
    states: ["Pago Confirmado", "Recibido en Laredo", "Entregado"],
  });

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
      const { error } = await supabase.from("routes").insert({
        name: formData.name,
        description: formData.description || null,
        estimated_days: formData.estimatedDays ? parseInt(formData.estimatedDays) : null,
        states: formData.states,
        is_active: true,
      });

      if (error) throw error;

      toast.success("Ruta creada exitosamente", {
        description: `La ruta "${formData.name}" ha sido creada`,
      });

      router.push("/admin/rutas");
    } catch (error) {
      console.error("Error creating route:", error);
      toast.error("Error al crear ruta", {
        description: "Por favor intenta de nuevo",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nueva Ruta</h1>
          <p className="text-muted-foreground mt-2">
            Crea una nueva ruta de envío con estados personalizados
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
                  <p className="text-xs text-muted-foreground">
                    Usa el formato: &ldquo;Origen → Destino&rdquo;
                  </p>
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
                  <p className="text-xs text-muted-foreground">
                    Tiempo aproximado desde Laredo hasta la entrega final
                  </p>
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
                      Crear Ruta
                    </>
                  )}
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/admin/rutas">Cancelar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Guía Rápida</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• El primer estado se asigna automáticamente al asignar la ruta</p>
                <p>• El último estado debe ser &ldquo;Entregado&rdquo; o similar</p>
                <p>• Puedes agregar estados intermedios según necesites</p>
                <p>• Los estados se pueden reordenar con las flechas</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">Ejemplos de Estados</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-1">
                <p>• Pago Confirmado</p>
                <p>• Recibido en Laredo</p>
                <p>• En Tránsito</p>
                <p>• En Aduana</p>
                <p>• En Bodega [Ciudad]</p>
                <p>• En Ruta de Entrega</p>
                <p>• Entregado</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

