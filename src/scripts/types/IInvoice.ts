import type { IItem } from './IItem'
import type { IPaymentMethod } from './IPaymentMethod'
import type { ISummary } from './ISummary'

export interface IInvoice {
  isDraft: boolean
  invoiceNumber: string
  invoiceNumberNum: number
  invoiceType: string
  paymentMethods: IPaymentMethod[]
  summary: ISummary[]
  items: IItem[]
  personIdIssuer: string
  personIdReceiver: string
  dateIssue: Date
  dateDue: Date
  dateDelivery: Date
  noteBeforeItems: string
  noteAfterItems: string
  currency: string
}
