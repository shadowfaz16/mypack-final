# MY PACK MX - Servicio de Paquetería Transfronteriza USA-México

## 📋 Descripción del Proyecto

MY PACK MX es una plataforma digital que comercializa servicios de paquetería e importación desde Estados Unidos a México. Actuamos como intermediarios entre clientes y un operador logístico establecido, ofreciendo un servicio integral desde la recepción en bodega en Laredo, Texas, hasta la entrega a domicilio en México.

### Modelo de Operación:
- **MY PACK MX**: Maneja ventas online, atención al cliente, pagos, tracking digital y gestión desde México
- **Operador Logístico (Socio)**: Maneja operaciones físicas (recepción en Laredo, transporte transfronterizo, entregas)
- **Sin personal propio en Laredo**: Dependemos de colaboración con socio logístico para operaciones

## 🎯 Propósito Principal

Vender servicios de importación y logística transfronteriza con las siguientes modalidades:
- **Menudeo**: Desde 1 caja pequeña (10x10 cm)
- **Mayoreo**: Hasta tráilers completos
- **Servicio de recepción**: Los clientes pueden dejar sus paquetes personalmente o enviárnoslos por paquetería
- **Entrega flexible**: A domicilio o en puntos de entrega

## 🛠 Stack Tecnológico

### Frontend
- **React**: Framework principal para la interfaz de usuario
- **Node.js**: Entorno de ejecución

### Backend
- **Supabase**: Base de datos (ya conectada vía MCP en Cursor)

### Integraciones
- **Clerk**: Sistema de autenticación (ya implementado)
- **Stripe**: Procesamiento de pagos (por implementar)
  - Pago de servicio de paquetería
  - Pago de seguro opcional

### Herramientas de Desarrollo
- **Cursor**: IDE con MCP conectado a Supabase

## 🎨 Estructura de la Aplicación

### 1. Sistema de Autenticación (Clerk)
- Registro obligatorio antes de cotizar
- Login/Logout
- Gestión de perfil de usuario
- Recuperación de contraseña

### 2. Cotizador Inteligente
El cotizador debe calcular precios basándose en:

#### Variables de Cálculo:
- **Dimensiones**: Largo x Ancho x Alto (cm)
- **Peso**: Kilogramos o libras
- **Tipo de carga**:
  - Caja individual
  - Múltiples cajas
  - Tarimas (pallets)
  - Carga completa (tráiler)
- **Valor del producto**: Para calcular seguro opcional
- **Dirección de entrega**: Para calcular costo de entrega a domicilio

#### Tipos de Cotización:
- **Menudeo**: Cargas pequeñas y medianas
- **Mayoreo**: Cargas grandes y tráilers completos

#### Seguro Opcional:
- Calculado como porcentaje del valor declarado del producto
- El cliente ingresa el valor de su mercancía
- Se muestra el costo adicional del seguro

**Importante**: Los precios deben incluir margen para MY PACK MX sobre el costo del operador logístico

### 3. Sistema de Guías y Rastreo

#### Generación de Guías:
- Cada envío recibe un **número de guía único** (ID alfanumérico) **inmediatamente al confirmar el pago**
- Formato sugerido: MPM-YYYYMMDD-XXXXX (ej: MPM-20250124-00001)
- Guía se envía por email en PDF con código QR
- Cliente puede rastrear desde el primer momento

#### Tracking en Dos Etapas:

**Etapa 1 - Antes de Asignar Ruta:**
- Cliente recibe guía inmediatamente
- Al consultar tracking ve: **"Pago Confirmado - En Proceso de Asignación"**
- Información visible: número de guía, destino, datos del envío
- **NO** se muestran estados detallados aún

**Etapa 2 - Después de Asignar Ruta:**
- Admin asigna ruta en el backend
- Cliente ahora ve en tracking:
  - ✅ Pago Confirmado (completado)
  - ○ Recibido en Laredo (pendiente)
  - ○ En Bodega [Ciudad] (pendiente)
  - ○ Entregado (pendiente)
- Timeline visual con la ruta completa
- Actualizaciones en tiempo real conforme avanza

#### Sistema de Rutas y Estados:

