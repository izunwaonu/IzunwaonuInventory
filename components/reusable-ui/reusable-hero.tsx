import React from "react";
import Link from "next/link";
import { ArrowRight, LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { CustomLinkButton } from "./CustomLinkButton";
import { AnimatedAvatars } from "./avatar-circles";
import StarRating from "./StarRating";

interface FloatingIcon {
  icon: LucideIcon;
  position: "left" | "right" | "center";
}
// Extend interfaces to include announcement
interface Announcement {
  text: string;
  href?: string;
}

interface CTAButton {
  label: string;
  href: string;
  primary?: boolean;
}

type BackgroundStyleType =
  | "green"
  | "blue"
  | "purple"
  | "orange"
  | "red"
  | "neutral"
  | "neutral2"
  | "neutral3"
  | "neutral4"
  | "neutral5"
  | "custom";

interface HeroProps {
  title: string | React.ReactNode;
  mobileTitle?: string;
  subtitle: string;
  buttons: CTAButton[];
  icons: FloatingIcon[];
  backgroundStyle?: BackgroundStyleType;
  announcement?: Announcement;
  customGradient?: string;
  customBackground?: string;
  className?: string;
  theme?: "light" | "dark";
  userCount?: number | null;
}

const ReUsableHero: React.FC<HeroProps> = ({
  title,
  mobileTitle,
  subtitle,
  buttons,
  icons,
  backgroundStyle = "green",
  customGradient,
  customBackground,
  announcement,
  className = "",
  theme = "light",
  userCount,
}) => {
  const themeStyles = {
    light: {
      base: {
        background: "bg-gray-50",
        text: "text-gray-900",
        subtitleText: "text-gray-600",
      },
      grid: {
        opacity: "20",
        size: "12px_12px",
      },
      button: {
        container: "from-gray-50/80 to-gray-50/80 border-gray-200",
        primary: "bg-gray-900 text-white",
        secondary: "text-gray-700 hover:text-gray-900",
      },
      announcement: {
        background: "bg-gray-900/5",
        text: "text-gray-600",
        hover: "hover:text-gray-900",
        border: "border-gray-200",
      },
    },
    dark: {
      base: {
        background: "bg-gray-950",
        text: "text-gray-100",
        subtitleText: "text-gray-300",
      },
      grid: {
        opacity: "15",
        size: "12px_12px",
      },
      button: {
        container: "from-gray-950/80 to-gray-950/80 border-gray-800",
        primary: "bg-white text-gray-900",
        secondary: "text-gray-300 hover:text-white",
      },
      announcement: {
        background: "bg-gray-50/5",
        text: "text-gray-300",
        hover: "hover:text-white",
        border: "border-gray-800",
      },
    },
  };

  const backgroundStyles = {
    // Color Variations
    green: {
      background: theme === "light" ? "bg-emerald-50" : "bg-green-950",
      grid: `bg-[linear-gradient(to_right,#134e13${themeStyles[theme].grid.opacity}_1px,transparent_1px),linear-gradient(to_bottom,#134e13${themeStyles[theme].grid.opacity}_1px,transparent_1px)]`,
      gradient: "from-lime-400 via-green-400 to-emerald-400",
      blur: ["bg-lime-500/30", "bg-green-500/20", "bg-emerald-500/20"],
      floating:
        theme === "light"
          ? "bg-green-100/50 border-green-200"
          : "bg-green-900/50 border-green-800",
      iconColor: theme === "light" ? "text-green-600" : "text-lime-400",
    },
    blue: {
      background: theme === "light" ? "bg-blue-50" : "bg-blue-950",
      grid: `bg-[linear-gradient(to_right,#1e40af${themeStyles[theme].grid.opacity}_1px,transparent_1px),linear-gradient(to_bottom,#1e40af${themeStyles[theme].grid.opacity}_1px,transparent_1px)]`,
      gradient: "from-cyan-400 via-blue-400 to-indigo-400",
      blur: ["bg-blue-500/30", "bg-cyan-500/20", "bg-indigo-500/20"],
      floating:
        theme === "light"
          ? "bg-blue-100/50 border-blue-200"
          : "bg-blue-900/50 border-blue-800",
      iconColor: theme === "light" ? "text-blue-600" : "text-blue-400",
    },
    purple: {
      background: theme === "light" ? "bg-purple-50" : "bg-purple-950",
      grid: `bg-[linear-gradient(to_right,#6b21a8${themeStyles[theme].grid.opacity}_1px,transparent_1px),linear-gradient(to_bottom,#6b21a8${themeStyles[theme].grid.opacity}_1px,transparent_1px)]`,
      gradient: "from-fuchsia-400 via-purple-400 to-violet-400",
      blur: ["bg-purple-500/30", "bg-fuchsia-500/20", "bg-violet-500/20"],
      floating:
        theme === "light"
          ? "bg-purple-100/50 border-purple-200"
          : "bg-purple-900/50 border-purple-800",
      iconColor: theme === "light" ? "text-purple-600" : "text-purple-400",
    },
    orange: {
      background: theme === "light" ? "bg-orange-50" : "bg-orange-950",
      grid: `bg-[linear-gradient(to_right,#c2410c${themeStyles[theme].grid.opacity}_1px,transparent_1px),linear-gradient(to_bottom,#c2410c${themeStyles[theme].grid.opacity}_1px,transparent_1px)]`,
      gradient: "from-amber-400 via-orange-400 to-red-400",
      blur: ["bg-orange-500/30", "bg-amber-500/20", "bg-red-500/20"],
      floating:
        theme === "light"
          ? "bg-orange-100/50 border-orange-200"
          : "bg-orange-900/50 border-orange-800",
      iconColor: theme === "light" ? "text-orange-600" : "text-orange-400",
    },
    red: {
      background: theme === "light" ? "bg-red-50" : "bg-red-950",
      grid: `bg-[linear-gradient(to_right,#b91c1c${themeStyles[theme].grid.opacity}_1px,transparent_1px),linear-gradient(to_bottom,#b91c1c${themeStyles[theme].grid.opacity}_1px,transparent_1px)]`,
      gradient: "from-rose-400 via-red-400 to-pink-400",
      blur: ["bg-red-500/30", "bg-rose-500/20", "bg-pink-500/20"],
      floating:
        theme === "light"
          ? "bg-red-100/50 border-red-200"
          : "bg-red-900/50 border-red-800",
      iconColor: theme === "light" ? "text-red-600" : "text-red-400",
    },
    // Neutral Variations
    neutral: {
      background: theme === "light" ? "bg-gray-50" : "bg-gray-950",
      grid: `bg-[linear-gradient(to_right,#4f4f4f${themeStyles[theme].grid.opacity}_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f${themeStyles[theme].grid.opacity}_1px,transparent_1px)]`,
      gradient:
        theme === "light"
          ? "from-gray-600 via-gray-700 to-gray-800"
          : "from-gray-200 via-gray-400 to-gray-300",
      blur:
        theme === "light"
          ? ["bg-gray-300/30", "bg-gray-200/20", "bg-gray-400/20"]
          : ["bg-gray-500/30", "bg-gray-400/20", "bg-gray-600/20"],
      floating:
        theme === "light"
          ? "bg-gray-100/50 border-gray-200"
          : "bg-gray-900/50 border-gray-800",
      iconColor: theme === "light" ? "text-gray-600" : "text-gray-400",
    },
    neutral2: {
      background: theme === "light" ? "bg-slate-50" : "bg-slate-950",
      grid: `bg-[linear-gradient(to_right,#64748b${themeStyles[theme].grid.opacity}_1px,transparent_1px),linear-gradient(to_bottom,#64748b${themeStyles[theme].grid.opacity}_1px,transparent_1px)]`,
      gradient:
        theme === "light"
          ? "from-slate-600 via-slate-700 to-slate-800"
          : "from-slate-200 via-slate-400 to-slate-300",
      blur:
        theme === "light"
          ? ["bg-slate-300/30", "bg-slate-200/20", "bg-slate-400/20"]
          : ["bg-slate-500/30", "bg-slate-400/20", "bg-slate-600/20"],
      floating:
        theme === "light"
          ? "bg-slate-100/50 border-slate-200"
          : "bg-slate-900/50 border-slate-800",
      iconColor: theme === "light" ? "text-slate-600" : "text-slate-400",
    },
    neutral3: {
      background: theme === "light" ? "bg-zinc-50" : "bg-zinc-950",
      grid: `bg-[linear-gradient(to_right,#71717a${themeStyles[theme].grid.opacity}_1px,transparent_1px),linear-gradient(to_bottom,#71717a${themeStyles[theme].grid.opacity}_1px,transparent_1px)]`,
      gradient:
        theme === "light"
          ? "from-zinc-600 via-zinc-700 to-zinc-800"
          : "from-zinc-200 via-zinc-400 to-zinc-300",
      blur:
        theme === "light"
          ? ["bg-zinc-300/30", "bg-zinc-200/20", "bg-zinc-400/20"]
          : ["bg-zinc-500/30", "bg-zinc-400/20", "bg-zinc-600/20"],
      floating:
        theme === "light"
          ? "bg-zinc-100/50 border-zinc-200"
          : "bg-zinc-900/50 border-zinc-800",
      iconColor: theme === "light" ? "text-zinc-600" : "text-zinc-400",
    },
    neutral4: {
      background: theme === "light" ? "bg-stone-50" : "bg-stone-950",
      grid: `bg-[linear-gradient(to_right,#78716c${themeStyles[theme].grid.opacity}_1px,transparent_1px),linear-gradient(to_bottom,#78716c${themeStyles[theme].grid.opacity}_1px,transparent_1px)]`,
      gradient:
        theme === "light"
          ? "from-stone-600 via-stone-700 to-stone-800"
          : "from-stone-200 via-stone-400 to-stone-300",
      blur:
        theme === "light"
          ? ["bg-stone-300/30", "bg-stone-200/20", "bg-stone-400/20"]
          : ["bg-stone-500/30", "bg-stone-400/20", "bg-stone-600/20"],
      floating:
        theme === "light"
          ? "bg-stone-100/50 border-stone-200"
          : "bg-stone-900/50 border-stone-800",
      iconColor: theme === "light" ? "text-stone-600" : "text-stone-400",
    },
    neutral5: {
      background: theme === "light" ? "bg-neutral-50" : "bg-neutral-950",
      grid: `bg-[linear-gradient(to_right,#737373${themeStyles[theme].grid.opacity}_1px,transparent_1px),linear-gradient(to_bottom,#737373${themeStyles[theme].grid.opacity}_1px,transparent_1px)]`,
      gradient:
        theme === "light"
          ? "from-neutral-600 via-neutral-700 to-neutral-800"
          : "from-neutral-200 via-neutral-400 to-neutral-300",
      blur:
        theme === "light"
          ? ["bg-neutral-300/30", "bg-neutral-200/20", "bg-neutral-400/20"]
          : ["bg-neutral-500/30", "bg-neutral-400/20", "bg-neutral-600/20"],
      floating:
        theme === "light"
          ? "bg-neutral-100/50 border-neutral-200"
          : "bg-neutral-900/50 border-neutral-800",
      iconColor: theme === "light" ? "text-neutral-600" : "text-neutral-400",
    },
    custom: {
      background:
        customBackground ||
        (theme === "light" ? "bg-emerald-50" : "bg-green-950"),
      grid: customBackground
        ? `bg-[linear-gradient(to_right,currentColor_0.4px,transparent_1px),linear-gradient(to_bottom,currentColor_0.4px,transparent_1px)]`
        : `bg-[linear-gradient(to_right,#134e13${themeStyles[theme].grid.opacity}_1px,transparent_1px),linear-gradient(to_bottom,#134e13${themeStyles[theme].grid.opacity}_1px,transparent_1px)]`,
      gradient: customGradient || "from-lime-400 via-green-400 to-emerald-400",
      blur: ["bg-lime-500/30", "bg-green-500/20", "bg-emerald-500/20"],
      floating:
        theme === "light"
          ? "bg-green-100/50 border-green-200"
          : "bg-green-900/50 border-green-800",
      iconColor: theme === "light" ? "text-green-600" : "text-lime-400",
    },
  };

  const style = backgroundStyles[backgroundStyle];
  const currentTheme = themeStyles[theme];

  const getIconPosition = (position: string) => {
    switch (position) {
      case "left":
        return "-left-8 top-0 rotate-6 hover:-rotate-6";
      case "right":
        return "-right-8 top-12 -rotate-12 hover:rotate-12";
      default:
        return "left-1/2 -top-32 rotate-12 hover:-rotate-12";
    }
  };

  return (
    <div
      className={`relative min-h-screen ${style.background} ${currentTheme.base.text} overflow-hidden ${className}`}
    >
      {/* Grid background */}
      <div
        className={`absolute inset-0 ${style.grid}`}
        style={{
          backgroundSize: "12px 12px",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, #000 70%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 pt-10 md:pt-12  sm:px-6 lg:px-8">
        {announcement && (
          <div className="text-center mb-8 z-50">
            {announcement.href ? (
              <Link
                href={announcement.href}
                className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${currentTheme.announcement.background} ${currentTheme.announcement.text} ${currentTheme.announcement.hover} border ${currentTheme.announcement.border}`}
              >
                ✨ {announcement.text}
              </Link>
            ) : (
              <div
                className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium ${currentTheme.announcement.background} ${currentTheme.announcement.text} border ${currentTheme.announcement.border}`}
              >
                ✨ {announcement.text}
              </div>
            )}
          </div>
        )}
        <div className="relative text-center max-w-4xl mx-auto mb-20">
          {/* Decorative blurs */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${style.blur[0]} rounded-full blur-3xl`}
          ></div>
          <div
            className={`absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${style.blur[1]} rounded-full blur-3xl`}
          ></div>
          <div
            className={`absolute top-0 right-1/4 translate-x-1/2 -translate-y-1/2 w-64 h-64 ${style.blur[2]} rounded-full blur-3xl`}
          ></div>

          {/* Floating icons */}
          {icons.map((iconData, index) => {
            const Icon = iconData.icon;
            return (
              <div
                key={index}
                className={`absolute ${getIconPosition(
                  iconData.position
                )} p-4 rounded-2xl ${
                  style.floating
                } backdrop-blur-sm transform transition-transform duration-300 ease-in-out ${
                  iconData.position === "left" ? "hidden md:block" : ""
                }`}
              >
                <Icon className={`w-6 h-6 ${style.iconColor}`} />
              </div>
            );
          })}

          {/* Main content */}
          <h1
            className={`text-3xl md:text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${style.gradient} hidden md:block`}
          >
            {title}
          </h1>
          <h1
            className={`text-3xl md:text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r ${style.gradient} md:hidden px-2`}
          >
            {mobileTitle || title}
          </h1>
          <p
            className={`text-xl ${currentTheme.base.subtitleText} max-w-2xl mx-auto mb-8`}
          >
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((btn, i) => {
              if (btn.primary) {
                return (
                  <Button
                    key={i}
                    asChild
                    size="lg"
                    className="rounded-full h-12 px-6 text-base"
                  >
                    <Link href={btn.href}>
                      {btn.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                );
              }
              return (
                <CustomLinkButton key={i} title={btn.label} href={btn.href} />
              );
            })}
          </div>
          {userCount && (
            <div className="pt-8 pb-4 flex items-center  justify-center gap-8">
              <div className="">
                <AnimatedAvatars />
              </div>
              <div className="">
                <StarRating count={5} />
                <p className="dark:text-slate-900">
                  {userCount} developers use it.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReUsableHero;
