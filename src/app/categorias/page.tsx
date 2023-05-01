"use client";

import { useEffect, useState } from "react";
import { Collection } from "../models";
import { getCollectionData } from "../services";
import { CardCollection } from "./components";

async function fecthCollectionData() {
  return await getCollectionData();
}

function Categories() {
  const collection = "categories";
  const [subCollections, setSubCollections] = useState<Collection[]>();

  useEffect(() => {
    async function fetchData() {
      const response = await fecthCollectionData();
      setSubCollections(response[collection]);
    }
    fetchData();
  });

  return (
    <div className="flex flex-row items-center justify-around flex-wrap">
      {subCollections?.map((subCollection) => (
        <div key={subCollection.id}>
          <CardCollection title={subCollection.title} />
        </div>
      ))}
    </div>
  );
}

export default Categories;
