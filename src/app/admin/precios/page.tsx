"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { PricingRule, InsuranceRate } from "@/types/database.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Plus, Edit, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

export default function PreciosPage() {
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([]);
  const [insuranceRates, setInsuranceRates] = useState<InsuranceRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: pricingData } = await supabase
      .from("pricing_rules")
      .select("*")
      .order("destination_zone")
      .order("min_weight");

    const { data: insuranceData } = await supabase
      .from("insurance_rates")
      .select("*")
      .order("min_value");

    setPricingRules(pricingData || []);
    setInsuranceRates(insuranceData || []);
    setLoading(false);
  };

  const handleTogglePricingRule = async (ruleId: string, currentStatus: boolean) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("pricing_rules")
      .update({ is_active: !currentStatus })
      .eq("id", ruleId);

    if (error) {
      toast.error("Error al actualizar regla");
    } else {
      toast.success(currentStatus ? "Regla desactivada" : "Regla activada");
      fetchData();
    }
  };

  const handleToggleInsuranceRate = async (rateId: string, currentStatus: boolean) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("insurance_rates")
      .update({ is_active: !currentStatus })
      .eq("id", rateId);

    if (error) {
      toast.error("Error al actualizar tasa");
    } else {
      toast.success(currentStatus ? "Tasa desactivada" : "Tasa activada");
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Group pricing rules by destination and service type
  const groupedRules = pricingRules.reduce((acc, rule) => {
    const key = `${rule.destination_zone}-${rule.service_type}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(rule);
    return acc;
  }, {} as Record<string, PricingRule[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <DollarSign className="h-8 w-8 text-primary" />
          <span>Gestión de Precios</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Administra las reglas de precio y tasas de seguro
        </p>
      </div>

      <Tabs defaultValue="pricing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pricing">
            Reglas de Precio ({pricingRules.length})
          </TabsTrigger>
          <TabsTrigger value="insurance">
            Tasas de Seguro ({insuranceRates.length})
          </TabsTrigger>
        </TabsList>

        {/* Pricing Rules Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reglas de Precio</CardTitle>
                  <CardDescription>
                    Precios por peso, destino y tipo de servicio
                  </CardDescription>
                </div>
                <Button disabled>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Regla
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(groupedRules).map(([key, rules]) => {
                const [zone, type] = key.split("-");
                return (
                  <div key={key}>
                    <div className="flex items-center space-x-2 mb-3">
                      <h3 className="font-semibold text-lg">{zone}</h3>
                      <Badge variant={type === "menudeo" ? "default" : "secondary"}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rango de Peso (kg)</TableHead>
                            <TableHead>Precio Base</TableHead>
                            <TableHead>Precio por kg</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Acción</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rules.map((rule) => (
                            <TableRow key={rule.id}>
                              <TableCell>
                                {rule.min_weight} - {rule.max_weight} kg
                              </TableCell>
                              <TableCell className="font-semibold">
                                ${Number(rule.base_price).toLocaleString("es-MX")} MXN
                              </TableCell>
                              <TableCell>
                                ${Number(rule.price_per_kg).toLocaleString("es-MX")} MXN/kg
                              </TableCell>
                              <TableCell>
                                <Badge variant={rule.is_active ? "default" : "outline"}>
                                  {rule.is_active ? "Activa" : "Inactiva"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleTogglePricingRule(rule.id, rule.is_active)}
                                  >
                                    {rule.is_active ? "Desactivar" : "Activar"}
                                  </Button>
                                  <Button variant="outline" size="sm" disabled>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insurance Rates Tab */}
        <TabsContent value="insurance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Tasas de Seguro</span>
                  </CardTitle>
                  <CardDescription>
                    Porcentajes de seguro según valor declarado
                  </CardDescription>
                </div>
                <Button disabled>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Tasa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rango de Valor (MXN)</TableHead>
                      <TableHead>Tasa (%)</TableHead>
                      <TableHead>Ejemplo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insuranceRates.map((rate) => {
                      const exampleValue = (rate.min_value + rate.max_value) / 2;
                      const exampleCost = (exampleValue * rate.rate_percentage) / 100;
                      
                      return (
                        <TableRow key={rate.id}>
                          <TableCell>
                            ${Number(rate.min_value).toLocaleString("es-MX")} - ${Number(rate.max_value).toLocaleString("es-MX")}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {rate.rate_percentage}%
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            Valor: ${exampleValue.toLocaleString("es-MX")} →
                            Seguro: ${exampleCost.toLocaleString("es-MX")}
                          </TableCell>
                          <TableCell>
                            <Badge variant={rate.is_active ? "default" : "outline"}>
                              {rate.is_active ? "Activa" : "Inactiva"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleInsuranceRate(rate.id, rate.is_active)}
                              >
                                {rate.is_active ? "Desactivar" : "Activar"}
                              </Button>
                              <Button variant="outline" size="sm" disabled>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm">
            <strong>Nota:</strong> Las reglas de precio se aplican automáticamente en el cotizador
            según el peso del paquete y el destino. Puedes activar/desactivar reglas sin eliminarlas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

