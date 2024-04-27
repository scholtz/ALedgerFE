<script setup lang="ts">
import Layout from '@/layouts/AuthLayout.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { computed, ref, unref } from 'vue'

const name = ref('')
const address = ref('')
const amountOfCurrency = ref(0)
const discount = ref(0)
const selectedCurrency = ref('')
const eurCost = 25
const usdCost = 24

const noValues = () => {
  const warningSign = 'Please fill all required fields.'
  if (name.value === '') {
    return warningSign
  }
  if (address.value === '') {
    return warningSign
  }
  if (selectedCurrency.value === '') {
    return warningSign
  }
  if (amountOfCurrency.value < 1) {
    return warningSign
  }
}

const saveValues = () => {
  if (name.value !== '') {
    localStorage.setItem(name.value, toString())
  }
  if (address.value !== '') {
    localStorage.setItem(address.value, toString())
  }
  if (amountOfCurrency.value !== 0) {
    localStorage.key(amountOfCurrency.value)
  }
  if (discount.value !== 0) {
    localStorage.key(discount.value)
  }
  localStorage.setItem(selectedCurrency.value, toString())
  console.log(name, address, amountOfCurrency, discount, selectedCurrency)
}

const giveResult = () => {
  saveValues()
  if (selectedCurrency.value === 'usd') {
    const usdResult = amountOfCurrency.value * usdCost
    console.log('Cena prodaných dollarů je ' + usdResult)
    if (discount.value !== 0) {
      console.log('Sleva na dollary ' + (usdResult / 100) * discount.value + ' Kč.')
    }
  }
  if (selectedCurrency.value === 'eur') {
    const eurResult = amountOfCurrency.value * eurCost
    console.log('Cena prodaných eur je ' + eurResult)
    if (discount.value !== 0) {
      console.log('Sleva na eura ' + (eurResult / 100) * discount.value + ' Kč.')
    }
  }
}
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
          <span>Customer name *</span>
          <InputText type="text" v-model="name" required="true" placeholder="First and last name" />
        </div>
        <div class="address-box">
          <div class="breaker">
            <span>Customer address *</span>
            <div class="address-info">Street, number, post code and city</div>
          </div>
          <InputText type="text" v-model="address" required="true" placeholder="Full address" />
        </div>
        <div class="currency-box">
          <span>Sold currency *</span>
          <select v-model="selectedCurrency" required="true">
            <option disabled value="soldCurrency">Sold currency</option>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
          </select>
        </div>
        <div class="amount-currency">
          <span>Amount of currency *</span>
          <InputText type="number" v-model="amountOfCurrency" required="true" />
        </div>
        <div class="discount">
          <span>Discount in %</span>
          <InputText type="number" v-model="discount" />
        </div>
        <div v-if="noValues()" class="info-star-box">
          <span class="star">*</span>
          <span class="info">Mandatory fields</span>
        </div>

        <div class="submit-area">
          <Button v-if="noValues()" disabled class="p-button-raised"
            >Please fill all required fields.</Button
          >
          <Button v-else class="p-button-raised" @click="saveValues(), giveResult()"
            >Submit and save invoice</Button
          >
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

.info-star-box {
  height: 40px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.info {
  font-size: 10px;
}

.star {
  color: red;
  margin: 0 5px;
  font-size: 30px;
}

.breaker {
  display: block;
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

.address-info {
  margin-top: 5px;
  font-size: 10px;
}

input,
select {
  width: 230px;
}

.submit-area {
  display: flex;
  justify-content: center;
  align-items: center;
}

.p-button.p-button-raised {
  margin-top: 50px;
}

.invoice-review {
  background-color: rgba(208, 173, 240, 0.25);
  box-shadow: 6px -5px 11px -5px rgba(0, 0, 0, 0.75);
  padding: 20px 30px;
  width: 50rem;
  border-radius: 6px;
}
</style>