**Rutas Predefinidas** (editables desde admin):
- **Ruta 1**: Laredo → Monterrey → Entregado
- **Ruta 2**: Laredo → Chihuahua → Entregado  
- **Ruta 3**: Laredo → Coahuila → Entregado
- Posibilidad de agregar más rutas según operación

**Cada ruta tiene sus propios estados personalizados**

**Ejemplo - Ruta Laredo → Monterrey:**
1. **Pago Confirmado** (estado inicial automático al pagar)
2. **Recibido en Laredo** (actualizado manualmente)
3. **En Bodega Monterrey** (actualizado manualmente)
4. **Entregado** (actualizado manualmente)

**Nota Importante**: 
- El admin **asigna la ruta manualmente** después del pago basándose en el destino del cliente y disponibilidad del operador
- Hasta que se asigne la ruta, el cliente solo ve "Pago Confirmado"
- Una vez asignada la ruta, el cliente puede ver todos los estados posibles de su envío
- Los estados de cada ruta son completamente editables desde el panel admin

#### Sistema de QR - Funcionamiento Detallado:

**Para Identificación y Tracking del Cliente:**
- Cada guía incluye un código QR único
- El QR codifica la URL: `https://mypackmx.com/track/MPM-20250124-00001`
- Cliente escanea → Ve página de tracking (sin poder modificar nada)
- Funciona antes y después de asignar ruta

**Para Actualización de Estados (Opcional - Fase Futura):**

*Opción A - QR con Acceso Directo al Admin:*
```
1. Personal operativo escanea QR
2. QR abre: https://mypackmx.com/admin/update/MPM-20250124-00001
3. Si está logueado como admin → Ve pantalla de actualización rápida
4. Dropdown con estados disponibles según la ruta asignada
5. Selecciona nuevo estado → Botón [Actualizar]
6. Estado se actualiza y cliente recibe notificación
```

*Opción B - QR Solo para Identificar (Fase 1 - Recomendada):*
```
1. Personal operativo escanea QR
2. Ve número de guía: "MPM-20250124-00001"
3. Informa al admin por WhatsApp/llamada
4. Admin entra al panel y actualiza manualmente
```

**Funcionalidades del QR en Bodega Laredo:**
- Si cliente no pegó la guía, personal la imprime usando el número de guía
- Personal puede escanear para confirmar recepción (opcional)
- Verificación rápida de que el paquete correcto fue recibido

**Actualización Manual desde Panel Admin (Siempre Disponible):**
- Admin siempre puede actualizar cualquier estado sin necesidad del QR
- Panel con lista de envíos filtrable
- Click en envío → Ver estados disponibles → Seleccionar nuevo estado
- Actualización masiva: Seleccionar múltiples envíos y cambiar estado a todos
- Agregar notas en cada actualización

#### Base de Datos de Tracking (Supabase):
```sql
-- Tabla de Rutas Predefinidas
routes:
  - id (uuid, primary key)
  - name (string) "Laredo → Monterrey"
  - states (jsonb) ["Pago Confirmado", "Recibido en Laredo", "En Bodega Monterrey", "Entregado"]
  - description (text)
  - is_active (boolean)
  - created_at (timestamp)

-- Tabla de Envíos
shipments:
  - id (uuid, primary key)
  - tracking_number (string, unique)
  - user_id (foreign key a usuarios)
  - customer_destination (string) → "Monterrey, N.L." (lo que el cliente pidió)
  - route_id (uuid, foreign key, nullable) → NULL hasta que admin asigne
  - current_status (string)
  - current_status_index (integer) → Posición en el array de estados
  - assignment_status (enum: 'pending_assignment', 'assigned', 'active', 'completed')
  - created_at (timestamp) → Momento del pago
  - assigned_at (timestamp) → Momento que admin asignó ruta
  - updated_at (timestamp)
  - estimated_delivery (date)
  - dimensions (jsonb: largo, ancho, alto)
  - weight (numeric)
  - declared_value (numeric)
  - insurance_purchased (boolean)
  - destination_address (text)
  - qr_code (string, URL o base64)

-- Historial de Estados
status_updates:
  - id (uuid)
  - shipment_id (foreign key)
  - status (string)
  - timestamp (timestamp)
  - location (string)
  - notes (text)
  - updated_by (user_id del admin/operador)
  - update_type (enum: 'automatic', 'manual', 'qr_scan')
```

