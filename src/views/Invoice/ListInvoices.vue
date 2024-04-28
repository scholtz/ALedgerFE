<script setup lang="ts">
import Layout from '@/layouts/AuthLayout.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from 'primevue/api'
import { ref, onMounted, watch, reactive } from 'vue'
//import { InvoiceService } from '@/service/InvoiceService'
import { useAppStore } from '@/stores/app'
const store = useAppStore()
import { bffGetInvoices } from '@/scripts/axios/BFF'

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
      dateIssue: '',
      dateDue: '',
      dateDelivery: '',
      noteBeforeItems: '',
      noteAfterItems: '',
      currency: ''
    }
  },
  filters: {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  }
})

async function loadInvoices(offset: number, limit: number) {
  if (!store.state.authState?.arc14Header) {
    console.log('NotAuthorization')
    return
  }
  invoices.value = await bffGetInvoices(store.state.authState.arc14Header, offset, limit)
}

watch(store.state.authState, async () => {
  await loadInvoices(0, 10)
})

onMounted(async () => {
  //InvoiceService.getInvoicesMini().then((data) => (products.value = data))
  await loadInvoices(0, 10)
})

const showForm = () => {
  state.formShown = true
}

const cancel = () => {
  state.formShown = false
}
const invoices = ref()
</script>
<template>
  <Layout :hideTopMenu="false">
    <Card>
      <template #content>
        <div v-if="state.formShown" class="grid">
          <div class="col">
            <h1>Create new invoice</h1>
          </div>
          <div class="col text-right">
            <Button @click="cancel" :disabled="state.processing">Cancel</Button>
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
