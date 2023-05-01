import { CollectionsData } from "../models";

export const getCollectionData = (): CollectionsData => {
  // PONER "Promise" ANTES DE "Array<Categories>" PARA QUE FUNCIONE

  // const URL = "http://localhost:3000/categories.json";
  // return fetch(URL)
  //   .then((response) => response.json())
  //   .then((data) => data.results);
  const response = {
    categories: [
      {
        "id": 0,
        "title": "anillos",
        "path": "anillos",
        "tags": ["grande", "mediano"]
      },
      {
        "id": 1,
        "title": "pulceras",
        "path": "pulceras",
        "tags": ["40cm", "oro", "plata", "anillo de hombre"]
      },
      {
        "id": 2,
        "title": "pendientes",
        "path": "pendientes",
        "tags": []
      }
    ],
    specials: [
      {
        "id": 0,
        "title": "anillo",
        "path": "anillo",
        "tags": []
      },
      {
        "id": 1,
        "title": "Anillos para Hombre",
        "path": "anillos-hombre",
        "tags": []
      }
    ]
  }
  return response;
};
