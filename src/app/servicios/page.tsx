import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, Shield, MapPin, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

export default function ServiciosPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Nuestros Servicios</h1>
            <p className="text-xl text-muted-foreground">
              Soluciones de envío adaptadas a tus necesidades, desde paquetes pequeños hasta carga completa
            </p>
          </div>
        </div>
      </section>

      {/* Service Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Menudeo */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <Package className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-2xl">Servicio de Menudeo</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Ideal para envíos personales y pequeñas compras
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Desde 1 caja pequeña (10x10 cm)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Hasta 50 kg por envío</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Precio base desde $150 MXN</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Entrega en 3-5 días hábiles</span>
                  </div>
                </div>
                <Link href="/cotizador">
                  <Button className="w-full">Cotizar Menudeo</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Mayoreo */}
            <Card className="border-2 border-primary">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <Truck className="h-8 w-8 text-orange-600" />
                  <CardTitle className="text-2xl">Servicio de Mayoreo</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Para negocios y envíos de gran volumen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Desde 50 kg hasta tráilers completos</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tarimas y carga paletizada</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Precios preferenciales por volumen</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Asesoría personalizada</span>
                  </div>
                </div>
                <Link href="/cotizador">
                  <Button className="w-full">Cotizar Mayoreo</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-3xl">Seguro de Mercancías</CardTitle>
                <CardDescription className="text-base">
                  Protege tu inversión con nuestro seguro opcional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">¿Qué cubre?</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Daños durante el transporte</li>
                      <li>• Pérdida total o parcial</li>
                      <li>• Robo o extravío</li>
                      <li>• Incidentes en aduanas</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Costos</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• 2.5% del valor declarado (hasta $1,000 MXN)</li>
                      <li>• 2.0% del valor declarado ($1,000 - $5,000 MXN)</li>
                      <li>• 1.5% del valor declarado ($5,000 - $20,000 MXN)</li>
                      <li>• Tarifas preferenciales para valores mayores</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-center">
                    <strong>Ejemplo:</strong> Para un paquete con valor de $2,000 MXN, el costo del seguro sería de $40 MXN (2%)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reception Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Proceso de Recepción en Laredo</h2>
              <p className="text-lg text-muted-foreground">
                Dos opciones fáciles para entregar tus paquetes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>Opción 1: Entrega Personal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    Lleva tus paquetes directamente a nuestra bodega en Laredo, TX.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Dirección:</strong> 123 Warehouse St, Laredo, TX 78040</p>
                    <p><strong>Horario:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM</p>
                    <p><strong>Teléfono:</strong> +1 (956) 123-4567</p>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm">
                      <strong>Importante:</strong> Trae tu guía impresa o menciona tu número de guía al personal.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span>Opción 2: Envío por Paquetería</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-muted-foreground">
                    Envía tus paquetes desde tu ciudad usando cualquier paquetería (UPS, FedEx, USPS).
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Destinatario:</strong> MY PACK MX Warehouse</p>
                    <p><strong>Dirección:</strong> 123 Warehouse St, Laredo, TX 78040</p>
                    <p><strong>Referencia:</strong> Tu número de guía (MPM-XXXXXXXX-XXXXX)</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                    <p className="text-sm">
                      <strong>Tip:</strong> Incluye tu número de guía dentro del paquete y en el exterior.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Entrega a Domicilio</h2>
              <p className="text-lg text-muted-foreground">
                Recibe tus paquetes directamente en tu puerta
              </p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Tiempos de Entrega</h3>
                    <p className="text-sm text-muted-foreground">
                      De 2 a 5 días hábiles según destino. Servicio express disponible.
                    </p>
                  </div>
                  <div>
                    <MapPin className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Cobertura</h3>
                    <p className="text-sm text-muted-foreground">
                      Monterrey, Chihuahua, Coahuila y próximamente más destinos.
                    </p>
                  </div>
                  <div>
                    <CheckCircle className="h-10 w-10 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Rastreo</h3>
                    <p className="text-sm text-muted-foreground">
                      Sigue tu envío en tiempo real desde el pago hasta la entrega.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">¿Listo para enviar?</h2>
            <p className="text-lg text-muted-foreground">
              Obtén una cotización instantánea y comienza a enviar hoy mismo
            </p>
            <Link href="/cotizador">
              <Button size="lg" className="text-lg px-8">
                Cotizar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

