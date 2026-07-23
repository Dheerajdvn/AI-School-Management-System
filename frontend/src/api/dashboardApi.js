import httpClient from './httpClient'
import { unwrap } from './response'

export const dashboardApi = {
  totals: () => httpClient.get('/dashboard/totals').then(unwrap),
  byCourse: () => httpClient.get('/dashboard/enrollment-by-course').then(unwrap),
}
