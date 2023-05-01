import Link from "next/link";

interface Props {
  tag: string;
}

function Tags({ tag }: Props) {

  const path = `/search/${tag}`;

  return (
    <li className="flex pl-2 lg:p-0">
      <Link href={path} className="grow whitespace-nowrap">
        {tag}
      </Link>
    </li>
  );
}

export default Tags;
