import { MoveUpRight } from "lucide-react";
import Link from "next/link";
export interface ThemeButtonProps {
  href: string;
  title: string;
}
const ThemeButton = ({ href, title }: ThemeButtonProps) => {
  return (
    <Link
      href={href}
      className="group inline-flex items-center px-4 md:px-6 py-2.5 bg-gradient-to-r from-[#00bf8f] to-[#001510] text-white font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 relative overflow-hidden "
    >
      <span className="relative z-10 flex items-center gap-4 text-sm md:text-base">
        {title}
        <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-black transition-transform group-hover:rotate-45">
          <MoveUpRight className="w-6 h-4" />
        </div>
      </span>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </Link>
  );
};

export default ThemeButton;