#### Notificaciones:
- **Email**: Cuando cambia el estado del envío
- **SMS** (opcional futuro): Alertas de estados críticos
- **In-app notifications**: Panel de usuario

### 4. Panel de Cliente

#### Vista de Tracking:
**Antes de Asignar Ruta:**
- Número de guía
- Estado: "Pago Confirmado - En Proceso de Asignación"
- Información del envío (dimensiones, peso, destino)
- Descargar guía en PDF
- Mensaje: "Tu envío está siendo procesado. Pronto verás más detalles."

**Después de Asignar Ruta:**
- Timeline visual completo con todos los estados de la ruta
- Estado actual destacado
- Fecha estimada de entrega
- Historial de cambios de estado con timestamps
- Información de la ruta asignada

#### Dashboard General:
- Envíos activos con estado actual
- Envíos completados (historial)
- Acceso rápido a rastreo de cada envío
- Descargar/imprimir guía con QR de cada envío
- Gestión de direcciones guardadas
- Métodos de pago guardados (Stripe)

### 5. Panel de Administración (INDISPENSABLE)

**Operado desde México por equipo de MY PACK MX**

#### Dashboard Principal:
- **Envíos Pendientes de Asignar** (requieren acción inmediata)
- Envíos en proceso por estado
- Envíos completados del día/semana
- Alertas y notificaciones importantes

#### Gestión de Rutas:
- **CRUD completo de rutas**:
  - Crear nueva ruta (nombre, estados personalizados)
  - Editar rutas existentes
  - Activar/desactivar rutas
  - Reordenar estados dentro de cada ruta
- **Ejemplos de rutas**:
  - Laredo → Monterrey (4 estados)
  - Laredo → Chihuahua (4 estados)
  - Laredo → Express MTY (3 estados)
- Vista previa de cómo se verá cada ruta para el cliente

#### Asignación de Envíos:
- **Lista de envíos pendientes de asignar**:
  - Filtros: fecha de pago, destino, monto
  - Vista: guía, cliente, destino solicitado, pago confirmado
  - Acción rápida: [Asignar Ruta]
- **Proceso de asignación**:
  1. Click en [Asignar Ruta]
  2. Ver detalles del envío (destino, dimensiones, peso)
  3. Seleccionar ruta del dropdown
  4. Confirmar asignación
  5. Cliente automáticamente ve la ruta en su tracking

#### Gestión de Envíos Activos:
- Lista de todos los envíos asignados (filtros por estado, fecha, cliente, ruta)
- **Actualizar estado de envíos manualmente** basado en:
  - Confirmaciones del operador logístico (WhatsApp, llamadas, etc.)
  - Escaneo de QR por personal operativo (si aplica)
  - Tiempos estimados programados
- Ver detalles completos de cada envío
- Agregar notas internas
- Gestionar incidencias
- **Actualización masiva**: Seleccionar múltiples envíos y cambiar estado a todos

#### Comunicación con Operador Logístico:
- Lista de envíos que necesitan confirmación de recepción en Laredo
- Lista de envíos en tránsito por ruta
- Lista de envíos listos para entrega
- **Exportar listas** para compartir con operador (Excel, PDF)
- Registro de comunicaciones/confirmaciones

#### Gestión de Precios:
- Configurar tablas de precios por:
  - Rangos de peso
  - Rangos de dimensiones
  - Tipo de servicio (menudeo/mayoreo)
  - Zonas de destino
- Configurar % de seguro sobre valor declarado

#### Gestión de Clientes:
- Lista de usuarios registrados
- Historial de envíos por cliente
- Estadísticas de uso

#### Puntos de Entrega:
- CRUD de puntos de entrega en México
- Dirección, horarios, contacto
- Capacidad y disponibilidad

#### Reportes y Estadísticas:
- Envíos por período
- Ingresos (Stripe integration)
- Estados más frecuentes
- Tiempos promedio de entrega
- Exportar datos (CSV, PDF)

## 🤝 Coordinación con Operador Logístico

### Información que Necesita el Operador:
Para cada envío, el operador necesita saber:
- Número de guía
- Nombre del cliente
- Dirección de entrega completa
- Dimensiones y peso del paquete
- Si tiene seguro contratado
- Valor declarado (si aplica)

