import React, { useState, useEffect, useMemo } from "react"
import useStarWarsAPI from "../hooks/useStarWarsAPI"
import lupaIcon from "../assets/img/search-symbol.png"

export default function DataList({ category }) {
  const { list_name, endpoint, fields } = category

  const [categoryUrl, setCategoryUrl] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [selectedItem, setSelectedItem] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [enrichedItem, setEnrichedItem] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(null)

  // Reset states when the endpoint changes
  useEffect(() => {
    console.log("Endpoint changed:", endpoint)
    setCategoryUrl(`https://swapi.dev/api/${endpoint}`)
    setSearchValue("")
    setSelectedItem(null)
    setEnrichedItem(null)
    setLoadingDetails(false)
    setCurrentPage(1)
  }, [endpoint])

  const { data, error, loading } = useStarWarsAPI(categoryUrl)

  // Memoize valid (filtered) data that excludes items with "unknown"
  const validData = useMemo(() => {
    if (!data) return null
    const validResults = data.results.filter(
      item =>
        typeof item[category.fields[0]] === "string" &&
        item[category.fields[0]].toLowerCase() !== "unknown"
    )
    return {
      ...data,
      results: validResults,
      count: validResults.length,
    }
  }, [data, category.fields])

  // Memoize search results based on user input
  const searchResults = useMemo(() => {
    if (!validData) return null
    const searchResults = validData.results.filter(item =>
      item[category.fields[0]].toLowerCase().includes(searchValue.toLowerCase())
    )
    return {
      ...validData,
      results: searchResults,
      count: searchResults.length,
    }
  }, [validData, searchValue, category.fields])

  // Format field names (e.g., "hair_color" to "Hair Color")
  const formatFieldName = field => {
    if (field === "episode_id") field = "chronological_episode"
    return field
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Clean fields by filtering out fields that are "unknown" or empty
  const cleanedFields = useMemo(() => {
    if (!enrichedItem) return []
    return fields.filter((field, index) => {
      const value = enrichedItem[field]
      if (index === 0) return false
      if (
        !value ||
        value === "0" ||
        (typeof value === "string" &&
          (value.toLowerCase() === "n/a" || value.toLowerCase() === "unknown"))
      )
        return false
      if (typeof value === "string" || Array.isArray(value)) return value.length > 0
      return true
    })
  }, [enrichedItem, fields])

  // Formats values, adds units, handles large numbers, arrays, and non-numeric values for consistent display
  const formatFields = (value, field) => {
    const formatter = new Intl.NumberFormat("en", {
      notation: "compact",
      compactDisplay: "short",
    })

    const units = {
      rotation_period: "hours",
      orbital_period: "days",
      diameter: "km",
      max_atmosphering_speed: "km/h",
      cargo_capacity: "kg",
      height: "cm",
      average_height: "cm",
      mass: "kg",
      average_lifespan: "years",
    }

    if (units[field]) {
      if (field === "cargo_capacity") {
        if (Number(value) >= 1000) {
          return `${formatter.format(Number(value) / 1000)} t` // Convertimos a toneladas
        } else {
          return `${formatter.format(Number(value))} kg`
        }
      }
      if (!isNaN(value)) {
        return `${formatter.format(Number(value))} ${units[field]}`
      } else {
        return value
      }
    }

    if (!isNaN(value)) {
      return formatter.format(Number(value))
    }
    if (Array.isArray(value)) {
      return value.join(", ")
    }
    return value
  }

  const itemsPerPage = 10
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  // Get current page data for pagination
  const currentPageData = searchResults ? searchResults.results.slice(startIndex, endIndex) : []

  // Fetch additional details for the selected item
  const fetchDetailsForSelectedItem = async item => {
    if (!item) return
    setLoadingDetails(true)

    const updatedItem = { ...item }

    for (const key in item) {
      const value = item[key]

      // Fetch details for URLs (e.g., homeworld)
      if (typeof value === "string" && value.includes("https://swapi.dev/api")) {
        try {
          const response = await fetch(value)
          const data = await response.json()
          updatedItem[key] = data?.name
        } catch (err) {
          console.error("Error fetching data: ", err)
        }
      }

      // Fetch details for arrays of URLs (e.g., films)
      if (
        Array.isArray(value) &&
        value.every(v => typeof v === "string" && v.includes("https://swapi.dev/api"))
      ) {
        try {
          const apiPromises = value.map(async url => {
            const response = await fetch(url)
            return response.json()
          })
          const apiResults = await Promise.all(apiPromises)
          updatedItem[key] = apiResults.map(result => result?.name || result?.title)
        } catch (err) {
          console.error("Error fetching films: ", err)
        }
      }
    }

    setEnrichedItem(updatedItem) // Update the enriched item with fetched details
    console.log("Updated enrichedItem:", updatedItem)
    setLoadingDetails(false)
  }

  // Handle item click and fetch its details
  const handleItemClick = item => {
    setEnrichedItem(null)
    setSelectedItem(item)
    fetchDetailsForSelectedItem(item)
  }

  return (
    <div className={`data-container ${error ? "error-mode" : ""}`}>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className="list-container">
            <h2>{list_name} list</h2>
            <div className="search-container">
              <img className="lupa" src={lupaIcon} alt="search-symbol" />
              <input
                type="text"
                value={searchValue}
                placeholder="Search"
                onChange={e => setSearchValue(e.target.value)}
                name="name"
              />
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : searchResults && searchResults.results.length > 0 && searchResults.count ? (
              <>
                <p className="showing-text">
                  Showing {currentPageData.length}/{searchResults.count}
                </p>
                <ul className="lista">
                  {currentPageData.map(item => (
                    <li
                      key={item[category.fields[0]]}
                      onClick={() => handleItemClick(item)}
                      className={selectedItem === item ? "selected" : ""}
                    >
                      {item[category.fields[0]]}
                    </li>
                  ))}
                </ul>
                <div className="pagination-buttons">
                  <button
                    className="prev btn"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="next btn"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={endIndex >= searchResults.results.length}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p>No results found</p>
            )}
          </div>

          <div className="info-container">
            {!loading &&
              (!loadingDetails ? (
                enrichedItem ? (
                  <>
                    <h3>{enrichedItem && enrichedItem[fields[0]]}</h3>
                    {cleanedFields.length > 0 ? (
                      <ul className="lista">
                        {cleanedFields.map(field => (
                          <li key={field}>
                            <span className="light-strong">{formatFieldName(field)}:</span>{" "}
                            {formatFields(enrichedItem[field], field)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="no-info-available message">No info available</p>
                    )}
                  </>
                ) : (
                  <p className="select-item message">Select an item to discover more info</p>
                )
              ) : (
                <p className="loading-details message">Loading details...</p>
              ))}
          </div>
        </>
      )}
    </div>
  )
}
