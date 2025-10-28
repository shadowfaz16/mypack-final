import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SuccessPageProps {
  searchParams: {
    session_id?: string;
    tracking?: string;
  };
}

export default function PaymentSuccessPage({ searchParams }: SuccessPageProps) {
  const { tracking } = searchParams;

  if (!tracking) {
    redirect("/cotizador");
  }

  return (
    <div className="flex flex-col py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Icon */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">¡Pago Exitoso!</h1>
            <p className="text-lg text-muted-foreground">
              Tu guía de envío ha sido generada y enviada a tu email
            </p>
          </div>

          {/* Tracking Number Card */}
          <Card className="border-2 border-primary">
            <CardHeader className="text-center">
              <CardTitle>Tu Número de Guía</CardTitle>
              <CardDescription>
                Usa este número para rastrear tu envío
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p className="text-3xl font-mono font-bold text-primary">
                  {tracking}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Este número también ha sido enviado a tu correo electrónico
              </p>
            </CardContent>
          </Card>

          {/* Next Steps Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Próximos Pasos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">Revisa tu email</p>
                    <p className="text-sm text-muted-foreground">
                      Hemos enviado tu guía en PDF con un código QR para rastreo
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">Prepara tu paquete</p>
                    <p className="text-sm text-muted-foreground">
                      Imprime la guía y pégala en tu paquete, o simplemente menciona el número de guía
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">Entrega en Laredo</p>
                    <p className="text-sm text-muted-foreground">
                      Lleva tu paquete a nuestra bodega en Laredo o envíalo por paquetería
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">Rastrea tu envío</p>
                    <p className="text-sm text-muted-foreground">
                      Sigue tu paquete en tiempo real desde tu dashboard
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warehouse Info Card */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-base">Bodega en Laredo, TX</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>Dirección:</strong> {process.env.LAREDO_WAREHOUSE_ADDRESS || "123 Warehouse St, Laredo, TX 78040"}
              </p>
              <p>
                <strong>Teléfono:</strong> {process.env.LAREDO_WAREHOUSE_PHONE || "+1 (956) 123-4567"}
              </p>
              <p>
                <strong>Horario:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1" size="lg">
              <Link href={`/tracking/${tracking}`}>
                <Package className="mr-2 h-5 w-5" />
                Rastrear mi Envío
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1" size="lg">
              <Link href="/dashboard">
                <ArrowRight className="mr-2 h-5 w-5" />
                Ir al Dashboard
              </Link>
            </Button>
          </div>

          {/* Help Section */}
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                ¿Necesitas ayuda? Estamos aquí para ti
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/contacto">Contactar Soporte</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/faq">Ver Preguntas Frecuentes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