### Métodos de Compartir Información:

**Fase Inicial (Manual)**:
- Exportar lista diaria de envíos esperados en Excel/PDF
- Enviar por WhatsApp o email al operador
- Confirmaciones telefónicas o por mensaje
- Admin actualiza estados basándose en feedback del operador

**Fase Futura (Automatizada)**:
- Panel simplificado para el operador (solo lectura + scan QR)
- Notificaciones automáticas de nuevos envíos
- API/webhook para sincronización si el operador implementa sistema propio

### Flujo de Comunicación:
1. **Cliente paga** → Sistema genera guía y envía email INMEDIATAMENTE
2. **Admin ve nuevo envío** → Estado: "Pendiente de Asignar"
3. **Admin coordina con operador** → "Tengo un paquete para Chihuahua, ¿lo puedes llevar?"
4. **Operador confirma** → "Sí, sale el jueves en la ruta de Chihuahua"
5. **Admin asigna ruta** → Selecciona "Laredo → Chihuahua"
6. **Cliente ve actualización** → Ahora puede ver la ruta completa en su tracking
7. **Admin exporta lista diaria** → Envía al operador envíos confirmados para recoger
8. **Operador recibe paquete** → Confirma a admin (llamada/WhatsApp)
9. **Admin actualiza estado** → "Recibido en Laredo"
10. **Operador cruza y llega a Chihuahua** → Confirma a admin
11. **Admin actualiza estado** → "En Bodega Chihuahua"
12. **Operador entrega** → Confirma a admin
13. **Admin actualiza estado** → "Entregado"

## 💳 Integración con Stripe

### Flujo de Pago y Envío:

**FASE 1 - Cliente (Inmediato):**
1. Cliente completa cotización en el sitio web (ingresa destino)
2. Sistema genera monto total (servicio + seguro opcional)
3. Cliente procede al checkout de Stripe
4. **Confirmación de pago exitoso**
5. **Generación AUTOMÁTICA e INMEDIATA de guía con QR único**
6. **Envío INMEDIATO de confirmación por email con:**
   - Número de guía para rastreo
   - Guía en PDF para imprimir con código QR
   - Dirección de bodega en Laredo
   - Instrucciones:
     * **Opción A**: Imprimir guía y pegarla al paquete antes de dejarlo en Laredo
     * **Opción B**: Si no trae guía, mencionar número de guía - personal en Laredo la imprimirá
   - Link de tracking (estado inicial: "Pago Confirmado")

**FASE 2 - Admin (Manual - Horas/días después):**
7. Admin revisa nuevas guías pagadas en panel
8. Admin coordina con operador logístico (destino, disponibilidad, etc.)
9. **Admin asigna RUTA manualmente** según destino del cliente:
   - Si destino es Monterrey → Asigna "Ruta Laredo → MTY"
   - Si destino es Chihuahua → Asigna "Ruta Laredo → Chihuahua"
   - Si destino es Coahuila → Asigna "Ruta Laredo → Coahuila"
10. Una vez asignada ruta → **Cliente ahora ve en tracking la ruta completa con todos sus estados**

**FASE 3 - Operación:**
11. Cliente deja paquete en Laredo (personal o por paquetería)
12. Personal en Laredo recibe y confirma al admin
13. Admin actualiza estado: "Recibido en Laredo"
14. Operador transporta según la ruta asignada
15. Admin actualiza estados conforme operador informa
16. Cliente recibe paquete → Admin marca como "Entregado"

### Consideraciones Stripe:
- Guardar métodos de pago para clientes recurrentes
- Manejar pagos en MXN y USD
- Implementar webhooks para confirmar pagos
- Generar facturas/recibos

## 🚚 Modelo de Entrega

**Entrega a Domicilio Únicamente**
- Todas las entregas son a domicilio del cliente
- El operador logístico maneja la última milla
- Cliente proporciona dirección completa al cotizar/pagar

*Nota: En el futuro se podría considerar puntos de entrega estratégicos para abaratar costos*

## 🚀 Funcionalidades Clave a Desarrollar

