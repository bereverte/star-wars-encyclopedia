import { useState, useEffect, useRef } from "react"

export default function useStarWarsAPI(initialUrl) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // useRef is used to store cached results of the API calls
  const cache = useRef({})

  useEffect(() => {
    const fetchStarWars = async () => {
      setLoading(true)
      setError(null)

      // If the data for this URL is already cached, use it
      if (cache.current[initialUrl]) {
        setData(cache.current[initialUrl])
        setLoading(false)
        return // No need to call the API if the data is already cached
      }

      let allResults = []
      let url = initialUrl

      try {
        // Loop through paginated results while there is a 'next' URL
        while (url) {
          console.log("Fetching data from URL:", url)
          const response = await fetch(url)
          if (!response.ok) throw new Error("Error in the request")

          const result = await response.json()
          console.log("API response:", result)

          allResults = [...allResults, ...result.results]

          url = result.next
        }

        const finalData = {
          results: allResults,
          count: allResults.length,
        }

        // Store the fetched data in the cache
        cache.current[initialUrl] = finalData

        setData(finalData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStarWars()
  }, [initialUrl])

  return { data, error, loading }
}
