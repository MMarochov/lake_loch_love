import { OS_API_KEY } from '$env/static/private'

export async function load() {
  return { OS_API_KEY } // secret 🤫
}