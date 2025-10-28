import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, Target, Zap, Shield, Heart } from "lucide-react";
import Link from "next/link";

export default function NosotrosPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Sobre Nosotros</h1>
            <p className="text-xl text-muted-foreground">
              Facilitando importaciones accesibles desde Estados Unidos a México
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-3xl text-center">Nuestra Misión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-center text-muted-foreground">
                  Democratizar el acceso a productos de Estados Unidos para todos en México, 
                  ofreciendo un servicio de paquetería transparente, tecnológico y confiable 
                  que elimina las barreras de la importación tradicional.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Package className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>¿Quiénes somos?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    MY PACK MX es una plataforma digital que conecta a clientes en México con 
                    servicios de importación desde Estados Unidos. Somos intermediarios especializados 
                    que trabajan en alianza con operadores logísticos establecidos para brindarte 
                    el mejor servicio.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Nuestro Modelo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nos enfocamos en la experiencia digital: plataforma web, rastreo en tiempo real, 
                    atención al cliente y coordinación. Nuestro socio logístico maneja la operación 
                    física: recepción en Laredo, transporte transfronterizo y entregas en México.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nuestros Valores</h2>
              <p className="text-lg text-muted-foreground">
                Los principios que guían cada decisión que tomamos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                      <Shield className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <CardTitle>Transparencia</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Precios claros, rastreo en tiempo real y comunicación constante. 
                  Sin costos ocultos ni sorpresas.
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                      <Target className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <CardTitle>Confianza</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Alianza con operadores logísticos confiables, seguro opcional 
                  y compromiso con la seguridad de tus envíos.
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                      <Zap className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                  <CardTitle>Tecnología</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Plataforma digital moderna, guías instantáneas con QR, 
                  y sistema de rastreo que te mantiene informado.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Cómo Trabajamos</h2>
              <p className="text-lg text-muted-foreground">
                Un modelo de colaboración que beneficia a todos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-6 w-6 text-primary" />
                    <span>MY PACK MX</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Plataforma web y app móvil</li>
                    <li>• Sistema de cotización online</li>
                    <li>• Procesamiento de pagos (Stripe)</li>
                    <li>• Generación de guías con QR</li>
                    <li>• Sistema de rastreo en tiempo real</li>
                    <li>• Atención al cliente desde México</li>
                    <li>• Coordinación de rutas y envíos</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-600">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-green-600" />
                    <span>Operador Logístico</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Bodega de recepción en Laredo, TX</li>
                    <li>• Personal operativo en Laredo</li>
                    <li>• Transporte transfronterizo</li>
                    <li>• Despacho aduanal</li>
                    <li>• Bodegas en ciudades de destino</li>
                    <li>• Flota de reparto (última milla)</li>
                    <li>• Entregas a domicilio en México</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Colaboración Win-Win</h3>
                    <p className="text-muted-foreground">
                      Esta alianza nos permite enfocarnos en lo que hacemos mejor: la experiencia digital 
                      y atención al cliente, mientras nuestro socio logístico se especializa en la operación 
                      física. El resultado es un servicio de calidad superior para ti.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">¿Por qué Elegirnos?</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "Sin Infraestructura Propia = Mejores Precios",
                  description: "No tenemos los costos fijos de bodegas ni flotilla, por lo que podemos ofrecer precios más competitivos.",
                },
                {
                  title: "Tecnología de Primer Nivel",
                  description: "Inversión 100% enfocada en la mejor plataforma digital, rastreo en tiempo real y experiencia de usuario.",
                },
                {
                  title: "Escalabilidad sin Límites",
                  description: "Podemos crecer rápidamente y agregar más rutas sin inversión en infraestructura física.",
                },
                {
                  title: "Atención Personalizada",
                  description: "Equipo dedicado a resolver tus dudas y problemas de forma rápida y efectiva.",
                },
                {
                  title: "Transparencia Total",
                  description: "Tracking en cada paso, precios claros y comunicación constante sobre el estado de tu envío.",
                },
              ].map((item, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary to-green-600 text-primary-foreground">
            <CardContent className="pt-6 text-center space-y-4">
              <h2 className="text-3xl font-bold">Únete a Nosotros</h2>
              <p className="text-lg opacity-90">
                Comienza a importar de forma fácil, transparente y confiable
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Link href="/cotizador">
                  <Button size="lg" variant="secondary">
                    Cotizar Envío
                  </Button>
                </Link>
                <Link href="/contacto">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  >
                    Contacto
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

