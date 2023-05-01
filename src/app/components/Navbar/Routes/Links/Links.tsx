"use client";

import { RouteItem } from "@/app/models";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import IconDown from "../../IconDown/IconDown";
import Dropdown from "./Dropdown/Dropdown";

interface Props {
  link: RouteItem;
}

function Links({ link }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { label, path, collections } = link;
  const emptyCollection = collections != undefined && collections.length > 0;

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <li className="group relative flex flex-col bg-white text-sm capitalize hover:lg:bg-gray-100">
      {/* Elemento de la lista de rutas */}
      <div className="flex flex-row items-stretch">
        <Link className="flex grow flex-row items-center gap-1 py-0.5 lg:px-3" href={path}>
          {label}
          {emptyCollection && (
            <AiOutlineDown className="hidden h-3 rotate-180 duration-200 lg:block group-hover:lg:rotate-0" />
          )}
        </Link>
        {emptyCollection && <IconDown handleOpen={handleOpen} isOpen={isOpen} />}
      </div>
      {emptyCollection && (
        <div className={`${!isOpen ? "hidden" : "block"} group-hover:lg:block`}>
          <Dropdown collections={collections} />
        </div>
      )}
    </li>
  );
}

export default Links;
