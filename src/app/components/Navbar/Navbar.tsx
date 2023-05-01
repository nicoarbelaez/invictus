import Image from "next/image";
import logo from "@/assets/logo/logo.svg";
import logoTipo from "@/assets/logo/logoTipo.svg";
import Shopping from "../Shopping";
import Search from "../Search";
import Routes from "./Routes/Routes";

function Navbar() {
  return (
    <nav className="divide-y-2 bg-white px-4 shadow-md">
      <div className="flex flex-row items-center justify-between gap-20 my-1">
        {/* Logo */}
        <div className="flex flex-row items-center gap-2">
          <Image src={logo} alt="Invictus Joyeria" width={70} height={70} />
          <Image src={logoTipo} alt="Invictus Joyeria" width={80} height={80} />
        </div>
        {/* Search */}
        <div className="grow">
          <Search />
        </div>

        {/* Sign-Login / Shopping */}
        <div className="flex flex-row items-center gap-5">
          <div>
            <Shopping />
          </div>
          <a href="#" className="rounded-xl py-2 px-4 ring-2 ring-black">
            Ingresa
          </a>
          <a href="#" className="rounded-xl bg-black py-2 px-4 text-white">
            Crea tu cuenta
          </a>
        </div>
      </div>
      <div>
        <Routes/>
      </div>
    </nav>
  );
}

export default Navbar;
