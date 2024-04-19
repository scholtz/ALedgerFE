<script setup lang="ts">
import Layout from '@/layouts/AuthLayout.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
</script>
<template>
  <Layout :hideTopMenu="false">
    <h1>Create new invoice</h1>
    <div class="invoice-layout">
      <div class="invoice-form">
        <div class="invoice-nr-box">
          <div>
            <span>Invoice number:</span>
            <span> 00000003</span>
          </div>
          <div>
            <span>Invoice type:</span>
            <span> SELL</span>
          </div>
        </div>
        <div class="customer-box">
          <span>Customer name</span>
          <InputText type="text" v-model="newInvoice.name" />
        </div>
        <div class="address-box">
          <span>Customer address</span>
          <InputText type="text" v-model="newInvoice.address" />
        </div>
        <div class="currency-box">
          <span>Sold currency</span>
          <select v-model="newInvoice.selectedCurrency">
            <option disabled value="soldCurrency">Sold currency</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
        <div class="amount-currency">
          <span>Amount of currency</span>
          <InputText type="number" v-model="newInvoice.amountOfCurrency" />
        </div>
        <div class="discount">
          <span>Discount in %</span>
          <InputText type="number" v-model="newInvoice.discount" />
        </div>
        <div></div>
        <div class="submit-area">
          <Button class="p-button-raised">Submit and save invoice</Button>
        </div>
      </div>
    </div>
  </Layout>
</template>
<style scoped lang="scss">
.invoice-layout {
  display: flex;
  justify-content: center;
}
.invoice-form {
  background-color: rgba(208, 173, 240, 0.25);
  box-shadow: 6px -5px 11px -5px rgba(0, 0, 0, 0.75);
  padding: 20px 30px;
  width: 35rem;
  border-radius: 6px;
}

.invoice-nr-box {
  align-items: flex-start;
  margin-bottom: 50px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.customer-box,
.address-box,
.currency-box,
.amount-currency,
.discount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

input,
select {
  width: 200px;
}

.submit-area {
  display: flex;
  justify-content: center;
  align-items: center;
}

.p-button.p-button-raised {
  margin-top: 50px;
}
</style>
