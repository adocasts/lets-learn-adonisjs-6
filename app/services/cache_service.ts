class CacheService {
  #store: Record<string, any> = {}

  has(key: string) {
    return key in this.#store
  }

  get(key: string) {
    return this.#store[key]
  }

  set(key: string, value: any) {
    this.#store[key] = value
  }

  delete(key: string) {
    delete this.#store[key]
  }
}

const cache = new CacheService()
export default cache
