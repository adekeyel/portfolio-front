/**
 * DATA STORE — now backed by your real Express + PostgreSQL API.
 * -----------------------------------------------------------------------
 * Every function here calls the backend over HTTP. Public reads (GET)
 * work for anyone; writes (POST/PUT/DELETE) require an admin to be
 * logged in and send a valid token (handled automatically by api.js).
 *
 * Because these are now real network calls, every function is async.
 * Components call them inside useEffect and store the result in state
 * — see any page or admin file for the pattern.
 * -----------------------------------------------------------------------
 */

import { api } from './api.js'

function notify() {
  window.dispatchEvent(new CustomEvent('store:updated'))
}

export const store = {
  // ---- profile ----
  async getProfile() {
    return api.get('/api/profile')
  },
  async updateProfile(patch) {
    const result = await api.put('/api/profile', patch)
    notify()
    return result
  },

  // ---- portfolio ----
  async getPortfolio() {
    return api.get('/api/portfolio')
  },
  async addPortfolioItem(item) {
    const result = await api.post('/api/portfolio', item)
    notify()
    return result
  },
  async updatePortfolioItem(id, patch) {
    const result = await api.put(`/api/portfolio/${id}`, patch)
    notify()
    return result
  },
  async removePortfolioItem(id) {
    await api.del(`/api/portfolio/${id}`)
    notify()
  },

  // ---- services ----
  async getServices() {
    return api.get('/api/services')
  },
  async addService(item) {
    const result = await api.post('/api/services', item)
    notify()
    return result
  },
  async updateService(id, patch) {
    const result = await api.put(`/api/services/${id}`, patch)
    notify()
    return result
  },
  async removeService(id) {
    await api.del(`/api/services/${id}`)
    notify()
  },

  // ---- bookings ----
  async getBookings() {
    return api.get('/api/bookings')
  },
  async addBooking(booking) {
    // Public endpoint — no auth required, this is what visitors call.
    const result = await api.post('/api/bookings', booking)
    notify()
    return result
  },
  async updateBooking(id, patch) {
    const result = await api.put(`/api/bookings/${id}`, patch)
    notify()
    return result
  },
  async removeBooking(id) {
    await api.del(`/api/bookings/${id}`)
    notify()
  },

  // ---- jobs ----
  async getJobs() {
    return api.get('/api/jobs')
  },
  async addJob(item) {
    const result = await api.post('/api/jobs', item)
    notify()
    return result
  },
  async updateJob(id, patch) {
    const result = await api.put(`/api/jobs/${id}`, patch)
    notify()
    return result
  },
  async removeJob(id) {
    await api.del(`/api/jobs/${id}`)
    notify()
  },
  async applyToJob(jobId, application) {
    return api.post(`/api/jobs/${jobId}/apply`, application)
  },

  // ---- testimonials ----
  async getTestimonials() {
    return api.get('/api/testimonials')
  },
  async addTestimonial(item) {
    const result = await api.post('/api/testimonials', item)
    notify()
    return result
  },
  async updateTestimonial(id, patch) {
    const result = await api.put(`/api/testimonials/${id}`, patch)
    notify()
    return result
  },
  async removeTestimonial(id) {
    await api.del(`/api/testimonials/${id}`)
    notify()
  },

  // ---- contact ----
  async sendContactMessage(message) {
    return api.post('/api/contact', message)
  },
  async getContactMessages() {
    return api.get('/api/contact')
  },

  // ---- legal ----
  async getLegal() {
    return api.get('/api/legal')
  },
  async updateLegal(patch) {
    const result = await api.put('/api/legal', patch)
    notify()
    return result
  },

  // ---- uploads ----
  async uploadFile(file) {
    return api.upload('/api/uploads', file)
  },

  // ---- payments ----
  async initializePayment({ bookingId, email, amountKobo }) {
    return api.post('/api/payments/initialize', { bookingId, email, amountKobo })
  },
  async markBookingPaid(bookingId) {
    const result = await api.post(`/api/payments/mark-paid/${bookingId}`)
    notify()
    return result
  }
}
