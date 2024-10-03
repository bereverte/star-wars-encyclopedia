import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import DataList from "../components/DataList"
import useStarWarsAPI from "../hooks/useStarWarsAPI"

jest.mock("../hooks/useStarWarsAPI")

const category = {
  name: "Characters",
  endpoint: "people",
  fields: ["name", "height", "mass", "homeworld"],
}

describe("DataList component", () => {
  beforeEach(() => {
    useStarWarsAPI.mockReturnValue({
      data: null,
      error: null,
      loading: true,
    })
  })

  test("renders loading state initially", () => {
    render(<DataList category={category} />)

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  test("renders results correctly after loading", async () => {
    const mockData = {
      results: [
        { name: "Luke Skywalker", height: "172", mass: "77" },
        { name: "Darth Vader", height: "202", mass: "136" },
      ],
      count: 2,
    }

    useStarWarsAPI.mockReturnValue({
      data: mockData,
      error: null,
      loading: false,
    })

    render(<DataList category={category} />)

    await waitFor(() => {
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument()
    })

    expect(screen.getByText("Darth Vader")).toBeInTheDocument()
  })

  test("handles API error correctly", async () => {
    useStarWarsAPI.mockReturnValue({
      data: null,
      error: "Error: Failed to fetch",
      loading: false,
    })

    render(<DataList category={category} />)

    await waitFor(() => expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument())
  })

  test("filters results based on search input", async () => {
    const mockData = {
      results: [
        { name: "Luke Skywalker", height: "172", mass: "77" },
        { name: "Darth Vader", height: "202", mass: "136" },
      ],
      count: 2,
    }

    useStarWarsAPI.mockReturnValue({
      data: mockData,
      error: null,
      loading: false,
    })

    render(<DataList category={category} />)

    await waitFor(() => {
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText("Search")
    fireEvent.change(searchInput, { target: { value: "Darth" } })

    await waitFor(() => {
      expect(screen.getByText("Darth Vader")).toBeInTheDocument()
      expect(screen.queryByText("Luke Skywalker")).not.toBeInTheDocument()
    })
  })

  test("paginates correctly", async () => {
    const mockData = {
      results: Array.from({ length: 12 }, (_, i) => ({
        name: `Character ${i + 1}`,
      })),
      count: 12,
    }

    useStarWarsAPI.mockReturnValue({
      data: mockData,
      error: null,
      loading: false,
    })

    render(<DataList category={category} />)

    for (let i = 1; i <= 10; i++) {
      expect(screen.getByText(`Character ${i}`)).toBeInTheDocument()
    }

    fireEvent.click(screen.getByText("Next"))

    await waitFor(() => {
      expect(screen.getByText("Character 11")).toBeInTheDocument()
      expect(screen.getByText("Character 12")).toBeInTheDocument()
    })

    for (let i = 1; i <= 10; i++) {
      expect(screen.queryByText(`Character ${i}`)).not.toBeInTheDocument()
    }
  })

  test("selects an item and displays additional details", async () => {
    const mockData = {
      results: [
        {
          name: "Luke Skywalker",
          height: "172",
          mass: "77",
        },
      ],
      count: 1,
    }

    useStarWarsAPI.mockReturnValue({
      data: mockData,
      error: null,
      loading: false,
    })

    render(<DataList category={category} />)

    fireEvent.click(screen.getByText("Luke Skywalker"))

    await waitFor(() => {
      expect(screen.getByText(/Height/i)).toBeInTheDocument()
      expect(screen.getByText("172 cm")).toBeInTheDocument()

      expect(screen.getByText(/Mass/i)).toBeInTheDocument()
      expect(screen.getByText("77 kg")).toBeInTheDocument()
    })

    expect(screen.queryByText("Loading details...")).not.toBeInTheDocument()
  })

  test("selects an item and replaces homeworld URL with planet name", async () => {
    const mockData = {
      results: [
        {
          name: "Luke Skywalker",
          height: "172",
          mass: "77",
          homeworld: "https://swapi.dev/api/planets/1/",
        },
      ],
      count: 1,
    }

    const mockHomeworldDetails = {
      name: "Tatooine",
    }

    useStarWarsAPI.mockReturnValue({
      data: mockData,
      error: null,
      loading: false,
    })

    // Simulates fetch call to return planet details
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockHomeworldDetails),
      })
    )

    render(<DataList category={category} />)

    fireEvent.click(screen.getByText("Luke Skywalker"))

    await waitFor(() => {
      expect(screen.getByText("Loading details...")).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText(/Height/i)).toBeInTheDocument()
      expect(screen.getByText("172 cm")).toBeInTheDocument()

      expect(screen.getByText(/Mass/i)).toBeInTheDocument()
      expect(screen.getByText("77 kg")).toBeInTheDocument()

      // Verify that the name of the planet ‘Tatooine’ appears in place of the URL.
      expect(screen.getByText("Tatooine")).toBeInTheDocument()

      expect(screen.queryByText("Loading details...")).not.toBeInTheDocument()
    })
  })
})
