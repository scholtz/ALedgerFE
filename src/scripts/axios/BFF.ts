import axios from 'axios'
import { useAppStore } from '@/stores/app'
import type IProfile from '@/types/IProfile'

const bffAccount = async (arc14header: string) => {
  const store = useAppStore()
  const ret = await axios.get(`${store.state.bff}/api/v1/account`, {
    headers: {
      Authorization: arc14header
    }
  })
  return ret.data
}
interface IContact {
  businessName: string
  companyId: string
  companyTaxId: string
  companyVATId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  addressId: string
  signatureUrl: string
}
const bffCreateContact = async (arc14header: string, data: IContact) => {
  const store = useAppStore()
  const ret = await axios.post(`${store.state.bff}/v1/person`, data, {
    headers: {
      Authorization: arc14header
    }
  })
  return ret.data
}
const bffUpdateContact = async (arc14header: string, id: string, data: IContact) => {
  const store = useAppStore()
  const ret = await axios.put(`${store.state.bff}/v1/person/${id}`, data, {
    headers: {
      Authorization: arc14header
    }
  })
  return ret.data
}
const bffDeleteContact = async (arc14header: string, id: string) => {
  const store = useAppStore()
  const ret = await axios.delete(`${store.state.bff}/v1/person/${id}`, {
    headers: {
      Authorization: arc14header
    }
  })
  return ret.data
}

const bffSendVerificationEmail = async (
  arc14header: string,
  email: string,
  terms: string,
  gdpr: string,
  hasMarketing: boolean
) => {
  const store = useAppStore()
  const form = new FormData()
  form.append('email', email)
  form.append('terms', terms)
  form.append('gdpr', gdpr)
  form.append('marketingConsent', String(hasMarketing))
  const ret = await axios.postForm(`${store.state.bff}/api/v1/send-verification-email`, form, {
    headers: {
      Authorization: arc14header
    }
  })
  return ret.data
}
const bffSendVerifyEmailCode = async (arc14header: string, code: string) => {
  const store = useAppStore()
  const form = new FormData()
  form.append('code', code)
  const ret = await axios.postForm(`${store.state.bff}/api/v1/verify-code-from-email`, form, {
    headers: {
      Authorization: arc14header
    }
  })
  return ret.data
}

const bffGetProfile = async (arc14header: string) => {
  const store = useAppStore()
  const ret = await axios.get(`${store.state.bff}/api/v1/profile`, {
    headers: {
      Authorization: arc14header
    }
  })
  return ret.data
}
const bffUpdateProfile = async (profile: IProfile, arc14header: string) => {
  const store = useAppStore()
  const ret = await axios.post(`${store.state.bff}/api/v1/update-profile`, profile, {
    headers: {
      Authorization: arc14header,
      contentType: 'application/json'
    }
  })
  return ret.data
}

const bffRFQ = async (amount: number, currency: string, arc14header: string) => {
  const store = useAppStore()
  const ret = await axios.get(
    `${store.state.bff}/api/v1/rfq?currency=${currency}&amount=${amount}`,
    {
      headers: {
        Authorization: arc14header,
        contentType: 'application/json'
      }
    }
  )
  return ret.data
}
const bffConfirmRFQ = async (id: string, arc14header: string) => {
  const store = useAppStore()
  const ret = await axios.put(`${store.state.bff}/api/v1/rfq/${id}`, {
    headers: {
      Authorization: arc14header,
      contentType: 'application/json'
    }
  })
  return ret.data
}

const bffGetInvoices = async (arc14header: string, offset: number, limit: number) => {
  const store = useAppStore()
  const ret = await axios.get(`${store.state.bff}/v1/invoice?offset=${offset}&limit=${limit}`, {
    headers: {
      Authorization: arc14header,
      contentType: 'application/json'
    }
  })
  return ret.data
}
const bffGetContacts = async (arc14header: string) => {
  const store = useAppStore()
  const ret = await axios.get(`${store.state.bff}/v1/person`, {
    headers: {
      Authorization: arc14header,
      contentType: 'application/json'
    }
  })
  return ret.data
}

export {
  bffAccount,
  bffRFQ,
  bffConfirmRFQ,
  bffSendVerificationEmail,
  bffCreateContact,
  bffUpdateContact,
  bffDeleteContact,
  bffGetContacts,
  bffSendVerifyEmailCode,
  bffGetProfile,
  bffUpdateProfile,
  bffGetInvoices
}
