## Star Wars Encyclopedia

### Project Description
This **Star Wars Encyclopedia** is a React application that provides information from the Star Wars universe, leveraging the [SWAPI (Star Wars API)](https://swapi.dev/). Users can explore various categories, including planets, starships, vehicles, people, films, and species, and discover detailed information about each item.

The project is hosted on **GitHub Pages** and can be accessed [here](https://bereverte.github.io/star-wars-encyclopedia/).

### Features
- **Category selection**: Users can choose between various categories such as planets, starships, vehicles, people, films, and species.
- **Search functionality**: Users can search within the selected category to find specific items.
- **Pagination**: Results are paginated, with navigation buttons to move between pages.
- **Detail view**: Clicking on an item will fetch and display additional information about it, such as related films or additional properties.
- **Responsive design**: The application is responsive and adapts to different screen sizes, including mobile devices.

### Tech Stack
- **React**: Frontend framework.
- **CSS3**: Styling and responsive layout.
- **SWAPI (Star Wars API)**: Data source for Star Wars-related information.
- **GitHub Pages**: Hosting for the live version of the app.

### Testing
The project includes unit tests for both components and the custom hook. Here's a breakdown:

- **Components**: 
  - `Header`: Tests ensure that the category buttons render correctly and trigger the appropriate actions when clicked.
  - `DataList`: Tests validate the rendering of search results, pagination, and correct handling of empty or error states.
  
- **Custom Hook**: 
  - `useStarWarsApi`: Tested to simulate API calls, handle successful responses, errors, and ensure proper cache usage when fetching data.