### Fase 1 - MVP:
- [x] Autenticación con Clerk
- [x] Conexión a Supabase
- [ ] Landing page informativa
- [x] Sistema de registro/login
- [ ] Cotizador básico (menudeo) con direcciones de entrega
- [ ] Integración básica con Stripe
- [ ] **Generación AUTOMÁTICA e INMEDIATA de guías con QR en PDF tras pago**
- [ ] **Email automático INMEDIATO con guía al cliente**
- [ ] **Sistema de rutas predefinidas (CRUD de rutas en admin)**
- [ ] **Sistema de asignación manual de rutas por admin**
- [ ] Notificaciones por email automáticas en cambios de estado
- [ ] Panel de cliente básico:
  - Ver sus envíos
  - Tracking con dos vistas (antes/después de asignar ruta)
  - Descargar guías
- [ ] **Panel admin con prioridad en:**
  - Dashboard de envíos pendientes de asignar
  - Asignación rápida de rutas
  - Gestión de envíos activos
  - Actualización manual de estados
  - Sistema de exportación de listas para operador

### Fase 2 - Mejoras:
- [ ] Cotizador avanzado (mayoreo, tarimas, tráilers)
- [ ] Sistema completo de tracking con timeline visual animado
- [ ] Panel admin completo:
  - Reportes y estadísticas
  - Gestión de precios y márgenes
  - Calculadora de tiempos estimados por ruta
  - Sistema de alertas automáticas
- [ ] Diseño responsive y UX mejorado
- [ ] Sistema de confirmación/alertas con operador logístico
- [ ] Sugerencias automáticas de ruta basadas en destino

### Fase 3 - Optimizaciones:
- [ ] Panel simplificado opcional para operador (scan QR, confirmar estados)
- [ ] App móvil para escaneo de QR (operadores)
- [ ] Notificaciones SMS para clientes
- [ ] Sistema de valoraciones/feedback de clientes
- [ ] API para integración con sistema del operador (si implementa uno)
- [ ] Chat de soporte en vivo
- [ ] Dashboard de comisiones y ganancias
- [ ] Asignación automática inteligente de rutas

## 📐 Consideraciones de Diseño

### UI/UX:
- **Diseño moderno y limpio**: Inspiración en DHL, FedEx, UPS
- **Mobile-first**: La mayoría de usuarios consultarán desde móvil
- **Calculadora prominente**: Fácil acceso desde homepage
- **Confianza y seguridad**: Mostrar certificaciones, testimonios
- **Proceso claro**: Wizard/stepper para guiar al usuario

### Paleta de Colores (Sugerencia):
- Azul corporativo (confianza, logística)
- Verde (México)
- Blanco/gris claro (limpieza)
- Amarillo/naranja para CTAs

### Contenido a Desarrollar:
- **Homepage**:
  - Hero section con propuesta de valor clara
  - Cómo funciona (4 pasos simples):
    1. Cotiza online y paga con tarjeta
    2. Recibe tu guía por email
    3. Deja tu paquete en Laredo (personal o por paquetería)
    4. Recíbelo en tu domicilio en México
  - Calculadora rápida
  - Beneficios principales (seguridad, tracking, rapidez)
  - Testimonios de clientes
  - FAQ
  - CTA para registro/cotización

- **Sobre Nosotros**:
  - Quiénes somos (intermediarios especializados)
  - Misión: facilitar importaciones accesibles
  - Valores: transparencia, confianza, tecnología
  - Alianza con operador logístico confiable

- **Servicios**:
  - Detalle de servicios de menudeo
  - Detalle de servicios de mayoreo
  - Seguro de mercancías
  - Proceso de recepción en Laredo
  - Entrega a domicilio

- **Preguntas Frecuentes**:
  - ¿Cómo envío mis productos a Laredo?
  - ¿Cuánto tarda el proceso completo?
  - ¿Qué productos puedo importar?
  - ¿Qué restricciones hay?
  - ¿Cómo funciona el seguro?
  - ¿Puedo rastrear mi paquete en tiempo real?
  - ¿Qué pasa si no llevo la guía impresa?
  - ¿Entregan en toda la República Mexicana?

- **Contacto**:
  - Formulario de contacto
  - WhatsApp Business
  - Email
  - Teléfono
  - Dirección de bodega aliada en Laredo (para referencia)

