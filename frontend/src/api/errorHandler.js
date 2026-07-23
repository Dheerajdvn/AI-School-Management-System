export const getApiErrorMessage = (error, fallback = 'Request failed') => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  )
}
