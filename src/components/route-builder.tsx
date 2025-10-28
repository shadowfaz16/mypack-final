"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";

interface RouteBuilderProps {
  initialStates?: string[];
  onChange: (states: string[]) => void;
}

export function RouteBuilder({ initialStates = ["Pago Confirmado"], onChange }: RouteBuilderProps) {
  const [states, setStates] = useState<string[]>(initialStates);
  const [newState, setNewState] = useState("");

  const handleAddState = () => {
    if (newState.trim() === "") return;
    
    const updatedStates = [...states, newState.trim()];
    setStates(updatedStates);
    onChange(updatedStates);
    setNewState("");
  };

  const handleRemoveState = (index: number) => {
    const updatedStates = states.filter((_, i) => i !== index);
    setStates(updatedStates);
    onChange(updatedStates);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    
    const updatedStates = [...states];
    [updatedStates[index - 1], updatedStates[index]] = [updatedStates[index], updatedStates[index - 1]];
    setStates(updatedStates);
    onChange(updatedStates);
  };

  const handleMoveDown = (index: number) => {
    if (index === states.length - 1) return;
    
    const updatedStates = [...states];
    [updatedStates[index], updatedStates[index + 1]] = [updatedStates[index + 1], updatedStates[index]];
    setStates(updatedStates);
    onChange(updatedStates);
  };

  const handleStateChange = (index: number, value: string) => {
    const updatedStates = [...states];
    updatedStates[index] = value;
    setStates(updatedStates);
    onChange(updatedStates);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Estados de la Ruta</Label>
        <Badge variant="outline">{states.length} estados</Badge>
      </div>

      {/* Existing States */}
      <div className="space-y-2">
        {states.map((state, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <Badge variant="outline" className="flex-shrink-0">
                  {index + 1}
                </Badge>
                <Input
                  value={state}
                  onChange={(e) => handleStateChange(index, e.target.value)}
                  placeholder="Nombre del estado"
                  className="flex-1"
                />
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === states.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveState(index)}
                    disabled={states.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New State */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Input
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              placeholder="Nombre del nuevo estado (ej: En Tránsito)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddState();
                }
              }}
            />
            <Button type="button" onClick={handleAddState}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Presiona Enter o click en Agregar para añadir el estado
          </p>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Vista Previa del Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {states.map((state, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Badge variant={index === 0 ? "default" : "outline"}>
                  {index + 1}
                </Badge>
                <span className={index === 0 ? "font-semibold" : "text-muted-foreground"}>
                  {state}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-sm">
          <strong>Nota:</strong> El primer estado siempre será el que vean los clientes después de asignar la ruta.
          El último estado debe ser &ldquo;Entregado&rdquo; o equivalente.
        </p>
      </div>
    </div>
  );
}

