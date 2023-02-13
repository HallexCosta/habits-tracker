export async function registerServiceWorker(name: string) {
  return await navigator.serviceWorker.register(name)
}
