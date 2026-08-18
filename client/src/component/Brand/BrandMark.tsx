interface BrandMarkProps {
  size?: string;
}

const BrandMark = ({ size = "text-xl sm:text-[23px]" }: BrandMarkProps) => {
  return (
    <span
      className={`className="inline-flex items-center gap-1 font-display text-xl uppercase tracking-[-0.03em] text-ink sm:text-[23px]" ${size}`}
    >
      <span className="text-primary-500">QUIZ</span> ROOM{" "}
      <b
        aria-hidden="true"
        className="ml-1 text-2xl not-italic text-primary-500"
      >
        ϟ
      </b>
    </span>
  );
};

export default BrandMark;
