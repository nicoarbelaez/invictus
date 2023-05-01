import React from "react";

interface Props {
  title: string;
}

function CardCollection({ title }: Props) {
  return (
    <div className="rounded-md bg-gray-100 flex flex-col items-center gap-2 shadow">
      <h3 className="capitalize font-semibold">{title}</h3>
      <div className="h-64 w-64 bg-red-100"></div>
      <a className="cursor-pointer rounded-md bg-gray-500 py-1 px-4">Ver</a>
    </div>
  );
}

export default CardCollection;
