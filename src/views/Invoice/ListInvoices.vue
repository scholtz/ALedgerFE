<script setup lang="ts">
import Layout from '@/layouts/AuthLayout.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'

import type { IItem } from '@/scripts/types/IItem'
import type { IPaymentMethod } from '@/scripts/types/IPaymentMethod'
import type { ISummary } from '@/scripts/types/ISummary'
import type { IInvoice } from '@/scripts/types/IInvoice'
import { useToast } from 'primevue/usetoast'

import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, watch, reactive } from 'vue'
//import { InvoiceService } from '@/service/InvoiceService'
import { useAppStore } from '@/stores/app'
import {
  bffCreateInvoice,
  bffUpdateInvoice,
  bffGetContacts,
  bffGetInvoices
} from '@/scripts/axios/BFF'
import delay from '@/scripts/common/delay'

const store = useAppStore()
const toast = useToast()
const state = reactive({
  formShown: false,
  processing: false,
  selection: {
    id: '',
    data: {
      isDraft: true,
      invoiceNumber: '',
      invoiceNumberNum: 0,
      invoiceType: '',
      paymentMethods: [] as IPaymentMethod[],
      summary: [] as ISummary[],
      items: [] as IItem[],
      personIdIssuer: '',
      personIdReceiver: '',
      dateIssue: new Date(),
      dateDue: new Date(),
      dateDelivery: new Date(),
      noteBeforeItems: '',
      noteAfterItems: '',
      currency: 'EUR'
    } as IInvoice
  },
  filters: {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  },
  contacts: [] as any[],
  issuer: {} as any,
  receiver: {} as any,
  currencies: [
    { name: 'EUR', value: 'EUR' },
    { name: 'USD', value: 'USD' },
    { name: 'Algorand', value: 'ALGO' }
  ]
})

async function loadInvoices() {
  if (!store.state.authState?.arc14Header) {
    console.log('NotAuthorization')
    return
  }
  invoices.value = await bffGetInvoices(store.state.authState.arc14Header)
}

async function loadContacts() {
  if (!store.state.authState?.arc14Header) {
    console.log('NotAuthorization')
    return
  }
  state.contacts = await bffGetContacts(store.state.authState.arc14Header)
}

watch(store.state.authState, async () => {
  await loadInvoices()
})

onMounted(async () => {
  //InvoiceService.getInvoicesMini().then((data) => (products.value = data))
  if (store.state.authState.arc14Header) {
    await loadInvoices()
    await loadContacts()
  }
})
watch(
  () => store.state.authState.arc14Header,
  async () => {
    if (store.state.authState.arc14Header) {
      await loadInvoices()
      await loadContacts()
    }
  }
)

const showForm = () => {
  state.formShown = true

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  state.selection.data.dateIssue = today
  state.selection.data.dateDelivery = today
  const datePlus14 = new Date()
  datePlus14.setDate(new Date().getDate() + 14)

  state.selection.data.dateDue = datePlus14
  addNewItem()
  addNewSummaryItem()
  addNewPaymentMethodItem()
}

const cancel = () => {
  state.formShown = false
  state.selection = {
    id: '',
    data: {
      isDraft: true,
      invoiceNumber: '',
      invoiceNumberNum: 0,
      invoiceType: '',
      paymentMethods: [] as IPaymentMethod[],
      summary: [] as ISummary[],
      items: [] as IItem[],
      personIdIssuer: '',
      personIdReceiver: '',
      dateIssue: new Date(),
      dateDue: new Date(),
      dateDelivery: new Date(),
      noteBeforeItems: '',
      noteAfterItems: '',
      currency: 'EUR'
    } as IInvoice
  }
}

watch(
  () => state.selection.data.personIdIssuer,
  () => {
    state.issuer = state.contacts.find((c) => c.id == state.selection.data.personIdIssuer)
  }
)
watch(
  () => state.selection.data.personIdReceiver,
  () => {
    state.receiver = state.contacts.find((c) => c.id == state.selection.data.personIdReceiver)
  }
)

const addNewItem = () => {
  state.selection.data.items.push({
    itemText: '',
    unitPrice: 0,
    unit: '',
    discount: 0,
    quantity: 0,
    taxPercent: 0,
    netAmount: 0,
    grossAmount: 0
  })
}
const addNewSummaryItem = () => {
  state.selection.data.summary.push({
    currency: 'ALGO',
    rate: 1,
    rateCurrencies: 'Algo/USD',
    rateNote: 'closing price at coinbase',
    netAmount: 0,
    taxAmount: 0,
    grossAmount: 0
  })
}
const addNewPaymentMethodItem = () => {
  state.selection.data.paymentMethods.push({
    currency: 'ALGO',
    currencyId: 'ALGO',
    account: 'Write your algorand account',
    network: 'Algorand',
    grossAmount: 0
  })
}

