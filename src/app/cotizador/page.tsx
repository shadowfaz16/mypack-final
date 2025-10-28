"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Shield, CreditCard, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

// Form schema
const calculatorSchema = z.object({
  // Step 1: Package details
  length: z.number().min(1, "El largo debe ser mayor a 0"),
  width: z.number().min(1, "El ancho debe ser mayor a 0"),
  height: z.number().min(1, "El alto debe ser mayor a 0"),
  weight: z.number().min(0.1, "El peso debe ser mayor a 0"),
  
  // Step 2: Destination
  destinationAddress: z.string().min(5, "La dirección es requerida"),
  destinationCity: z.string().min(2, "La ciudad es requerida"),
  destinationState: z.string().min(2, "El estado es requerido"),
  destinationZipcode: z.string().optional(),
  
  // Step 3: Insurance
  includeInsurance: z.boolean(),
  declaredValue: z.number().optional(),
});

type CalculatorForm = z.infer<typeof calculatorSchema>;

const mexicanStates = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
  "Chihuahua", "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo",
  "Jalisco", "México", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca",
  "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora",
  "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas",
];

export default function CotizadorPage() {
  const { isSignedIn } = useAuth();
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [priceCalculation, setPriceCalculation] = useState<{
    serviceCost: number;
    insuranceCost: number;
    totalCost: number;
    serviceType: string;
  } | null>(null);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<CalculatorForm>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      includeInsurance: false,
      declaredValue: 0,
    },
  });

  const includeInsurance = watch("includeInsurance");
  const declaredValue = watch("declaredValue");

  const handleNextStep = async () => {
    let fieldsToValidate: (keyof CalculatorForm)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["length", "width", "height", "weight"];
    } else if (step === 2) {
      fieldsToValidate = ["destinationAddress", "destinationCity", "destinationState"];
    } else if (step === 3 && includeInsurance) {
      fieldsToValidate = ["declaredValue"];
    }
    
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      if (step === 3) {
        await calculatePrice();
      } else {
        setStep(step + 1);
      }
    }
  };

  const calculatePrice = async () => {
    setIsCalculating(true);
    
    try {
      const formData = getValues();
      
      // Simulate API call to calculate price
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock calculation (in production, this would call your pricing API)
      const billableWeight = Math.max(
        formData.weight,
        (formData.length * formData.width * formData.height) / 5000
      );
      
      const basePrice = formData.weight <= 50 ? 150 : 600;
      const pricePerKg = formData.weight <= 50 ? 25 : 10;
      const serviceCost = basePrice + (billableWeight * pricePerKg);
      
      let insuranceCost = 0;
      if (formData.includeInsurance && formData.declaredValue) {
        const rate = formData.declaredValue <= 1000 ? 2.5 : 
                     formData.declaredValue <= 5000 ? 2.0 : 1.5;
        insuranceCost = (formData.declaredValue * rate) / 100;
      }
      
      setPriceCalculation({
        serviceCost: Math.round(serviceCost * 100) / 100,
        insuranceCost: Math.round(insuranceCost * 100) / 100,
        totalCost: Math.round((serviceCost + insuranceCost) * 100) / 100,
        serviceType: formData.weight <= 50 ? "Menudeo" : "Mayoreo",
      });
      
      setStep(4);
    } catch {
      toast.error("Error al calcular el precio", {
        description: "Por favor intenta de nuevo",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePayment = async () => {
    if (!isSignedIn) {
      toast.error("Debes iniciar sesión", {
        description: "Por favor inicia sesión o regístrate para continuar",
      });
      return;
    }

    setIsCalculating(true);

    try {
      const formData = getValues();
      
      // Call Stripe checkout API
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Package details
          length: formData.length,
          width: formData.width,
          height: formData.height,
          weight: formData.weight,
          // Destination
          destinationAddress: formData.destinationAddress,
          destinationCity: formData.destinationCity,
          destinationState: formData.destinationState,
          destinationZipcode: formData.destinationZipcode,
          customerDestination: `${formData.destinationCity}, ${formData.destinationState}`,
          // Insurance
          includeInsurance: formData.includeInsurance,
          declaredValue: formData.declaredValue,
          // Pricing
          serviceCost: priceCalculation?.serviceCost,
          insuranceCost: priceCalculation?.insuranceCost,
          totalCost: priceCalculation?.totalCost,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear sesión de pago");
      }

      // Redirect to Stripe Checkout
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        throw new Error("No se recibió URL de pago");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Error al procesar el pago", {
        description: error instanceof Error ? error.message : "Por favor intenta de nuevo",
      });
      setIsCalculating(false);
    }
  };

  return (
    <div className="flex flex-col py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Cotizador de Envíos</h1>
            <p className="text-lg text-muted-foreground">
              Obtén tu cotización en 3 simples pasos
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 4 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        step > s ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between max-w-2xl mx-auto mt-2 text-sm">
              <span className={step === 1 ? "text-primary font-semibold" : "text-muted-foreground"}>
                Paquete
              </span>
              <span className={step === 2 ? "text-primary font-semibold" : "text-muted-foreground"}>
                Destino
              </span>
              <span className={step === 3 ? "text-primary font-semibold" : "text-muted-foreground"}>
                Seguro
              </span>
              <span className={step === 4 ? "text-primary font-semibold" : "text-muted-foreground"}>
                Precio
              </span>
            </div>
          </div>

          {/* Step 1: Package Details */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Package className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Detalles del Paquete</CardTitle>
                    <CardDescription>
                      Ingresa las dimensiones y peso de tu paquete
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Largo (cm)</Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      placeholder="30"
                      {...register("length", { valueAsNumber: true })}
                    />
                    {errors.length && (
                      <p className="text-sm text-destructive">{errors.length.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="width">Ancho (cm)</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      placeholder="20"
                      {...register("width", { valueAsNumber: true })}
                    />
                    {errors.width && (
                      <p className="text-sm text-destructive">{errors.width.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Alto (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      placeholder="15"
                      {...register("height", { valueAsNumber: true })}
                    />
                    {errors.height && (
                      <p className="text-sm text-destructive">{errors.height.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="5.5"
                    {...register("weight", { valueAsNumber: true })}
                  />
                  {errors.weight && (
                    <p className="text-sm text-destructive">{errors.weight.message}</p>
                  )}
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Nota:</strong> El precio se calcula con base en el peso volumétrico o real (el que sea mayor).
                    Peso volumétrico = (L x A x H) / 5000
                  </p>
                </div>

                <Button onClick={handleNextStep} className="w-full" size="lg">
                  Siguiente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Destination */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Dirección de Entrega</CardTitle>
                    <CardDescription>
                      ¿Dónde quieres recibir tu paquete?
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="destinationAddress">Dirección completa</Label>
                  <Input
                    id="destinationAddress"
                    placeholder="Calle Ejemplo #123, Col. Centro"
                    {...register("destinationAddress")}
                  />
                  {errors.destinationAddress && (
                    <p className="text-sm text-destructive">{errors.destinationAddress.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destinationCity">Ciudad</Label>
                    <Input
                      id="destinationCity"
                      placeholder="Monterrey"
                      {...register("destinationCity")}
                    />
                    {errors.destinationCity && (
                      <p className="text-sm text-destructive">{errors.destinationCity.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destinationZipcode">Código Postal</Label>
                    <Input
                      id="destinationZipcode"
                      placeholder="64000"
                      {...register("destinationZipcode")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinationState">Estado</Label>
                  <Select onValueChange={(value) => setValue("destinationState", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {mexicanStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.destinationState && (
                    <p className="text-sm text-destructive">{errors.destinationState.message}</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Atrás
                  </Button>
                  <Button onClick={handleNextStep} className="flex-1">
                    Siguiente
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Insurance */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Seguro (Opcional)</CardTitle>
                    <CardDescription>
                      Protege tu envío contra daños, pérdidas o robos
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="includeInsurance"
                    checked={includeInsurance}
                    onCheckedChange={(checked) => setValue("includeInsurance", checked as boolean)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="includeInsurance" className="text-base font-semibold cursor-pointer">
                      Deseo contratar seguro para mi envío
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Cubre daños, pérdidas y robos durante el transporte. El costo es un pequeño porcentaje del valor declarado.
                    </p>
                  </div>
                </div>

                {includeInsurance && (
                  <div className="space-y-2 pl-8">
                    <Label htmlFor="declaredValue">Valor declarado de la mercancía (MXN)</Label>
                    <Input
                      id="declaredValue"
                      type="number"
                      step="0.01"
                      placeholder="2000.00"
                      {...register("declaredValue", { valueAsNumber: true })}
                    />
                    {errors.declaredValue && (
                      <p className="text-sm text-destructive">{errors.declaredValue.message}</p>
                    )}
                    {declaredValue && declaredValue > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Costo estimado del seguro: ${((declaredValue * 2.0) / 100).toFixed(2)} MXN (2%)
                      </p>
                    )}
                  </div>
                )}

                <Separator />

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold mb-2">Tarifas de Seguro:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Hasta $1,000 MXN: 2.5%</li>
                    <li>• $1,001 - $5,000 MXN: 2.0%</li>
                    <li>• $5,001 - $20,000 MXN: 1.5%</li>
                    <li>• Más de $20,000 MXN: 1.0%</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Atrás
                  </Button>
                  <Button 
                    onClick={handleNextStep} 
                    className="flex-1"
                    disabled={isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Calculando...
                      </>
                    ) : (
                      <>
                        Calcular Precio
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Price Display */}
          {step === 4 && priceCalculation && (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Tu Cotización</CardTitle>
                    <CardDescription>
                      Resumen y precio de tu envío
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-6 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Tipo de servicio:</span>
                    <span className="font-semibold">{priceCalculation.serviceType}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Costo de servicio:</span>
                    <span className="font-semibold">
                      ${priceCalculation.serviceCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </span>
                  </div>
                  {priceCalculation.insuranceCost > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Seguro:</span>
                      <span className="font-semibold">
                        ${priceCalculation.insuranceCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold text-primary">
                      ${priceCalculation.totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm">
                    <strong>¡Precio garantizado!</strong> Este precio se mantendrá al realizar tu pago.
                    Recibirás tu guía de envío inmediatamente por email.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button onClick={handlePayment} className="w-full" size="lg">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pagar y Generar Guía
                  </Button>
                  <Button onClick={() => setStep(3)} variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Modificar Cotización
                  </Button>
                </div>

                {!isSignedIn && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-center">
                      <strong>Nota:</strong> Debes iniciar sesión o registrarte para proceder con el pago.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

