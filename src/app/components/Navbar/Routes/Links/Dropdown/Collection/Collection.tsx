"use client";

import IconDown from "@/app/components/Navbar/IconDown/IconDown";
import { Collection, CollectionsItems } from "@/app/models";
import { getCollectionData } from "@/app/services";
import Link from "next/link";
import { useEffect, useState } from "react";
import SubCollection from "./SubCollection/SubCollection";

interface Props {
  collection: CollectionsItems;
}

async function fecthCollectionData() {
  return await getCollectionData();
}

function Categories({ collection }: Props) {
  const [subCollections, setSubCollections] = useState<Collection[]>();
  
  useEffect(() => {
    async function fetchData() {
      const response = await fecthCollectionData();
      setSubCollections(response[collection]);
    }
    fetchData();
  }, [collection]);
  
  const [isOpen, setIsOpen] = useState(false);
  const translate = { categories: "categorias", specials: "especiales" };
  
  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ul className="relative pl-2 lg:p-0">
      {/* Lista de collecion */}
      <div className="flex flex-row items-stretch">
        <Link href={translate[collection]} className="grow py-0.5 font-semibold">
          {translate[collection]}
        </Link>
        <IconDown handleOpen={handleOpen} isOpen={isOpen} />
      </div>
      <div className={`${!isOpen ? "hidden" : "block"} lg:block`}>
        {subCollections?.map((subCollection) => (
          <SubCollection key={subCollection.id} subCollection={subCollection} collection={translate[collection]} />
        ))}
      </div>
    </ul>
  );
}

export default Categories;
