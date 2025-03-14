import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  CheckCircle,
  RefreshCw,
  Clock,
  MessageCircle,
  Package,
} from "lucide-react";

const PricingCard = ({ theme = "light" }) => {
  const isDark = theme === "dark";
  const price = 79.99;
  const originalPrice = 149.99;
  return (
    <div
      id="pricing"
      className={`w-full grid grid-cols-12 max-w-5xl ${isDark ? "bg-slate-900" : "bg-white"} mx-auto rounded-xl overflow-hidden shadow-sm`}
    >
      <div className="col-span-full md:col-span-7 p-8 md:p-12 relative overflow-hidden">
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-teal-900/20 to-blue-900/20" : "bg-gradient-to-br from-teal-50 to-blue-50"}`}
        />

        <div className="space-y-8 relative z-10">
          {/* Header Text */}
          <div className="space-y-3">
            <h2
              className={`text-5xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Streamline your
            </h2>
            <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-600">
              inventory management.
            </h2>
          </div>
          {/* Description */}
          <p
            className={`text-xl leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            IzuInventory offers a complete inventory solution with no hidden costs. 
            Pay once and manage your stock, orders, and business operations with ease.
          </p>
          {/* Upselling */}
          <div className="p-4 bg-gradient-to-r from-teal-100 to-teal-50 rounded-xl border border-teal-200/50">
            <span className="text-teal-700 font-medium ">
              <span className="text-xl">🚀</span> Need enterprise features? Check out{" "}
              <a className="font-bold underline" href="#">
                IzuInventory Enterprise
              </a>
              {" "}with multi-location support
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
              Professional Plan
            </h3>
            <p
              className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              for small to medium businesses
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
                  className={`text-6xl font-black tracking-tight ${isDark ? "text-teal-300" : "text-teal-600"}`}
                >
                  ${price}
                </span>
                <span className={`${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  / month
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Features List */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <Package className="w-6 h-6 text-teal-500" />
              <div className="space-y-1">
                <p
                  className={`font-bold text-lg ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  Complete inventory solution
                </p>
                <p
                  className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Track stock, manage orders, and handle purchasing
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <RefreshCw className="w-6 h-6 text-blue-500" />
              <div className="space-y-1">
                <p
                  className={`font-bold text-lg ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  Regular updates
                </p>
                <p
                  className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Latest update: New barcode scanning feature
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <BarChart2 className="w-6 h-6 text-indigo-500" />
              <div>
                <p
                  className={`font-bold text-lg ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  Advanced reporting & analytics
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p
                  className={`font-bold text-lg ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  Up to 5 user accounts included
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <MessageCircle className="w-6 h-6 text-orange-500" />
              <div>
                <p
                  className={`font-bold text-lg ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  Priority email & chat support
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            className={`w-full h-14 text-lg font-bold tracking-wide
              ${
                isDark
                  ? "bg-gradient-to-r from-teal-400 to-teal-500 text-slate-900 hover:from-teal-500 hover:to-teal-600"
                  : "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700"
              } shadow-lg hover:shadow-xl transition-all duration-200`}
          >
            <a href="#">
              Start your 14-day free trial →
            </a>
          </Button>
          
          <p className={`text-center text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            No credit card required. Cancel anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingCard;