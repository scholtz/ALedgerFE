<script setup lang="ts">
import Layout from '@/layouts/AuthLayout.vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useAppStore()

import { bffGetInvoice, bffPostPayment } from '@/scripts/axios/BFF'
import { useAppStore } from '@/stores/app'
import { useToast } from 'primevue/usetoast'
import type IPayment from '@/types/IPayment'
const toast = useToast()

const state = reactive({
  savingPayment: false,
  invoice: {
    invoiceNumber: '',
    paymentMethods: [],
    paymentInfo: {
      status: 'UNPAID',
      payments: []
    }
  },
  payment: {
    reference: '',
    network: '',
    currency: '',
    currencyId: '',
    account: '',
    baseAmount: 0,
    grossAmount: 0
  }
})

onMounted(async () => {
  state.invoice = await bffGetInvoice(
    store.state.authState.arc14Header,
    route.params.invoiceId as string
  )
})

const copy = (slotProps: any) => {
  state.payment.account = slotProps.data.account
  state.payment.baseAmount = Math.round(slotProps.data.grossAmount * 10 ** 6)
  state.payment.currency = slotProps.data.currency
  state.payment.currencyId = slotProps.data.currencyId
  state.payment.grossAmount = slotProps.data.grossAmount
  state.payment.network = slotProps.data.network
}

const savePaymentClick = async () => {
  state.savingPayment = true
  try {
    const payment = state.payment as IPayment
    const invoiceId = route.params.invoiceId as string
    await bffPostPayment(payment, invoiceId, store.state.authState.arc14Header)

    state.invoice = await bffGetInvoice(
      store.state.authState.arc14Header,
      route.params.invoiceId as string
    )
    state.savingPayment = false
  } catch (e: any) {
    state.savingPayment = false
    toast.add({
      severity: 'error',
      detail: 'Error occured: ' + (e.message ?? e),
      life: 5000
    })
  }
}
</script>

<template>
  <Layout :hideTopMenu="false">
    <Card>
      <template #content>
        <h1>Manage payments for invoice {{ state.invoice.invoiceNumber }}</h1>
        <p>
          Current status:
          <Badge
            v-if="state.invoice.paymentInfo.status == 'UNPAID'"
            size="large"
            value="Not paid"
            icon="pi pi-cross"
            severity="danger"
          ></Badge>
          <Badge
            v-else-if="state.invoice.paymentInfo.status == 'PAID'"
            size="large"
            value="Paid"
            icon="pi pi-check"
            severity="success"
          ></Badge>
          <Badge
            v-else-if="state.invoice.paymentInfo.status == 'PARTIALPAID'"
            size="large"
            value="Partialy Paid"
            icon="pi pi-check"
            severity="warning"
          ></Badge>
          <Badge v-else size="xlarge" value="Unknown" icon="pi pi-check" severity="danger"></Badge>
        </p>
        <h2>Current payments</h2>
        <DataTable
          responsive-layout="scroll"
          selection-mode="single"
          :value="state.invoice.paymentInfo.payments"
          :paginator="true"
          :rows="20"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          tableStyle="min-width: 50rem"
        >
          <template #empty> No payments yet </template>
          <Column field="reference" header="Reference" sortable></Column>
          <Column field="network" header="Network" sortable></Column>
          <Column field="currency" header="Currency" sortable></Column>
          <Column field="currencyId" header="Currency Id" sortable></Column>
          <Column field="account" header="Account" sortable></Column>
          <Column field="grossAmount" header="Gross Amount" sortable></Column>
        </DataTable>
        <h2>Payment methods</h2>
        <DataTable
          v-if="state?.invoice?.paymentMethods"
          responsive-layout="scroll"
          selection-mode="single"
          :value="state.invoice.paymentMethods"
          :paginator="true"
          :rows="20"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          tableStyle="min-width: 50rem"
        >
          <Column field="currency" header="Currency" sortable></Column>
          <Column field="currencyId" header="Currency Id" sortable></Column>
          <Column field="account" header="Account" sortable></Column>
          <Column field="network" header="Network" sortable></Column>
          <Column field="grossAmount" header="Gross Amount" sortable></Column>
          <Column header="Action" sortable>
            <template #body="slotProps">
              <Button @click="copy(slotProps)"> Copy to form</Button>
            </template>
          </Column>
        </DataTable>
        <h2>Match payment with bank/crypto transfer form</h2>

        <div class="grid">
          <div class="col-12 md:col-2">
            <label for="reference">Tx id</label>
          </div>
          <div class="col-12 md:col-10">
            <InputText id="reference" v-model="state.payment.reference" class="w-full" />
          </div>
        </div>
        <div class="grid">
          <div class="col-12 md:col-2">
            <label for="network">Network</label>
          </div>
          <div class="col-12 md:col-10">
            <InputText id="network" v-model="state.payment.network" class="w-full" />
          </div>
        </div>
        <div class="grid">
          <div class="col-12 md:col-2">
            <label for="currency">Currency</label>
          </div>
          <div class="col-12 md:col-10">
            <InputText id="currency" v-model="state.payment.currency" class="w-full" />
          </div>
        </div>
        <div class="grid">
          <div class="col-12 md:col-2">
            <label for="currencyId">Currency ID</label>
          </div>
          <div class="col-12 md:col-10">
            <InputText id="currencyId" v-model="state.payment.currencyId" class="w-full" />
          </div>
        </div>
        <div class="grid">
          <div class="col-12 md:col-2">
            <label for="account">Account</label>
          </div>
          <div class="col-12 md:col-10">
            <InputText id="account" v-model="state.payment.account" class="w-full" />
          </div>
        </div>
        <div class="grid">
          <div class="col-12 md:col-2">
            <label for="grossAmount">Gross Amount</label>
          </div>
          <div class="col-12 md:col-10">
            <InputNumber
              inputId="grossAmount"
              v-model="state.payment.grossAmount"
              :maxFractionDigits="6"
              class="w-full"
            />
          </div>
        </div>
        <div class="grid">
          <div class="col-12 md:col-offset-2 md:col-10">
            <Button @click="savePaymentClick" :disabled="state.savingPayment">Save</Button>
          </div>
        </div>
      </template>
    </Card>
  </Layout>
</template>
