"use client";

import IconDown from "@/app/components/Navbar/IconDown/IconDown";
import { Collection } from "@/app/models";
import Link from "next/link";
import { useState } from "react";
import Tags from "./Tags/Tags";

interface Props {
  subCollection: Collection;
  collection: string;
}

function SubCategories({ subCollection, collection }: Props) {
  let { path, tags, title } = subCollection;
  path = `${collection}/${path}`;
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const showTags = tags.length > 0;

  const options = {
    lgHidden: true,
    addClass: "lg:rotate-90 lg:grow-0",
  };

  return (
    <li className="group/subCollectio relative pl-2">
      <div className="flex flex-row items-stretch">
        <Link href={path} className="grow whitespace-nowrap pr-10">
          {title}
        </Link>
        {showTags && <IconDown handleOpen={handleOpen} isOpen={isOpen} options={options} />}
      </div>
      <ul>
        {showTags && (
          <div
            className={`${
              !isOpen ? "hidden" : "block"
            } top-0 left-[85%] z-50 rounded-md bg-white p-3 lg:absolute lg:shadow-2xl group-hover/subCollectio:lg:block`}>
            {tags.map((tag) => (
              <Tags key={tag} tag={tag} />
            ))}
          </div>
        )}
      </ul>
    </li>
  );
}

export default SubCategories;
