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

import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, watch, reactive } from 'vue'
//import { InvoiceService } from '@/service/InvoiceService'
import { useAppStore } from '@/stores/app'
const store = useAppStore()
import { bffGetContacts, bffGetInvoices } from '@/scripts/axios/BFF'

interface IPaymentMethod {
  currency: string
  currencyId: string
  account: string
  network: string
  grossAmount: number
}

interface ISummary {
  currency: string
  rate: number
  rateCurrencies: string
  rateNote: string
  netAmount: number
  taxAmount: number
  grossAmount: number
}

interface IItem {
  itemText: string
  unitPrice: number
  unit: string
  discount: number
  quantity: number
  taxPercent: number
  netAmount: number
  grossAmount: number
}

const state = reactive({
  formShown: false,
  processing: false,
  selection: {
    id: '',
    data: {
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
      currency: ''
    }
  },
  filters: {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  },
  contacts: [] as any[],
  issuer: {} as any,
  receiver: {} as any
})

async function loadInvoices(offset: number, limit: number) {
  if (!store.state.authState?.arc14Header) {
    console.log('NotAuthorization')
    return
  }
  invoices.value = await bffGetInvoices(store.state.authState.arc14Header, offset, limit)
}

async function loadContacts() {
  if (!store.state.authState?.arc14Header) {
    console.log('NotAuthorization')
    return
  }
  state.contacts = await bffGetContacts(store.state.authState.arc14Header)
}

watch(store.state.authState, async () => {
  await loadInvoices(0, 10)
})

onMounted(async () => {
  //InvoiceService.getInvoicesMini().then((data) => (products.value = data))
  await loadInvoices(0, 10)
  await loadContacts()
})

const showForm = () => {
  state.formShown = true

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  state.selection.data.dateIssue = today
  state.selection.data.dateDelivery = today
  const datePlus14 = new Date()
  datePlus14.setDate(new Date().getDate() + 14)

  state.selection.data.dateDue = datePlus14
}

const cancel = () => {
  state.formShown = false
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

const invoices = ref()
</script>
<template>
  <Layout :hideTopMenu="false">
    <Card>
      <template #content>
        {{ state.selection.data }}
        <div v-if="state.formShown" class="grid">
          <div class="col-6">
            <h1>Create new invoice</h1>
          </div>
          <div class="col-6 text-right">
            <Button @click="cancel" :disabled="state.processing">Cancel</Button>
          </div>

          <div class="col-6 grid">
            <div class="col-12">
              <label for="invoiceNumberNum" class="mr-1 w-10rem inline-block">Invoice #</label>
              <InputNumber
                input-id="invoiceNumberNum"
                v-model="state.selection.data.invoiceNumberNum"
              ></InputNumber>
            </div>

            <div class="col-6 grid">
              <div class="col-12">
                <label for="personIdIssuer" class="mr-1 w-10rem inline-block">From:</label>
                <Dropdown
                  input-id="personIdIssuer"
                  v-model="state.selection.data.personIdIssuer"
                  :options="state.contacts"
                  optionLabel="data.businessName"
                  optionValue="id"
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
                    {{ state.issuer.data.address.zipCode }} {{ state.issuer.data.address.city }}
                    {{ state.issuer.data.address.countryCode }}</span
                  >
                </div>
              </div>
            </div>
            <div class="col-6 grid">
              <div class="col-12">
                <label for="personIdReceiver" class="mr-1 w-10rem inline-block">To:</label>
                <Dropdown
                  input-id="personIdReceiver"
                  v-model="state.selection.data.personIdReceiver"
                  :options="state.contacts"
                  optionLabel="data.businessName"
                  optionValue="id"
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
            </div>
          </div>
          <div class="col-6 grid">
            <div class="col-12 text-right">
              <label for="dateIssue" class="mr-1">Issued on</label>
              <Calendar
                inputId="dateIssue"
                dateFormat="dd/mm/yy"
                v-model="state.selection.data.dateIssue"
                showIcon
                showButtonBar
                :showOnFocus="false"
              />
            </div>
            <div class="col-12 text-right">
              <label for="dateDue" class="mr-1">Due date</label>
              <Calendar
                inputId="dateDue"
                dateFormat="dd/mm/yy"
                v-model="state.selection.data.dateDue"
                showIcon
                showButtonBar
                :showOnFocus="false"
              />
            </div>
            <div class="col-12 text-right">
              <label for="dateDelivery" class="mr-1">Delivery date</label>
              <Calendar
                inputId="dateDelivery"
                dateFormat="dd/mm/yy"
                v-model="state.selection.data.dateDelivery"
                showIcon
                showButtonBar
                :showOnFocus="false"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <h1>List invoices</h1>
          <DataTable
            v-model:selection="state.selection"
            v-model:filters="state.filters"
            filterDisplay="menu"
            :globalFilterFields="['id']"
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
            <Column field="created" header="Date"></Column>
            <Column field="data.invoiceNumber" header="Number"></Column>
            <Column field="" header="Summary"></Column>
          </DataTable>
        </div>
      </template>
    </Card>
  </Layout>
</template>
