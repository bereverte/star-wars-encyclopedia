import React from "react"
import categories from "../data/categories"
import background from "../assets/img/title-star-wars-short-removebg.png"

export default function Header({ setSelectedCategory }) {
  return (
    <header>
      <div className="title">
        <p className="title-text">encyclopedia of</p>
        <img className="title-img" src={background} alt="Star Wars Logo" />
        <p className="little-text">All the Star Wars data you've ever wanted:</p>
      </div>
      <div className="categories">
        {categories.map((category, index) => {
          const keyName = `${category.name}-element${index + 1}`
          return (
            <button key={keyName} onClick={() => setSelectedCategory(category)}>
              {category.name}
            </button>
          )
        })}
      </div>
    </header>
  )
}
