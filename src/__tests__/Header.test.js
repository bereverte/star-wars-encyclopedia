import { render, screen, fireEvent } from "@testing-library/react"
import Header from "../components/Header"
import categories from "../data/categories"

describe("Header component", () => {
  test("renders title and image correctly", () => {
    render(<Header setSelectedCategory={jest.fn()} />)

    expect(screen.getByText(/encyclopedia of/i)).toBeInTheDocument()
    expect(screen.getByText(/All the Star Wars data you've ever wanted:/i)).toBeInTheDocument()

    const logo = screen.getByAltText("Star Wars Logo")
    expect(logo).toBeInTheDocument()
  })

  test("renders category buttons correctly", () => {
    render(<Header setSelectedCategory={jest.fn()} />)

    categories.forEach(category => {
      const button = screen.getByText(category.name)
      expect(button).toBeInTheDocument()
    })
  })

  test("calls setSelectedCategory when a category button is clicked", () => {
    const mockSetSelectedCategory = jest.fn()

    render(<Header setSelectedCategory={mockSetSelectedCategory} />)

    // Simulate the click on the first category button
    fireEvent.click(screen.getByText(categories[0].name))

    expect(mockSetSelectedCategory).toHaveBeenCalledWith(categories[0])
  })
})
