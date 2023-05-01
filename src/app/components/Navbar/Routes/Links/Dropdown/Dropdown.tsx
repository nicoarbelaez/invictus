import { CollectionsItems } from "@/app/models";
import Collection from "./Collection/Collection";

interface Props {
  collections: CollectionsItems[];
}

function Dropdown({ collections }: Props) {
  return (
    <div className="top-full left-0 z-50 flex flex-col rounded-md bg-white lg:absolute lg:flex-row lg:gap-4 lg:p-3 lg:shadow-2xl">
      {collections.map((collection) => (
        <Collection key={collection} collection={collection} />
      ))}
    </div>
  );
}

export default Dropdown;
