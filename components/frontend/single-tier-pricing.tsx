import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RocketIcon,
  StarIcon,
  HeartIcon,
  TimerIcon,
  MessageCircleIcon,
} from "lucide-react";

const PricingCard = ({ theme = "light" }) => {
  const isDark = theme === "dark";
  const price = 100.0;
  const originalPrice = 300.0;
  return (
    <div
      id="pricing"
      className={`w-full grid grid-cols-12 max-w-5xl ${isDark ? "bg-slate-900" : "bg-white"} mx-auto rounded-xl overflow-hidden shadow-sm`}
    >
      <div className="col-span-full md:col-span-7  p-8 md:p-12 relative overflow-hidden">
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-blue-900/20 to-purple-900/20" : "bg-gradient-to-br from-blue-50 to-purple-50"}`}
        />

        <div className="space-y-8 relative z-10">
          {/* Header Text */}
          <div className="space-y-3">
            <h2
              className={`text-5xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
            >
              One-time purchase.
            </h2>
            <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500">
              Unlimited projects.
            </h2>
          </div>
          {/* Description */}
          <p
            className={`text-xl leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            HubStack is a one-time purchase with no recurring fees. You get
            access to the repository and can use it for as many projects as you
            want.
          </p>
          {/* Upselling */}
          <div className="p-4 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl border border-amber-200/50">
            <span className="text-amber-700 font-medium ">
              <span className="text-xl">🎉</span> Looking for the advanced
              version checkout{" "}
              <a className="font-bold underline" href="#">
                Hubstack Advanced here
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <Card
        className={`col-span-full md:col-span-5 ${isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200"} backdrop-blur-sm`}
      >
        <CardHeader>
          <div className="space-y-3">
            <h3
              className={`text-2xl font-bold ${isDark ? "text-slate-200" : "text-slate-800"}`}
            >
              Lifetime access
            </h3>
            <p
              className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              for one developer
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xl line-through ${isDark ? "text-slate-500" : "text-slate-400"}`}
                >
                  ${originalPrice}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-6xl font-black tracking-tight ${isDark ? "text-amber-300" : "text-amber-600"}`}
                >
                  ${price}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Discount Badge
          <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl border border-amber-200/50">
            <span className="text-amber-700 font-medium flex items-center gap-2">
              <span className="text-xl">🎉</span> Get $50 off with code
              NEWYEAR50
            </span>
          </div> */}

          {/* Features List */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <StarIcon className="w-6 h-6 text-blue-500" />
              <div className="space-y-1">
                <p
                  className={`font-bold text-lg ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  All features included
                </p>
                <p
                  className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Authentication, billing, user management, and more.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <HeartIcon className="w-6 h-6 text-pink-500" />
              <div className="space-y-1">
                <p
                  className={`font-bold text-lg ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  Lifetime updates
                </p>
                <p
                  className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Last update to codebase: 14 days ago
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <RocketIcon className="w-6 h-6 text-purple-500" />
              <div>
                <p
                  className={`font-bold text-lg ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  Saves you 99+ hours
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <MessageCircleIcon className="w-6 h-6 text-green-500" />
              <div>
                <p
                  className={`font-bold text-lg ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  Exclusive discord server for support
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            className={`w-full h-14 text-lg font-bold tracking-wide
              ${
                isDark
                  ? "bg-gradient-to-r from-amber-300 to-amber-400 text-slate-900 hover:from-amber-400 hover:to-amber-500"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
              } shadow-lg hover:shadow-xl transition-all duration-200`}
          >
            <a href="https://gmukejohnbaptist.gumroad.com/l/hubstack-simple-auth">
              Buy HubStack for Next.js →
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingCard;
