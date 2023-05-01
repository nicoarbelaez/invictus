import { AiOutlineDown } from "react-icons/ai";

interface options {
  lgHidden: boolean;
  addClass: string;
}

interface Props {
  isOpen: boolean;
  handleOpen: () => void;
  options?: options;
}

function IconDown({ isOpen, handleOpen, options = {lgHidden: false, addClass: ""} }: Props) {

  const isHidden = !options.lgHidden ? "lg:hidden" : "";

  return (
    <div
      className={`flex grow cursor-pointer items-center justify-end ${isHidden} ${options.addClass}`}
      onClick={handleOpen}>
      <AiOutlineDown className={`${isOpen ? "rotate-0" : "rotate-180"} h-3 duration-200`} />
    </div>
  );
}

export default IconDown;
