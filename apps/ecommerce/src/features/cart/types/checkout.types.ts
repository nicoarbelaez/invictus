export type PaymentMethod = 'bank-transfer' | 'cod' | 'card'
export type CardProvider = 'mercadopago' | 'wompi' | 'epayco'

export interface FormState {
  email: string
  fullName: string
  phone: string
  address: string
  city: string
  department: string
}

export interface FieldConfig {
  key: keyof FormState
  label: string
  type?: string
  placeholder: string
  required?: boolean
}

export interface FormSectionDef {
  title: string
  rows: FieldConfig[][]
}
