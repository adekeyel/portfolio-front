import { useState, useEffect, useCallback } from 'react'

/**
 * Loads data from an async store function, re-fetches whenever any admin
 * write happens anywhere in the app (via the 'store:updated' event), and
 * exposes loading/error state so pages can show a sensible fallback while
 * talking to the real backend over the network.
 */
export function useStoreData(fetchFn, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setError(null)
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    load()
    window.addEventListener('store:updated', load)
    return () => window.removeEventListener('store:updated', load)
  }, [load])

  return { data, loading, error, reload: load }
}