## 🔐 Seguridad y Cumplimiento

- Cumplir con regulaciones aduanales México-USA
- RGPD/Privacidad de datos de clientes
- PCI compliance (Stripe maneja esto)
- Términos y condiciones claros
- Política de privacidad
- Seguro de mercancías con respaldo legal

## 📊 Métricas y KPIs

Dashboard admin debe mostrar:
- Total de envíos activos
- Total de envíos completados
- Ingresos del mes/año
- Tiempo promedio de entrega
- Tasa de satisfacción (futuro)
- Envíos por estado actual
- Clientes activos vs nuevos

## 🗂 Estructura del Proyecto (Sugerida)

```
my-pack-mx/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── calculator/
│   │   │   ├── tracking/
│   │   │   ├── admin/
│   │   │   └── common/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Calculator.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tracking.jsx
│   │   │   ├── Admin.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── stripe.js
│   │   │   └── supabase.js
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── server.js
│   └── package.json
├── database/
│   └── supabase/
│       ├── migrations/
│       └── seeds/
└── README.md
```

## 🎯 Objetivos de Negocio

1. **Ofrecer servicio accesible**: Hacer importaciones USA-México simples para el cliente final
2. **Monetizar tráfico digital**: Captar clientes online y generar comisión por cada envío
3. **Escalabilidad sin infraestructura propia**: Crecer sin invertir en bodegas ni flotilla
4. **Diferenciación por tecnología**: Ofrecer tracking y experiencia digital superior
5. **Colaboración win-win**: Ayudar al operador logístico a captar más clientes mientras generamos ingresos
6. **Transparencia y confianza**: Sistema de tracking genera credibilidad y reduce llamadas de seguimiento

## 📝 Notas Importantes

- **Guía inmediata es crítica**: Cliente debe recibir su guía por email INMEDIATAMENTE después del pago para generar confianza
- **Coordinación es clave**: La comunicación efectiva con el operador logístico es fundamental para asignar rutas correctamente
- **Sistema de rutas flexible**: Cada ruta tiene sus propios estados personalizados - totalmente editable desde admin
- **Asignación manual al inicio**: Da control total y permite ajustar según disponibilidad del operador (automatizar después)
- El QR sirve principalmente para **identificación y tracking del cliente**, no es crítico para actualización de estados
- La cotización debe incluir **margen de ganancia** sobre costos del operador
- El panel admin debe priorizar la **vista de envíos pendientes de asignar** - es la acción más urgente
- Considerar **tiempos realistas** en estimaciones (aduanas, rutas, disponibilidad del operador)
- Documentar **lista de productos prohibidos** claramente
- Tener **proceso de contingencia** si hay problemas de comunicación con operador
- Sistema debe permitir **exportar información** fácilmente para compartir con operador
- Priorizar **experiencia del cliente** - tracking claro y comunicación constante son diferenciales clave
- **Tracking en dos etapas** evita que cliente vea estados vacíos y genera expectativa positiva

## 🚦 Próximos Pasos

### Inmediatos:
1. **Definir estructura de precios** con margen sobre costos del operador
2. **Acordar protocolo de comunicación** con operador logístico (WhatsApp, Excel, etc.)
3. **Diseñar wireframes** de cotizador y panel admin
4. **Definir estructura de base de datos** en Supabase

### Corto Plazo:
5. **Configurar proyecto React** con componentes base
6. **Implementar calculadora de cotización** con lógica de precios
7. **Integrar Stripe** para pagos de prueba
8. **Desarrollar generación de guías en PDF** con QR
9. **Email automático** post-pago con guía

### Mediano Plazo:
10. **Crear panel admin MVP** para gestión de envíos
11. **Sistema de exportación** para compartir info con operador
12. **Testing con primeros clientes beta**
13. **Refinar flujo de comunicación** con operador
14. **Ajustar estados y notificaciones** según feedback operativo

---

## 🤝 Contacto del Proyecto

**MY PACK MX**
- Bodega Laredo: [Dirección pendiente]
- Email: [Pendiente]
- Teléfono: [Pendiente]

---

*Este README sirve como documento de contexto completo para el desarrollo del proyecto. Actualizar según evolucione el proyecto.*
