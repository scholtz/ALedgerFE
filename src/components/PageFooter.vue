<script setup lang="ts">
import Image from 'primevue/image'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Card from 'primevue/card'
import { ref, onMounted, onBeforeUnmount } from 'vue'
const isMobile = ref(false)

function handleResize() {
  if (window.innerWidth <= 768) {
    isMobile.value = true
  } else {
    isMobile.value = false
  }
}

onMounted(() => {
  if (window.innerWidth <= 768) {
    isMobile.value = true
  }
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
<template>
  <Card class="surface-section custom-footer py-7 md:px-6 lg:px-8 m-2">
    <template #content>
      <div class="grid">
        <div class="lg:col-3 md:col-6 md:text-center sm:col-12 mb-4 px-5 text-center">
          <span class="mb-3 inline-block footer-name" style="border-radius: 10px"> </span>
          <div class="text-900 text-xl mb-3 font-medium footer-name">
            <a href="https://www.biatec.io"><Button link>Part of the Biatec Group</Button></a>
          </div>
          <span class="text-300 line-height-3">&copy; 2023 - 2004 Scholtz &amp; Company, jsa</span>
        </div>
        <div
          :class="
            isMobile
              ? 'col-12 px-5 font-style text-center'
              : 'lg:col-3 md:col-6 md:text-center sm:col-12 px-5 font-style'
          "
        >
          <div class="text-900 text-xl mb-3 font-medium">Links</div>
          <!-- <div class="font-style-div">
            <RouterLink to="/about-bitatec-accounting">
              <Button link severity="secondary" size="small" class="m-0 p-0">
                About the project
              </Button>
            </RouterLink>
          </div>
          <div class="font-style-div">
            <RouterLink to="/contact-us">
              <Button link severity="secondary" size="small" class="m-0 p-0"> Contact us </Button>
            </RouterLink>
          </div> -->
          <div class="font-style-div">
            <RouterLink to="/gdpr/latest">
              <Button link severity="secondary" size="small" class="m-0 p-0"> GDPR policy </Button>
            </RouterLink>
          </div>
          <div class="font-style-div">
            <RouterLink to="/terms/latest">
              <Button link severity="secondary" size="small" class="m-0 p-0">
                Terms and agreement
              </Button>
            </RouterLink>
          </div>
        </div>

        <div
          :class="
            isMobile
              ? 'col-12 px-5 font-style text-center mt-2'
              : 'lg:col-3 md:col-6 md:text-center sm:col-12 px-5 font-style'
          "
        >
          <div class="text-900 text-xl mb-3 font-medium">Resources</div>
          <div class="font-style-div">
            <RouterLink to="/settings">
              <Button link severity="secondary" size="small" class="m-0 p-0"> Settings </Button>
            </RouterLink>
          </div>
          <!-- <div class="font-style-div">
            <RouterLink to="/biatec-accounting-pricing">
              <Button link severity="secondary" size="small" class="m-0 p-0"> Pricing </Button>
            </RouterLink>
          </div> -->
        </div>
        <div
          :class="
            isMobile
              ? 'col-12 px-5 font-style text-center mt-2 contactus'
              : 'lg:col-3 md:col-6 md:text-center sm:col-12 px-5 font-style contactus'
          "
        >
          <div class="text-900 text-xl mb-3 font-medium ml-2">Contact US</div>
          <a href="https://discord.gg/8m4KTcVSH9">
            <Button icon="pi pi-discord" severity="info" text raised rounded aria-label="User" />
          </a>
          <a href="https://t.me/+mWQObAvGe_5lNDNk">
            <Button
              icon="pi pi-telegram"
              severity="warning"
              label=""
              text
              raised
              rounded
              aria-label="Notification"
            />
          </a>
          <a href="https://twitter.com/eAlgonaut/">
            <Button
              icon="pi pi-twitter"
              severity="help"
              text
              raised
              rounded
              aria-label="Favorite"
            />
          </a>
        </div>
      </div>
    </template>
  </Card>
</template>
<style scoped>
.use-text-subtitle {
  margin-bottom: 48px;
  font-size: 30px;
  line-height: 36px;
  font-weight: var(--font-medium) !important;
}
.font-style .font-medium {
  font-size: 20px !important;
  font-weight: var(--font-bold);
  text-transform: uppercase;
}
.footer-two {
  padding-top: 40px;
  border-top: 1px solid rgb(216 216 216 / 53%);
  max-width: 100%;
  clip: rect(0, auto, auto, 0);
  height: 100%;
  overflow: hidden;
  top: 0;
  width: 100%;
}
</style>