const cloneInvoice = async () => {
  state.selection.id = ''
  await saveInvoice()
}

const saveInvoice = async () => {
  state.processing = true
  try {
    console.log('createItem', state.selection.data)
    if (state.selection.id) {
      await bffUpdateInvoice(
        store.state.authState.arc14Header,
        state.selection.id,
        state.selection.data
      )
    } else {
      await bffCreateInvoice(store.state.authState.arc14Header, state.selection.data)
    }
    await delay(1000)
    await loadInvoices()
    state.formShown = false
    state.processing = false
  } catch (e: any) {
    state.processing = false
    toast.add({
      severity: 'error',
      detail: 'Error occured: ' + (e.message ?? e),
      life: 5000
    })
  }
}

watch(
  () => state.selection.data.invoiceNumberNum,
  () => {
    state.selection.data.invoiceNumber = `${new Date().getFullYear() - 2000}${('00000000' + state.selection.data.invoiceNumberNum).slice(-8)}`
  }
)

watch(
  () => state.selection.id,
  () => {
    if (state.selection.id) {
      state.formShown = true
    }
  }
)
const invoices = ref()
</script>
<template>
  <Layout :hideTopMenu="false">
    <Message severity="warn">
      The invoicing product is under review and may change. Please use it for testing purposes at
      the moment.
    </Message>
    <Card>
      <template #content>
        <div v-if="state.formShown" class="grid">
          <div class="col-6">
            <h1>Create new invoice</h1>
          </div>
          <div class="col-6 text-right">
            <Button @click="cancel" :disabled="state.processing">Cancel</Button>
          </div>

          <div class="col-8 grid">
            <div class="col-12">
              <Card class="m-2 w-full">
                <template #header>
                  <label class="mr-1 inline-block mt-3 mx-4"> Invoice identfication: </label>
                </template>
                <template #content>
                  <label for="invoiceNumberNum" class="mr-1 w-10rem inline-block">Invoice #</label>
                  <InputNumber
                    input-id="invoiceNumberNum"
                    v-model="state.selection.data.invoiceNumberNum"
                  ></InputNumber>
                  <label for="invoiceNumberNum" class="mx-1 w-10rem inline-block">Invoice ID</label>
                  <InputText
                    input-id="invoiceNumber"
                    v-model="state.selection.data.invoiceNumber"
                  ></InputText>
                </template>
              </Card>
            </div>

            <div class="col-6">
              <Card class="m-2 w-full">
                <template #header>
                  <label for="personIdIssuer" class="mr-1 w-10rem inline-block mt-3 mx-4">
                    Invoice issuer:
                  </label>
                </template>
                <template #content>
                  <div>
                    <Dropdown
                      input-id="personIdIssuer"
                      v-model="state.selection.data.personIdIssuer"
                      :options="state.contacts"
                      optionLabel="data.businessName"
                      optionValue="id"
                      class="w-full"
                    ></Dropdown>
                  </div>
                  <div v-if="state.issuer && state.issuer.data">
                    <div class="col-12" v-if="state.issuer.data.businessName">
                      <label class="mr-1 w-10rem inline-block">businessName:</label>
                      <span>{{ state.issuer.data.businessName }}</span>
                    </div>
                    <div class="col-12" v-if="state.issuer.data.companyId">
                      <label class="mr-1 w-10rem inline-block">companyId:</label>
                      <span>{{ state.issuer.data.companyId }}</span>
                    </div>
                    <div class="col-12" v-if="state.issuer.data.companyTaxId">
                      <label class="mr-1 w-10rem inline-block">companyTaxId:</label>
                      <span>{{ state.issuer.data.companyTaxId }}</span>
                    </div>
                    <div class="col-12" v-if="state.issuer.data.companyVATId">
                      <label class="mr-1 w-10rem inline-block">companyVATId:</label>
                      <span>{{ state.issuer.data.companyVATId }}</span>
                    </div>
                    <div class="col-12" v-if="state.issuer.data.firstName">
                      <label class="mr-1 w-10rem inline-block">firstName:</label>
                      <span>{{ state.issuer.data.firstName }}</span>
                    </div>
                    <div class="col-12" v-if="state.issuer.data.lastName">
                      <label class="mr-1 w-10rem inline-block">lastName:</label>
                      <span>{{ state.issuer.data.lastName }}</span>
                    </div>
                    <div class="col-12" v-if="state.issuer.data.email">
                      <label class="mr-1 w-10rem inline-block">email:</label>
                      <span>{{ state.issuer.data.email }}</span>
                    </div>
                    <div class="col-12" v-if="state.issuer.data.phone">
                      <label class="mr-1 w-10rem inline-block">phone:</label>
                      <span>{{ state.issuer.data.phone }}</span>
                    </div>
                    <div
                      class="col-12"
                      v-if="state.issuer.data.address && state.issuer.data.address.street"
                    >
                      <label class="mr-1 w-10rem inline-block">address:</label>
                      <span
                        >{{ state.issuer.data.address.street }}
                        {{ state.issuer.data.address.streetLine2 }}
                        {{ state.issuer.data.address.zipCode }}
                        {{ state.issuer.data.address.city }}
                        {{ state.issuer.data.address.countryCode }}</span
                      >
                    </div>
                  </div>
                </template>
              </Card>
            </div>
            <div class="col-6">
              <Card class="m-2 w-full">
                <template #header>
                  <label for="personIdReceiver" class="mr-1 w-10rem inline-block mt-3 mx-4">
                    Invoice receiver:
                  </label>
                </template>
                <template #content>
                  <div>
                    <Dropdown
                      input-id="personIdReceiver"
                      v-model="state.selection.data.personIdReceiver"
                      :options="state.contacts"
                      optionLabel="data.businessName"
                      optionValue="id"
                      class="w-full"
                    ></Dropdown>
                  </div>
                  <div v-if="state.receiver && state.receiver.data">
                    <div class="col-12" v-if="state.receiver.data.businessName">
                      <label class="mr-1 w-10rem inline-block">businessName:</label>
                      <span>{{ state.receiver.data.businessName }}</span>
                    </div>
                    <div class="col-12" v-if="state.receiver.data.companyId">
                      <label class="mr-1 w-10rem inline-block">companyId:</label>
                      <span>{{ state.receiver.data.companyId }}</span>
                    </div>
                    <div class="col-12" v-if="state.receiver.data.companyTaxId">
                      <label class="mr-1 w-10rem inline-block">companyTaxId:</label>
                      <span>{{ state.receiver.data.companyTaxId }}</span>
                    </div>
                    <div class="col-12" v-if="state.receiver.data.companyVATId">
                      <label class="mr-1 w-10rem inline-block">companyVATId:</label>
                      <span>{{ state.receiver.data.companyVATId }}</span>
                    </div>
                    <div class="col-12" v-if="state.receiver.data.firstName">
                      <label class="mr-1 w-10rem inline-block">firstName:</label>
                      <span>{{ state.receiver.data.firstName }}</span>
                    </div>
                    <div class="col-12" v-if="state.receiver.data.lastName">
                      <label class="mr-1 w-10rem inline-block">lastName:</label>
                      <span>{{ state.receiver.data.lastName }}</span>
                    </div>
                    <div class="col-12" v-if="state.receiver.data.email">
                      <label class="mr-1 w-10rem inline-block">email:</label>
                      <span>{{ state.receiver.data.email }}</span>
                    </div>
                    <div class="col-12" v-if="state.receiver.data.phone">
                      <label class="mr-1 w-10rem inline-block">phone:</label>
                      <span>{{ state.receiver.data.phone }}</span>
                    </div>
                    <div
                      class="col-12"
                      v-if="state.receiver.data.address && state.receiver.data.address.street"
                    >
                      <label class="mr-1 w-10rem inline-block">address:</label>
                      <span
                        >{{ state.receiver.data.address.street }}
                        {{ state.receiver.data.address.streetLine2 }}
                        {{ state.receiver.data.address.zipCode }}
                        {{ state.receiver.data.address.city }}
                        {{ state.receiver.data.address.countryCode }}</span
                      >
                    </div>
                  </div>
                </template>
              </Card>
            </div>
          </div>
          <div class="col-4">
            <Card class="m-2 w-full">
              <template #header>
                <label class="mr-1 inline-block mt-3 mx-4"> Invoice primary currency: </label>
              </template>
              <template #content
                ><div class="col-12">
                  <label for="dateIssue" class="mr-1 w-10rem inline-block">Items currency</label>
                  <Dropdown
                    :options="state.currencies"
                    option-label="name"
                    option-value="value"
                    v-model="state.selection.data.currency"
                  />
                </div>
              </template>
            </Card>
            <Card class="m-2 w-full">
              <template #header>
                <label class="mr-1 inline-block mt-3 mx-4"> Dates: </label>
              </template>
              <template #content>
                <div class="col-12">
                  <label for="dateIssue" class="mr-1 w-10rem inline-block">Issued on</label>
                  <Calendar
                    inputId="dateIssue"
                    dateFormat="dd/mm/yy"
                    v-model="state.selection.data.dateIssue"
                    showIcon
                    showButtonBar
                    :showOnFocus="false"
                  />
                </div>
                <div class="col-12">
                  <label for="dateDue" class="mr-1 w-10rem inline-block">Due date</label>
                  <Calendar
                    inputId="dateDue"
                    dateFormat="dd/mm/yy"
                    v-model="state.selection.data.dateDue"
                    showIcon
                    showButtonBar
                    :showOnFocus="false"
                  />
                </div>
                <div class="col-12">
                  <label for="dateDelivery" class="mr-1 w-10rem inline-block">Delivery date</label>
                  <Calendar
                    inputId="dateDelivery"
                    dateFormat="dd/mm/yy"
                    v-model="state.selection.data.dateDelivery"
                    showIcon
                    showButtonBar
                    :showOnFocus="false"
                  />
                </div>
              </template>
            </Card>
          </div>
          <div class="col-12">
            <Card class="m-2">
              <template #header>
                <label class="mr-1 inline-block mt-3 mx-4"> Note before item: </label>
              </template>
              <template #content>
                <Textarea v-model="state.selection.data.noteBeforeItems" class="w-full" :rows="3" />
              </template>
            </Card>
          </div>

          <div class="col-12">
            <Card class="m-2">
              <template #header>
                <label class="mr-1 inline-block mt-3 mx-4"> Invoice items: </label>
              </template>
              <template #content>
                <table class="w-full">
                  <thead>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Unit price</th>
                    <th>Unit</th>
                    <th>Discount</th>
                    <th>Tax Percent</th>
                    <th>Net Amount</th>
                    <th>Gross Amount</th>
                  </thead>
                  <tr v-for="(row, id) in state.selection.data.items" :key="id">
                    <td>
                      <InputText v-model="row.itemText" class="w-full" />
                    </td>
                    <td>
                      <InputNumber
                        v-model="row.quantity"
                        class="w-full"
                        :max-fraction-digits="2"
                        :step="0.01"
                        :min="0"
                      />
                    </td>
                    <td>
                      <InputNumber
                        v-model="row.unitPrice"
                        class="w-full"
                        :max-fraction-digits="2"
                        :step="0.01"
                        :min="0"
                      />
                    </td>
                    <td>
                      <InputText v-model="row.unit" class="w-full" />
                    </td>
                    <td>
                      <InputNumber
                        v-model="row.discount"
                        class="w-full"
                        :max-fraction-digits="2"
                        :step="0.01"
                        :min="0"
                      />
                    </td>
                    <td>
                      <InputNumber
                        v-model="row.taxPercent"
                        class="w-full"
                        :max-fraction-digits="2"
                        :step="0.01"
                        :min="0"
                      />
                    </td>
                    <td>
                      <InputNumber
                        v-model="row.netAmount"
                        class="w-full"
                        :max-fraction-digits="2"
                        :step="0.01"
                        :min="0"
                      />
                    </td>
                    <td>
                      <InputNumber
                        v-model="row.grossAmount"
                        class="w-full"
                        :max-fraction-digits="2"
                        :step="0.01"
                        :min="0"
                      />
                    </td>
                  </tr>
                </table>
                <Button class="m-1" @click="addNewItem">Add new item</Button>
              </template>
            </Card>
          </div>

          <div class="col-12">
            <Card class="m-2">
              <template #header>
                <label class="mr-1 inline-block mt-3 mx-4"> Note after item: </label>
              </template>
              <template #content>
                <Textarea v-model="state.selection.data.noteAfterItems" class="w-full" :rows="3" />
              </template>
            </Card>
          </div>

          <div class="col-12">
            <Card class="m-2">
              <template #header>
                <label class="mr-1 inline-block mt-3 mx-4"> Summary: </label>
              </template>
              <template #content>
                <table class="w-full">
                  <thead>
                    <th>Currency</th>
                    <th>Rate</th>
                    <th>Rate Currencies</th>
                    <th>Rate Note</th>
                    <th>Net Amount</th>
                    <th>Tax Amount</th>
                    <th>Gross Amount</th>
                  </thead>
                  <tr v-for="(row, id) in state.selection.data.summary" :key="id">
                    <td>
                      <Dropdown
                        :options="state.currencies"
                        option-label="name"
                        option-value="value"
                        v-model="row.currency"
                      />
                    </td>
                    <td>
                      <InputNumber
                        v-model="row.rate"
                        class="w-full"
                        :max-fraction-digits="6"
                        :step="0.000001"
                        :min="0"
                      />
                    </td>
                    <td>
                      <InputText v-model="row.rateCurrencies" class="w-full" />
                    </td>
                    <td>
                      <InputText v-model="row.rateNote" class="w-full" />
                    </td>
                    <td>
                      <InputNumber
                        v-model="row.netAmount"
                        class="w-full"
                        :max-fraction-digits="2"
                        :step="0.01"
                        :min="0"
                      />
                    </td>
                    <td>
                      <InputNumber
                        v-model="row.taxAmount"
                        class="w-full"
                        :max-fraction-digits="2"
                        :step="0.01"
                        :min="0"
                      />
                    </td>
                    <td>
                      <InputNumber
                        v-model="row.grossAmount"
                        class="w-full"
                        :max-fraction-digits="2"
                        :step="0.01"
                        :min="0"
                      />
                    </td>
                  </tr>
                </table>
                <Button class="m-1" @click="addNewSummaryItem">Add new item</Button>
              </template>
            </Card>
          </div>

          <div class="col-12">
            <Card class="m-2">
              <template #header>
                <label class="mr-1 inline-block mt-3 mx-4"> Payment method: </label>
              </template>
              <template #content>
                <table class="w-full">
                  <thead>
                    <th>Currency</th>
                    <th>ID</th>
                    <th>Account</th>
                    <th>Network</th>
                    <th>Gross Amount</th>
                  </thead>
                  <tr v-for="(row, id) in state.selection.data.paymentMethods" :key="id">
                    <td>
                      <Dropdown
                        :options="state.currencies"
                        option-label="name"
                        option-value="value"
                        v-model="row.currency"
                      />
                    </td>
                    <td>
                      <InputText v-model="row.currencyId" class="w-full" />
                    </td>
                    <td>
                      <InputText v-model="row.account" class="w-full" />
                    </td>
                    <td>
                      <InputText v-model="row.network" class="w-full" />
                    </td>
                    <td>
                      <InputNumber
                        v-model="row.grossAmount"
                        class="w-full"
                        :max-fraction-digits="2"
                        :step="0.01"
                        :min="0"
                      />
                    </td>
                  </tr>
                </table>
                <Button class="m-1" @click="addNewPaymentMethodItem">Add new item</Button>
              </template>
            </Card>
          </div>

          <div class="col-12">
            <Card class="m-2">
              <template #header>
                <label class="mr-1 inline-block mt-3 mx-4">
                  Finalize invoice {{ state.selection.id }}:
                </label>
              </template>
              <template #content>
                <div class="grid">
                  <div class="col">
                    <Checkbox
                      v-model="state.selection.data.isDraft"
                      input-id="isDraft"
                      :binary="true"
                      class="m-2"
                    />
                    <label for="isDraft" class="m-2 inline-block">Is draft</label>
                  </div>
                  <div class="col text-right" v-if="!state.selection.id">
                    <Button :disabled="state.processing" class="m-1" @click="saveInvoice"
                      >Create invoice</Button
                    >
                  </div>
                  <div class="col text-right" v-if="state.selection.id">
                    <Button :disabled="state.processing" class="m-1" @click="saveInvoice">
                      Update invoice
                    </Button>
                  </div>
                  <div class="col text-right" v-if="state.selection.id">
                    <Button
                      :disabled="state.processing"
                      class="m-1"
                      @click="cloneInvoice"
                      severity="secondary"
                    >
                      Clone invoice
                    </Button>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
        <div v-else>
          <h1>List invoices</h1>
          <DataTable
            v-model:selection="state.selection"
            v-model:filters="state.filters"
            filterDisplay="menu"
            :globalFilterFields="['id', 'data.invoiceNumber']"
            responsive-layout="scroll"
            selection-mode="single"
            :value="invoices"
            :paginator="true"
            :rows="20"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            tableStyle="min-width: 50rem"
          >
            <template #header>
              <div class="grid" v-if="state.filters['global']">
                <div class="col">
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText
                      v-model="state.filters['global'].value"
                      placeholder="Keyword Search"
                    />
                  </span>
                </div>
                <div class="col text-right">
                  <Button @click="showForm">Create new invoice</Button>
                </div>
              </div>
            </template>
            <template #empty> No invoice </template>
            <Column field="created" header="Created">
              <template #body="slotProps">
                {{ new Date(slotProps.data.created).toLocaleDateString() }}</template
              >
            </Column>
            <Column field="updated" header="Last update">
              <template #body="slotProps">
                {{ new Date(slotProps.data.updated).toLocaleDateString() }}</template
              >
            </Column>
            <Column field="data.invoiceNumber" header="Number"></Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </Layout>
</template>
