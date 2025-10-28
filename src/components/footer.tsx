import Link from "next/link";
import { Package, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">MY PACK MX</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Envíos de USA a México. Fácil, rápido y seguro.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/servicios" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/cotizador" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cotizar Envío
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">Envíos de Menudeo</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Envíos de Mayoreo</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Seguro de Mercancías</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Rastreo en Tiempo Real</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Laredo, TX 78040, USA
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a 
                  href="tel:+19561234567" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  +1 (956) 123-4567
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <a 
                  href="mailto:contacto@mypackmx.com" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  contacto@mypackmx.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} MY PACK MX. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <Link href="/terminos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Términos y Condiciones
              </Link>
              <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

