import DataList from "./components/DataList"
import Header from "./components/Header"
import { useState } from "react"

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  return (
    <div>
      <div>
        <Header setSelectedCategory={setSelectedCategory} />
      </div>
      <div>{selectedCategory && <DataList category={selectedCategory} />}</div>
    </div>
  )
}

export default App
