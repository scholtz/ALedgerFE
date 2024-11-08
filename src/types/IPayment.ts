export default interface IPayment {
  reference: string
  network: string
  currency: string
  currencyId: string
  account: string
  baseAmount: number
  grossAmount: number
}
