<script setup lang="ts">
import Layout from '@/layouts/AuthLayout.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
</script>
<template>
  <Layout :hideTopMenu="false">
    <h1>Create new invoice</h1>
    <div class="invoice-form">
      <div class="invoice-nr-box">
        <div>
          <span>Generated invoice number:</span>
          <span> 00000003</span>
        </div>
        <div>
          <span>Invoice type:</span>
          <span> SELL</span>
        </div>
      </div>
      <div class="customer-box">
        <span>Customer name</span>
        <InputText id="customerName" type="text" v-model="customerName" />
      </div>
      <div class="currency-box">
        <span>Sold currency</span>
        <select v-model="selectedCurrency">
          <option disabled value="soldCurrency">Sold currency</option>
          <option>USD</option>
          <option>EUR</option>
        </select>
      </div>
      <div class="amount-currency">
        <span>Amount of currency</span>
        <InputText id="amountCurrency" type="number" v-model="amountCurrency" />
      </div>
      <div class="discount">
        <span>Discount in %</span>
        <InputText id="discount" type="number" v-model="discount" />
      </div>
      <Button class="p-button-raised submit">Submit invoice</Button>
    </div>
  </Layout>
</template>
<style scoped lang="scss">
.invoice-form {
  background-color: rgba(208, 173, 240, 0.3);
  box-shadow: 6px -5px 11px -5px rgba(0, 0, 0, 0.75);
  padding: 20px 30px;
  width: 50%;
  border-radius: 6px;
}

.invoice-nr-box {
  align-items: flex-start;
  margin-bottom: 50px;
  display: flex;
  justify-content: space-between;
}

.customer-box,
.currency-box,
.amount-currency,
.discount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

select {
  // TODO: předělat do komponenty pro všechny themes
  font-family: var(--font-family);
  font-feature-settings: var(--font-feature-settings, normal);
  font-size: 1rem;
  background: #1d1e27;
  padding: 0.75rem 0.75rem;
  border: 1px solid #3e4053;
  transition:
    background-color 0.2s,
    color 0.2s,
    border-color 0.2s,
    box-shadow 0.2s;
  appearance: none;
  border-radius: 6px;
  outline-color: transparent;
  width: 198.4px;
}

.p-button.p-button-raised {
  margin-top: 50px;
}
</style>
