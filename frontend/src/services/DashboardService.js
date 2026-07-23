import { DashboardApi } from './api'

const DashboardService = {
  async getTotals() {
    try {
      return await DashboardApi.totals()
    } catch (e) {
      // Backend may not support totals; return null to allow UI fallback
      return null
    }
  },

  async getEnrollmentByCourse() {
    try {
      return await DashboardApi.byCourse()
    } catch (e) {
      return null
    }
  },

  async getRecentDocuments(limit = 5) {
    try {
      const res = await DashboardApi.recentDocuments(limit)
      return res || []
    } catch (e) {
      return []
    }
  },

  async getRecentStudents(limit = 5) {
    try {
      const res = await DashboardApi.recentStudents(limit)
      return res || []
    } catch (e) {
      return []
    }
  },

  async getDocumentsUploadedPerMonth(months = 12) {
    try {
      const res = await DashboardApi.documentsMonthly(months)
      return res || { labels: [], values: [] }
    } catch (e) {
      return { labels: [], values: [] }
    }
  },
}

export default DashboardService
