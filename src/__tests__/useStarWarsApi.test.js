import { renderHook, waitFor } from "@testing-library/react"
import useStarWarsAPI from "../hooks/useStarWarsAPI"

describe("useStarWarsAPI", () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("returns data correctly with a successful API call", async () => {
    const mockAPIResponse1 = {
      results: [
        { name: "Luke Skywalker", height: "172", mass: "77" },
        { name: "Darth Vader", height: "202", mass: "136" },
      ],
      next: "https://swapi.dev/api/people/?page=2",
    }

    const mockAPIResponse2 = {
      results: [{ name: "Leia Organa", height: "150", mass: "49" }],
      next: null,
    }

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAPIResponse1,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAPIResponse2,
      })

    const { result } = renderHook(() => useStarWarsAPI("https://swapi.dev/api/people"))

    expect(result.current.loading).toBe(true)

    await waitFor(() =>
      expect(result.current.data).toEqual({
        results: [
          { name: "Luke Skywalker", height: "172", mass: "77" },
          { name: "Darth Vader", height: "202", mass: "136" },
          { name: "Leia Organa", height: "150", mass: "49" },
        ],
        count: 3,
      })
    )

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  test("handle errors in the application", async () => {
    // Simulate that fetch returns an error
    global.fetch.mockResolvedValueOnce({
      ok: false,
    })

    const { result } = renderHook(() => useStarWarsAPI("https://swapi.dev/api/planets/4"))

    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.error).toBe("Error in the request"))

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBe(null)
  })

  test("use the cache if the data has already been requested", async () => {
    const mockApiResponse = {
      results: [{ name: "Luke Skywalker" }],
      next: null,
    }

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponse,
    })

    const { result, rerender } = renderHook(() =>
      useStarWarsAPI("https://swapi.dev/api/people/?search=Luke")
    )

    await waitFor(() => expect(result.current.data.results).toHaveLength(1))

    expect(fetch).toHaveBeenCalledTimes(1)

    // Render the hook again with the same URL (simulates the use of cache)
    rerender()

    expect(fetch).toHaveBeenCalledTimes(1) // Do not call back
    expect(result.current.data.results).toHaveLength(1)
  })
})
