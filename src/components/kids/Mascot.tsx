import mascotImg from "../../assets/mascot.png";

export function Mascot({
  size = 140,
  float = true,
  priority = false,
  className = "",
}: {
  size?: number;
  float?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <img
      src={mascotImg}
      alt="Twinkle the star, your learning buddy"
      width={size}
      height={size}
      {...(priority ? {} : { loading: "lazy" as const })}
      className={`${float ? "animate-float" : ""} select-none drop-shadow-lg ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
