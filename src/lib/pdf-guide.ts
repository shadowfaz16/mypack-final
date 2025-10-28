import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { ShipmentDimensions } from '@/types/database.types';
import { createElement as h } from 'react';

export interface GenerateGuidePDFParams {
  trackingNumber: string;
  customerName: string;
  customerPhone?: string;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationZipcode?: string;
  weight: number;
  dimensions: ShipmentDimensions;
  declaredValue?: number;
  insurancePurchased: boolean;
  qrCodeDataUrl: string;
  createdAt: Date;
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  companyTagline: {
    fontSize: 10,
    color: '#666',
  },
  trackingSection: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    textAlign: 'center',
  },
  trackingLabel: {
    fontSize: 12,
    marginBottom: 5,
    color: '#666',
  },
  trackingNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  qrCodeSection: {
    alignItems: 'center',
    marginVertical: 15,
  },
  qrCode: {
    width: 150,
    height: 150,
  },
  qrInstruction: {
    fontSize: 8,
    color: '#666',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
    color: '#2563eb',
  },
  infoBox: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderLeft: 3,
    borderLeftColor: '#16a34a',
  },
  infoLabel: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  column: {
    flex: 1,
    marginRight: 10,
  },
  instructionsBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  instructionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#92400e',
  },
  instructionText: {
    fontSize: 9,
    lineHeight: 1.5,
    marginBottom: 5,
  },
  warehouseSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
});

/**
 * Creates the PDF Document structure using createElement
 */
