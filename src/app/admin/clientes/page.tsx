"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Loader2, Package, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { UserWithStats } from "@/types/database.types";

export default function ClientesPage() {
  const [clients, setClients] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const supabase = createClient();

    // Get all clients with shipment count
    const { data: usersData } = await supabase
      .from("users")
      .select("*")
      .eq("role", "cliente")
      .order("created_at", { ascending: false });

    // For each client, get shipment count
    if (usersData) {
      const clientsWithStats = await Promise.all(
        usersData.map(async (client) => {
          const { data: shipments } = await supabase
            .from("shipments")
            .select("id, total_cost, assignment_status")
            .eq("user_id", client.id);

          return {
            ...client,
            totalShipments: shipments?.length || 0,
            completedShipments: shipments?.filter(s => s.assignment_status === "completed").length || 0,
            totalSpent: shipments?.reduce((sum, s) => sum + Number(s.total_cost), 0) || 0,
          };
        })
      );

      setClients(clientsWithStats);
    }

    setLoading(false);
  };

  const filteredClients = clients.filter((client) =>
    client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Users className="h-8 w-8 text-primary" />
          <span>Gestión de Clientes</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Administra usuarios y consulta su historial de envíos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{clients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Clientes Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {clients.filter(c => (c.totalShipments ?? 0) > 0).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Envíos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {clients.reduce((sum, c) => sum + (c.totalShipments ?? 0), 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${clients.reduce((sum, c) => sum + (c.totalSpent ?? 0), 0).toLocaleString("es-MX")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClients.length} cliente{filteredClients.length !== 1 ? "s" : ""} {searchTerm ? "encontrado" + (filteredClients.length !== 1 ? "s" : "") : "registrado" + (filteredClients.length !== 1 ? "s" : "")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">No se encontraron clientes</p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Total Envíos</TableHead>
                    <TableHead>Completados</TableHead>
                    <TableHead>Gastado</TableHead>
                    <TableHead>Registro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <p className="font-medium">
                          {client.full_name || "Sin nombre"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{client.email}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{client.phone || "-"}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{client.totalShipments ?? 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={(client.completedShipments ?? 0) > 0 ? "default" : "outline"}>
                          {client.completedShipments ?? 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">
                          ${(client.totalSpent ?? 0).toLocaleString("es-MX")}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">
                            {format(new Date(client.created_at), "PP", { locale: es })}
                          </span>
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
    </div>
  );
}

