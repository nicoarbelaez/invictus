import type { CardProvider, FormState, FormSectionDef, PaymentMethod } from '@/features/cart/types/checkout.types'

export const PAYMENT_METHODS: { value: PaymentMethod; label: string; description: string }[] = [
  {
    value: 'bank-transfer',
    label: 'Depósito bancario',
    description: 'Datos bancarios enviados por WhatsApp tras confirmar el pedido.',
  },
  {
    value: 'cod',
    label: 'Pago contra entrega',
    description: 'Paga en efectivo al recibir tu pedido.',
  },
  {
    value: 'card',
    label: 'Tarjeta de crédito/débito',
    description: 'Pago seguro con pasarela de pago.',
  },
]

export const CARD_PROVIDERS: { value: CardProvider; label: string }[] = [
  { value: 'mercadopago', label: 'Mercado Pago' },
  { value: 'wompi', label: 'Wompi' },
  { value: 'epayco', label: 'ePayco' },
]

export const INITIAL_FORM: FormState = {
  email: '',
  fullName: '',
  phone: '',
  address: '',
  city: '',
  department: '',
}

/**
 * Secciones del formulario guiadas por configuración.
 * - Agregar campo: añade un objeto a `rows` de la sección correspondiente.
 * - Agregar sección: añade un objeto `{ title, rows }` al array.
 * - Filas con 2 campos se renderizan en grid 2 columnas automáticamente.
 */
export const FORM_SECTIONS: FormSectionDef[] = [
  {
    title: 'Información de contacto',
    rows: [
      [{ key: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'correo@ejemplo.com', required: true }],
      [{ key: 'fullName', label: 'Nombre completo', placeholder: 'Tu nombre completo', required: true }],
      [{ key: 'phone', label: 'Teléfono / WhatsApp', type: 'tel', placeholder: '+57 300 000 0000', required: true }],
    ],
  },
  {
    title: 'Dirección de entrega',
    rows: [
      [{ key: 'address', label: 'Dirección', placeholder: 'Calle, número, apartamento', required: true }],
      [
        { key: 'city', label: 'Ciudad', placeholder: 'Ciudad', required: true },
        { key: 'department', label: 'Departamento', placeholder: 'Departamento', required: true },
      ],
    ],
  },
]
