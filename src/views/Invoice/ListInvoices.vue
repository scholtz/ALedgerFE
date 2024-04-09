<script setup lang="ts">
import Layout from '@/layouts/AuthLayout.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { ref, onMounted, watch } from 'vue'
//import { InvoiceService } from '@/service/InvoiceService'
import { useAppStore } from '@/stores/app'
const store = useAppStore()
import { bffGetInvoices } from '@/scripts/axios/BFF'

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

const invoices = ref()
</script>
<template>
  <Layout :hideTopMenu="false">
    <h1>List invoices</h1>
    <div class="card">
      <DataTable
        :value="invoices"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        tableStyle="min-width: 50rem"
      >
        <Column field="created" header="Date"></Column>
        <Column field="data.invoiceNumber" header="Number"></Column>
        <Column field="" header="Summary"></Column>
      </DataTable>
    </div>
  </Layout>
</template>
