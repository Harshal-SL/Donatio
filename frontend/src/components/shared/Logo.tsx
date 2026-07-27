import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  showText?: boolean;
  linkTo?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "", showText = true, linkTo = "/" }) => {
  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.svg"
        alt="Donatio Logo"
        className="w-9 h-9 object-contain"
      />
      {showText && (
        <span className="text-lg font-bold text-gradient">Donatio</span>
      )}
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
};
