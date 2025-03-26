export const addAccount = (name: string) => {
  return fetch(import.meta.env.VITE_BASE_URL + '/accounts', { method: 'POST', body: JSON.stringify({ name }) })
}