function createShippingGuideDocument(props: GenerateGuidePDFParams) {
  const laredo_address = process.env.LAREDO_WAREHOUSE_ADDRESS || '123 Warehouse St, Laredo, TX 78040';
  const laredo_phone = process.env.LAREDO_WAREHOUSE_PHONE || '+1 956 123 4567';

  const pageSize = 'LETTER' as const;
  return h(Document, {},
    h(Page, { size: pageSize, style: styles.page },
      // Header
      h(View, { style: styles.header },
        h(Text, { style: styles.companyName }, 'MY PACK MX'),
        h(Text, { style: styles.companyTagline }, 'Envíos de USA a México - Fácil, Rápido y Seguro')
      ),
      
      // Tracking Number Section
      h(View, { style: styles.trackingSection },
        h(Text, { style: styles.trackingLabel }, 'Número de Guía'),
        h(Text, { style: styles.trackingNumber }, props.trackingNumber)
      ),
      
      // QR Code
      h(View, { style: styles.qrCodeSection },
        h(Image, { src: props.qrCodeDataUrl, style: styles.qrCode }),
        h(Text, { style: styles.qrInstruction }, 'Escanea para rastrear tu envío')
      ),
      
      // Customer Information
      h(Text, { style: styles.sectionTitle }, 'Información del Cliente'),
      h(View, { style: styles.infoBox },
        h(Text, { style: styles.infoLabel }, 'Nombre:'),
        h(Text, { style: styles.infoValue }, props.customerName)
      ),
      props.customerPhone && h(View, { style: styles.infoBox },
        h(Text, { style: styles.infoLabel }, 'Teléfono:'),
        h(Text, { style: styles.infoValue }, props.customerPhone)
      ),
      
      // Destination Information
      h(Text, { style: styles.sectionTitle }, 'Destino de Entrega'),
      h(View, { style: styles.infoBox },
        h(Text, { style: styles.infoLabel }, 'Dirección:'),
        h(Text, { style: styles.infoValue }, props.destinationAddress),
        h(Text, { style: styles.infoValue }, 
          `${props.destinationCity}, ${props.destinationState}${props.destinationZipcode ? ' ' + props.destinationZipcode : ''}`
        )
      ),
      
      // Package Details
      h(Text, { style: styles.sectionTitle }, 'Detalles del Paquete'),
      h(View, { style: styles.row },
        h(View, { style: styles.column },
          h(View, { style: styles.infoBox },
            h(Text, { style: styles.infoLabel }, 'Peso:'),
            h(Text, { style: styles.infoValue }, `${props.weight.toFixed(2)} kg`)
          )
        ),
        h(View, { style: styles.column },
          h(View, { style: styles.infoBox },
            h(Text, { style: styles.infoLabel }, 'Dimensiones (L x W x H):'),
            h(Text, { style: styles.infoValue }, 
              `${props.dimensions.length} x ${props.dimensions.width} x ${props.dimensions.height} cm`
            )
          )
        )
      ),
      
      // Insurance info if applicable
      props.declaredValue && h(View, { style: styles.row },
        h(View, { style: styles.column },
          h(View, { style: styles.infoBox },
            h(Text, { style: styles.infoLabel }, 'Valor Declarado:'),
            h(Text, { style: styles.infoValue }, 
              `$${props.declaredValue.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`
            )
          )
        ),
        h(View, { style: styles.column },
          h(View, { style: styles.infoBox },
            h(Text, { style: styles.infoLabel }, 'Seguro:'),
            h(Text, { style: styles.infoValue }, 
              props.insurancePurchased ? '✓ Contratado' : '✗ No contratado'
            )
          )
        )
      ),
      
      // Instructions
      h(View, { style: styles.instructionsBox },
        h(Text, { style: styles.instructionTitle }, 'INSTRUCCIONES IMPORTANTES:'),
        h(Text, { style: styles.instructionText }, 
          '• PEGA ESTA GUÍA en tu paquete de forma visible, o menciona el número de guía en nuestra bodega.'
        ),
        h(Text, { style: styles.instructionText }, 
          '• Entrega tu paquete en nuestra bodega de Laredo o envíalo por paquetería.'
        ),
        h(Text, { style: styles.instructionText }, 
          '• Asegúrate de que el paquete esté bien sellado y protegido.'
        ),
        h(Text, { style: styles.instructionText }, 
          `• Rastrea tu envío en: mypackmx.com/tracking/${props.trackingNumber}`
        )
      ),
      
      // Warehouse Information
      h(View, { style: styles.warehouseSection },
        h(Text, { style: styles.sectionTitle }, 'Bodega en Laredo, TX'),
        h(Text, { style: styles.instructionText }, `Dirección: ${laredo_address}`),
        h(Text, { style: styles.instructionText }, `Teléfono: ${laredo_phone}`),
        h(Text, { style: styles.instructionText }, 'Horario: Lunes a Viernes 9:00 AM - 6:00 PM')
      ),
      
      // Footer
      h(View, { style: styles.footer },
        h(Text, {}, 
          `MY PACK MX | www.mypackmx.com | Fecha de emisión: ${props.createdAt.toLocaleDateString('es-MX')}`
        ),
        h(Text, {}, 'Este documento es tu guía de envío. Consérvalo hasta recibir tu paquete.')
      )
    )
  );
}

/**
 * Generates a shipping guide PDF and returns it as a Buffer
 */
export async function generateShippingGuidePDF(
  params: GenerateGuidePDFParams
): Promise<Buffer> {
  try {
    const doc = createShippingGuideDocument(params);
    const pdfBuffer = await renderToBuffer(doc);
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate shipping guide PDF');
  }
}

/**
 * Helper function to validate PDF generation parameters
 */
export function validateGuidePDFParams(params: GenerateGuidePDFParams): boolean {
  if (!params.trackingNumber || params.trackingNumber.trim() === '') {
    throw new Error('Tracking number is required');
  }
  if (!params.customerName || params.customerName.trim() === '') {
    throw new Error('Customer name is required');
  }
  if (!params.destinationAddress || params.destinationAddress.trim() === '') {
    throw new Error('Destination address is required');
  }
  if (!params.qrCodeDataUrl || params.qrCodeDataUrl.trim() === '') {
    throw new Error('QR code is required');
  }
  if (params.weight <= 0) {
    throw new Error('Weight must be greater than 0');
  }
  
  return true;
}
