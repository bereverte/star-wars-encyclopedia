const categories = [
  {
    name: "Planets",
    endpoint: "planets",
    fields: [
      "name",
      "rotation_period",
      "orbital_period",
      "climate",
      "terrain",
      "population",
      "diameter",
      "gravity",
      "residents",
    ],
  },
  {
    name: "Spaceships",
    endpoint: "starships",
    fields: [
      "name",
      "model",
      "manufacturer",
      "starship_class",
      "cargo_capacity",
      "passengers",
      "crew",
      "max_atmosphering_speed",
      "hyperdrive_rating",
    ],
  },
  {
    name: "Vehicles",
    endpoint: "vehicles",
    fields: [
      "name",
      "model",
      "manufacturer",
      "vehicle_class",
      "cargo_capacity",
      "passengers",
      "crew",
      "max_atmosphering_speed",
    ],
  },
  {
    name: "Characters",
    endpoint: "people",
    fields: [
      "name",
      "height",
      "mass",
      "hair_color",
      "skin_color",
      "eye_color",
      "birth_year",
      "gender",
      "homeworld",
      "films",
      "vehicles",
    ],
  },
  {
    name: "Films",
    endpoint: "films",
    fields: ["title", "episode_id", "director", "producer", "release_date"],
  },
  {
    name: "Species",
    endpoint: "species",
    fields: [
      "name",
      "classification",
      "designation",
      "average_height",
      "skin_colors",
      "hair_colors",
      "eye_colors",
      "average_lifespan",
      "homeworld",
      "language",
    ],
  },
]

export default categories
