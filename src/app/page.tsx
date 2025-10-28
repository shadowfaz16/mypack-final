import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Shield, Clock, MapPin, CheckCircle, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Envía tus paquetes de{" "}
              <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                USA a México
              </span>
              <br />
              de forma fácil y segura
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Desde 1 caja pequeña hasta tráilers completos. Recepción en Laredo, TX y entrega a domicilio en México.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/cotizador">
                <Button size="lg" className="text-lg px-8">
                  Cotizar Envío
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/servicios">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Ver Servicios
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              En 4 simples pasos, tus paquetes llegan a México
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                step: "1",
                title: "Cotiza y Paga",
                description: "Ingresa los detalles de tu paquete y paga en línea con tarjeta. Recibe tu guía inmediatamente.",
                icon: Package,
              },
              {
                step: "2",
                title: "Recibe tu Guía",
                description: "Te enviamos por email tu guía con código QR. Imprímela o solo menciona tu número de guía.",
                icon: CheckCircle,
              },
              {
                step: "3",
                title: "Entrega en Laredo",
                description: "Deja tu paquete en nuestra bodega en Laredo o envíalo por paquetería.",
                icon: MapPin,
              },
              {
                step: "4",
                title: "Recíbelo en México",
                description: "Rastrea tu envío en tiempo real y recíbelo en tu domicilio en México.",
                icon: Clock,
              },
            ].map((item) => (
              <Card key={item.step} className="relative">
                <div className="absolute -top-4 left-6 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <CardHeader className="pt-8">
                  <item.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué elegir MY PACK MX?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Rastreo en Tiempo Real",
                description: "Sigue tu envío en cada paso del camino con nuestro sistema de tracking avanzado.",
                icon: MapPin,
                color: "text-blue-600",
              },
              {
                title: "Seguro Incluido",
                description: "Protege tus mercancías con nuestro seguro opcional a precios competitivos.",
                icon: Shield,
                color: "text-green-600",
              },
              {
                title: "Entregas Rápidas",
                description: "De 2 a 5 días dependiendo del destino. Servicio express disponible.",
                icon: Clock,
                color: "text-orange-600",
              },
            ].map((benefit) => (
              <Card key={benefit.title} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-muted">
                      <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              ¿Listo para enviar tu paquete?
            </h2>
            <p className="text-lg opacity-90">
              Obtén una cotización instantánea y recibe tu guía por email en minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/cotizador">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Cotizar Ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contacto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Contactar Soporte
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "María González",
                location: "Monterrey, N.L.",
                text: "Excelente servicio. Mis paquetes siempre llegan a tiempo y puedo rastrearlos en cada momento.",
              },
              {
                name: "Carlos Ramírez",
                location: "Chihuahua, Chih.",
                text: "Precios muy competitivos y el proceso es súper fácil. Ya he enviado más de 10 paquetes.",
              },
              {
                name: "Ana Martínez",
                location: "Saltillo, Coah.",
                text: "El rastreo en tiempo real me da mucha tranquilidad. Recomiendo MY PACK MX al 100%.",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4 italic">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
