import { AiOutlineDown } from "react-icons/ai";

interface ArrowCarouselProps {
  nextCarousel?: boolean;
  funct: {
    next: () => void;
    previous: () => void;
  };
}

function Change({ nextCarousel = true, funct }: ArrowCarouselProps) {
  const onClick = nextCarousel ? funct.next : funct.previous;
  const className = nextCarousel
    ? ["right-0 pl-20 pr-4", "-rotate-90"]
    : ["left-0 pl-4 pr-20", "rotate-90"];

  return (
    <div
      className={`${className[0]} group/carousel absolute top-1/2 z-50 flex h-3/5 w-auto -translate-y-1/2 items-center`}>
      <button
        onClick={onClick}
        className={`${className[1]} h-14 w-14 scale-0 rounded-full bg-black/10 text-white opacity-0 duration-300 hover:bg-amber-500 group-hover/carousel:scale-100 group-hover/carousel:opacity-100`}>
        <AiOutlineDown className="h-1/# mx-auto w-max translate-y-0.5" />
      </button>
    </div>
  );
}

export default Change;
