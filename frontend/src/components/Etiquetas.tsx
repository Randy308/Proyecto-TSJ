import { useMemo } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export const Etiquetas = ({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (value: string) => void;
}) => {
  const list = ["AND", "OR", "NOT"];
  const index = list.indexOf(selected);

  const arrowBack = useMemo(() => <IoIosArrowBack />, []);

  const arrowForward = useMemo(() => <IoIosArrowForward />, []);
  return (
    <div className="flex items-center gap-2 border rounded-md p-1 m-1">
      <a
        className="hover:cursor-pointer"
        onClick={() => onChange(list[(index - 1 + list.length) % list.length])}
      >
        {arrowBack}
      </a>
      <span>{selected}</span>
      <a
        className="hover:cursor-pointer"
        onClick={() => onChange(list[(index + 1) % list.length])}
      >
        {arrowForward}
      </a>
    </div>
  );
};
