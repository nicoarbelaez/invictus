import { AiOutlineSearch } from "react-icons/ai";

function Search() {
  return (
    <div className="relative flex flex-row rounded-xl border border-current px-2 py-2">
      <AiOutlineSearch className="h-6 w-6 absolute pointer-events-none"/>
      <input className="w-full bg-transparent pl-8 outline-none" placeholder="Buscar" type="text" />
    </div>
  );
}

export default Search;
