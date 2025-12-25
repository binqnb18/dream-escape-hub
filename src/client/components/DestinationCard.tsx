type DestinationCardProps = {
  image: string;
  name: string;
  size?: "large" | "small";
};

const DestinationCard = ({ image, name, size = "large" }: DestinationCardProps) => {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-2xl transition-transform hover:scale-[1.02] h-full w-full">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent" />
      <div className={`absolute ${size === "small" ? "bottom-3 left-3 md:bottom-4 md:left-4" : "bottom-4 left-4 md:bottom-6 md:left-6"}`}>
        <span className={`inline-block px-4 py-2 bg-background/90 backdrop-blur-sm rounded-full ${size === "small" ? "text-xs md:text-sm" : "text-sm md:text-base"} font-semibold text-foreground shadow-lg`}>
          {name}
        </span>
      </div>
    </div>
  );
};

export default DestinationCard;
