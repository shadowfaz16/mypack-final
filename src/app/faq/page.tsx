"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "¿Qué es MY PACK MX?",
          a: "MY PACK MX es un servicio de paquetería e importación que facilita el envío de paquetes desde Estados Unidos a México. Recibimos tus paquetes en Laredo, Texas y los entregamos a domicilio en México con rastreo en tiempo real.",
        },
        {
          q: "¿Cómo envío mis productos a Laredo?",
          a: "Tienes dos opciones: 1) Llevar personalmente tus paquetes a nuestra bodega en Laredo, o 2) Enviarlos por paquetería (UPS, FedEx, USPS) usando nuestra dirección como destino. Solo incluye tu número de guía MY PACK MX como referencia.",
        },
        {
          q: "¿Cuánto tarda el proceso completo?",
          a: "El tiempo total depende del destino: Monterrey: 2-3 días, Chihuahua: 4-5 días, Coahuila: 3-4 días. Esto es desde que recibimos el paquete en Laredo hasta la entrega en tu domicilio. También ofrecemos servicio express de 24-48 horas.",
        },
      ],
    },
    {
      category: "Productos y Restricciones",
      questions: [
        {
          q: "¿Qué productos puedo importar?",
          a: "Puedes importar la mayoría de productos de uso personal: ropa, electrónicos, juguetes, libros, cosméticos, suplementos, accesorios, etc. No aceptamos productos prohibidos por aduana o peligrosos.",
        },
        {
          q: "¿Qué restricciones hay?",
          a: "No podemos transportar: armas, municiones, drogas, materiales inflamables o explosivos, productos perecederos sin empaque adecuado, animales vivos, o cualquier artículo prohibido por las leyes aduanales de México y Estados Unidos.",
        },
        {
          q: "¿Necesito factura de mis productos?",
          a: "Para la mayoría de envíos personales no es necesario. Sin embargo, para envíos de alto valor (más de $1,000 USD) o envíos comerciales, se requiere factura para el despacho aduanal.",
        },
      ],
    },
    {
      category: "Precios y Pagos",
      questions: [
        {
          q: "¿Cómo se calculan los precios?",
          a: "El precio se basa en el peso volumétrico o real (el que sea mayor), las dimensiones del paquete y el destino en México. Puedes obtener una cotización instantánea en nuestra calculadora sin necesidad de registrarte.",
        },
        {
          q: "¿Qué métodos de pago aceptan?",
          a: "Aceptamos pagos con tarjetas de crédito y débito (Visa, Mastercard, American Express) a través de Stripe. El pago es 100% seguro y cifrado.",
        },
        {
          q: "¿Cuándo debo pagar?",
          a: "El pago se realiza antes de generar tu guía de envío. Una vez confirmado el pago, recibes tu guía por email inmediatamente con tu número de rastreo único.",
        },
      ],
    },
    {
      category: "Seguro y Protección",
      questions: [
        {
          q: "¿Cómo funciona el seguro?",
          a: "El seguro es opcional y cubre daños, pérdidas o robos durante el transporte. El costo es un porcentaje del valor declarado de tu mercancía (desde 0.75% hasta 2.5% según el valor). En caso de incidente, reembolsamos el valor declarado.",
        },
        {
          q: "¿Vale la pena contratar el seguro?",
          a: "Recomendamos el seguro para envíos de valor medio-alto (más de $2,000 MXN) o artículos frágiles como electrónicos. El costo es mínimo comparado con la tranquilidad que te brinda.",
        },
        {
          q: "¿Qué hago si mi paquete llega dañado sin seguro?",
          a: "Sin seguro, no podemos reembolsar daños. Es importante empacar bien tus productos con protección adecuada (plástico burbuja, relleno, etc.) y considerar el seguro para artículos valiosos.",
        },
      ],
    },
    {
      category: "Rastreo y Entrega",
      questions: [
        {
          q: "¿Puedo rastrear mi paquete en tiempo real?",
          a: "Sí, desde el momento que pagas recibes un número de guía único. Puedes rastrearlo en cualquier momento en nuestra página web. Verás cada actualización: pago confirmado, recibido en Laredo, en tránsito, en bodega destino, y entregado.",
        },
        {
          q: "¿Qué pasa si no llevo la guía impresa?",
          a: "No hay problema. Si llevas tu paquete personalmente a Laredo sin la guía impresa, solo menciona tu número de guía (MPM-XXXXXXXX-XXXXX) y nuestro personal la imprimirá y la pegará en tu paquete.",
        },
        {
          q: "¿Entregan en toda la República Mexicana?",
          a: "Actualmente entregamos en Nuevo León (Monterrey y área metropolitana), Chihuahua y Coahuila. Estamos expandiendo nuestra cobertura constantemente. Contacta  con nosotros para consultar tu ubicación específica.",
        },
        {
          q: "¿Puedo cambiar la dirección de entrega después de pagar?",
          a: "Sí, pero solo antes de que el paquete sea recibido en Laredo. Una vez que está en tránsito, no es posible cambiar el destino. Contacta a soporte lo antes posible si necesitas un cambio.",
        },
      ],
    },
    {
      category: "Proceso y Logística",
      questions: [
        {
          q: "¿Qué sucede después de pagar?",
          a: "1) Recibes tu guía por email inmediatamente, 2) Entregas tu paquete en Laredo (personal o por paquetería), 3) Nuestro operador lo recibe y actualiza el estado, 4) Se transporta a México, 5) Se entrega en tu domicilio. Puedes seguir cada paso en tiempo real.",
        },
        {
          q: "¿Tienen personal en Laredo?",
          a: "Trabajamos con un operador logístico establecido que maneja la operación física en Laredo y el transporte a México. MY PACK MX se enfoca en la plataforma digital, atención al cliente y coordinación desde México.",
        },
        {
          q: "¿Qué pasa si hay un problema con mi envío?",
          a: "Nuestro equipo de soporte está disponible por email, WhatsApp y teléfono. Contacta con nosotros inmediatamente si hay algún problema y lo resolveremos a la brevedad. Si contrataste seguro, estás protegido ante incidentes.",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Preguntas Frecuentes</h1>
            <p className="text-xl text-muted-foreground">
              Encuentra respuestas a las dudas más comunes sobre nuestro servicio
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {faqs.map((category, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="text-2xl">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIdx) => (
                      <AccordionItem key={faqIdx} value={`item-${idx}-${faqIdx}`}>
                        <AccordionTrigger className="text-left">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="pt-6 space-y-4">
              <MessageCircle className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold">¿No encontraste tu respuesta?</h2>
              <p className="text-muted-foreground">
                Nuestro equipo de soporte está listo para ayudarte
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Link href="/contacto">
                  <Button>Contactar Soporte</Button>
                </Link>
                <Link href="/cotizador">
                  <Button variant="outline">Cotizar Envío</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

