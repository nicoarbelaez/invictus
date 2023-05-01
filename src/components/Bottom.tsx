import { AiOutlineShoppingCart } from "react-icons/ai";

export function Shopping() {
  return (
    <div className="relative flex h-full w-auto justify-center">
      <AiOutlineShoppingCart className="h-8 w-8" />
      <div className="absolute -top-[5%] -right-1/4 h-4 w-4 rounded-full bg-red-500 text-center text-xs text-white">
        0
      </div>
    </div>
  );
}
