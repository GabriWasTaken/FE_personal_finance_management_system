export const addAccount = async ({name, handleError}: {name: string, handleError: ({error}: {error: {status: number}}) => void}) => {
  const response = await fetch(import.meta.env.VITE_BASE_URL + '/accounts', { method: 'POST', body: JSON.stringify({ name }) })
  if (!response.ok) {
    handleError({ error: response });
    throw new Error('Network response was not ok')
  }
  return response.json();
}