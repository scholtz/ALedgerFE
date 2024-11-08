import { createRouter, createWebHistory } from 'vue-router'
import PublicHomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta?.env?.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ left: 0, top: 0 })
      }, 1)
    })
  },

  routes: [
    {
      path: '/',
      name: 'home',
      component: PublicHomeView
    },
    {
      path: '/list-my-invoices',
      name: 'list-my-invoices',
      component: () => import('../views/Invoice/ListInvoices.vue')
    },
    {
      path: '/payments/:invoiceId',
      name: 'invoicePayments',
      component: () => import('../views/Invoice/ManagePayments.vue')
    },
    {
      path: '/manage-contacts',
      name: 'manage-contacts',
      component: () => import('../views/Contact/ManageContactView.vue')
    },
    {
      path: '/about-bitatec-accounting',
      name: 'about-bitatec-accounting',
      component: () => import('../views/AboutUsView.vue')
    },
    {
      path: '/contact-us',
      name: 'auth-contact-us',
      component: () => import('../views/ContactUsView.vue')
    },
    {
      path: '/biatec-accounting-pricing',
      name: 'biatec-accounting-pricing',
      component: () => import('../views/PricingView.vue')
    },
    {
      path: '/settings',
      name: 'auth-settings',
      component: () => import('../views/Settings/SettingsView.vue')
    },
    {
      path: '/email-validation',
      name: 'auth-email-validation',
      component: () => import('../views/Settings/EmailValidation.vue')
    },
    {
      path: '/email-validation/:code',
      name: 'auth-email-validation-with-code',
      component: () => import('../views/Settings/EmailValidation.vue')
    },
    {
      path: '/terms/:id',
      name: 'terms-and-conditions',
      component: () => import('../views/Terms/TermsIndex.vue')
    },
    {
      path: '/gdpr/latest',
      name: 'gdpr',
      component: () => import('../views/GDPR/GdprIndex.vue')
    },
    {
      path: '/gdpr/2023-12-26',
      name: '2023-12-26',
      component: () => import('../views/GDPR/GdprIndex.vue')
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: () => import('../views/Settings/UserProfile.vue')
    }
  ]
})

export default router
