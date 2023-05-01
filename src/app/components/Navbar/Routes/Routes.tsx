import { CollectionsItems, RouteItem } from "@/app/models";
import Links from "./Links/Links";

function Routes() {
  const routes: RouteItem[] = [
    {
      id: 0,
      label: "Inicio",
      path: "",
    },
    {
      id: 1,
      label: "Categorias",
      path: "categorias",
      collections: [CollectionsItems.CATEGORIES],
    },
    {
      id: 2,
      label: "Tienda",
      path: "tienda",
      collections: [CollectionsItems.CATEGORIES, CollectionsItems.SPECIALS],
    },
    {
      id: 3,
      label: "Sobre Nosotros",
      path: "nostros",
    },
  ];

  return (
    <ul className="flex flex-col lg:flex-row ">
      {/* Lista no ordenada de rutas */}
      {routes.map((route) => (
        <Links key={route.id} link={route}/>
      ))}
    </ul>
  )
}

export default Routes;
