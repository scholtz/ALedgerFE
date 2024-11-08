<script setup lang="ts">
import Layout from '@/layouts/PublicLayout.vue'
import AOS from 'aos'
import Card from 'primevue/card'
import Button from 'primevue/button'
import 'aos/dist/aos.css'
import { onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
onMounted(() => {
  setTimeout(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    })
  }, 10)
})
const store = useAppStore()
const getSwaggerUrl = () => {
  return store.state.bff + '/swagger'
}
/* eslint-disable no-useless-escape */
</script>
<template>
  <Layout :hideTopMenu="false">
    <div class="m-4">
      <Card data-aos="fade-left" class="col-12 md:col-6 md:col-offset-1">
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-6">
              <h2 class="text-primary">Issue multicurrency invoices</h2>
              Have you ever needed to issue invoice in fixed USDC price with 30 day moving average
              Algorand payout and for government record the EUR price? This service allow you to do
              this and much more.
            </div>
            <div class="col-12 md:col-6 text-right">
              <img height="150" src="/images/policy/1.png" alt="image" data-aos="fade-up" />
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div class="m-4">
      <Card data-aos="fade-right" class="col-12 md:col-offset-5 md:col-6">
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-6">
              <h2 class="text-primary">Manage your contacts</h2>
              Manage your business contacts and invoice them products or services
            </div>
            <div class="col-12 md:col-6 text-right">
              <img height="150" src="/images/policy/2.png" alt="image" data-aos="fade-up" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div class="m-4">
      <Card data-aos="fade-left" class="col-12 md:col-offset-1 md:col-6">
        <template #content>
          <div class="grid">
            <div class="col-12 md:col-6">
              <h2 class="text-primary">Accounting Ledger API</h2>
              Issue invoices using the API service. Track the payment and invoice status of algorand
              issued invoices.
              <span v-if="store.state.bff"
                >See <a :href="getSwaggerUrl()"><Button severity="info">Swagger</Button></a></span
              >
            </div>
            <div class="col-12 md:col-6 text-right">
              <img height="150" src="/images/policy/3.png" alt="image" data-aos="fade-up" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </Layout>
</template>
