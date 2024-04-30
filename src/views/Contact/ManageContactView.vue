<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import Layout from '@/layouts/AuthLayout.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from 'primevue/api'
import {
  bffCreateContact,
  bffDeleteContact,
  bffGetContacts,
  bffUpdateContact
} from '@/scripts/axios/BFF'
import { useAppStore } from '@/stores/app'
import { useToast } from 'primevue/usetoast'
import Message from 'primevue/message'
const store = useAppStore()
const toast = useToast()

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
const state = reactive({
  contacts: [],
  processing: false,
  selection: {
    id: '',
    data: {
      businessName: '',
      companyId: '',
      companyTaxId: '',
      companyVATId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      addressId: '',
      signatureUrl: ''
    }
  },
  filters: {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  },
  formShown: false
})

const showForm = () => {
  state.selection = {
    id: '',
    data: {
      businessName: '',
      companyId: '',
      companyTaxId: '',
      companyVATId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      addressId: '',
      signatureUrl: ''
    }
  }
  state.formShown = true
}

const editItem = async () => {
  try {
    console.log('editItem', state.selection.id, state.selection.data)
    state.processing = true
    await bffUpdateContact(
      store.state.authState.arc14Header,
      state.selection.id,
      state.selection.data
    )
    await delay(1000)
    await loadTable()
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

const createItem = async () => {
  state.processing = true
  try {
    console.log('createItem', state.selection.data)
    await bffCreateContact(store.state.authState.arc14Header, state.selection.data)
    await delay(1000)
    await loadTable()
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
const deleteItem = async () => {
  state.processing = true
  try {
    console.log('deleteItem', state.selection.id)
    await bffDeleteContact(store.state.authState.arc14Header, state.selection.id)
    await delay(1000)
    await loadTable()
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
const loadTable = async () => {
  try {
    state.contacts = await bffGetContacts(store.state.authState.arc14Header)
  } catch (e: any) {
    toast.add({
      severity: 'error',
      detail: 'Error occured: ' + (e.message ?? e),
      life: 5000
    })
  }
}
onMounted(async () => {
  if (store.state.authState.arc14Header) {
    state.processing = true
    await loadTable()
    state.processing = false
  }
})

watch(
  () => state.selection.id,
  () => {
    if (state.selection.id) {
      state.formShown = true
    }
  }
)
watch(
  () => store.state.authState.arc14Header,
  async () => {
    if (store.state.authState.arc14Header) {
      state.processing = true
      await loadTable()
      state.processing = false
    }
  }
)
const cancel = () => {
  state.selection = {
    id: '',
    data: {
      businessName: '',
      companyId: '',
      companyTaxId: '',
      companyVATId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      addressId: '',
      signatureUrl: ''
    }
  }
  state.formShown = false
}
</script>
<template>
  <Layout :hideTopMenu="false">
    <Message severity="warn">
      The invoicing product is under review and may change. Please use it for testing purposes at
      the moment.
    </Message>
    <div class="field grid">
      <div class="col-12 lg:col-6 lg:col-offset-3">
        <Card>
          <template #content>
            <h1>Manage your contacts</h1>
            <div v-if="state.formShown">
              <div class="text-right">
                <Button @click="cancel" :disabled="state.processing">Cancel</Button>
              </div>

              <div>
                <h2 v-if="state.selection.id">Edit contact</h2>
                <h2 v-if="!state.selection.id">Create new contact</h2>
                <div class="field grid">
                  <label for="businessName" class="col-12 mb-2 md:col-2 md:mb-0">
                    Business Name
                  </label>
                  <div class="col-12 md:col-10">
                    <InputText
                      id="businessName"
                      v-model="state.selection.data.businessName"
                      class="w-full"
                    />
                  </div>
                </div>
                <div class="field grid">
                  <label for="companyId" class="col-12 mb-2 md:col-2 md:mb-0"> Company ID </label>
                  <div class="col-12 md:col-10">
                    <InputText
                      id="companyId"
                      v-model="state.selection.data.companyId"
                      class="w-full"
                    />
                  </div>
                </div>
                <div class="field grid">
                  <label for="companyTaxId" class="col-12 mb-2 md:col-2 md:mb-0">
                    Company Tax ID
                  </label>
                  <div class="col-12 md:col-10">
                    <InputText
                      id="companyTaxId"
                      v-model="state.selection.data.companyTaxId"
                      class="w-full"
                    />
                  </div>
                </div>
                <div class="field grid">
                  <label for="companyVATId" class="col-12 mb-2 md:col-2 md:mb-0">
                    Company VAT ID
                  </label>
                  <div class="col-12 md:col-10">
                    <InputText
                      id="companyVATId"
                      v-model="state.selection.data.companyVATId"
                      class="w-full"
                    />
                  </div>
                </div>
                <div class="field grid">
                  <label for="firstName" class="col-12 mb-2 md:col-2 md:mb-0">
                    Contact first name
                  </label>
                  <div class="col-12 md:col-10">
                    <InputText
                      id="firstName"
                      v-model="state.selection.data.firstName"
                      class="w-full"
                    />
                  </div>
                </div>
                <div class="field grid">
                  <label for="lastName" class="col-12 mb-2 md:col-2 md:mb-0">
                    Contact last name
                  </label>
                  <div class="col-12 md:col-10">
                    <InputText
                      id="lastName"
                      v-model="state.selection.data.lastName"
                      class="w-full"
                    />
                  </div>
                </div>
                <div class="field grid">
                  <label for="email" class="col-12 mb-2 md:col-2 md:mb-0"> Email </label>
                  <div class="col-12 md:col-10">
                    <InputText id="email" v-model="state.selection.data.email" class="w-full" />
                  </div>
                </div>
                <div class="field grid">
                  <label for="phone" class="col-12 mb-2 md:col-2 md:mb-0"> Phone </label>
                  <div class="col-12 md:col-10">
                    <InputText id="phone" v-model="state.selection.data.phone" class="w-full" />
                  </div>
                </div>
                <div class="field grid">
                  <label for="signatureUrl" class="col-12 mb-2 md:col-2 md:mb-0">
                    Signature Url
                  </label>
                  <div class="col-12 md:col-10">
                    <InputText
                      id="signatureUrl"
                      v-model="state.selection.data.signatureUrl"
                      class="w-full"
                    />
                  </div>
                </div>

                <div class="field grid">
                  <div class="col-12 mb-2 md:col-2 md:mb-0"></div>
                  <div class="col-12 md:col-10">
                    <Button
                      v-if="state.selection.id"
                      @click="editItem"
                      :disabled="state.processing"
                    >
                      Edit
                    </Button>
                    <Button
                      v-if="state.selection.id"
                      @click="deleteItem"
                      severity="danger"
                      class="ml-2"
                      :disabled="state.processing"
                    >
                      Delete
                    </Button>
                    <Button
                      v-if="!state.selection.id"
                      @click="createItem"
                      :disabled="state.processing"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTable
              v-else
              v-model:selection="state.selection"
              :value="state.contacts"
              responsive-layout="scroll"
              selection-mode="single"
              :paginator="true"
              :rows="20"
              v-model:filters="state.filters"
              filterDisplay="menu"
              :globalFilterFields="['data.businessName', 'data.firstName', 'data.lastName']"
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
                    <Button @click="showForm">Add new</Button>
                  </div>
                </div>
              </template>
              <template #empty> No contacts found </template>
              <Column field="data.businessName" header="Business Name" :sortable="true" />
              <Column field="data.firstName" header="First Name" :sortable="true" />
              <Column field="data.lastName" header="Last Name" :sortable="true" />
            </DataTable>
          </template>
        </Card>
      </div>
    </div>
  </Layout>
</template>
