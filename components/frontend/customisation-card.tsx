import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Code,
  Server,
  Layout,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const CustomizationCard = ({ theme = "light" }) => {
  const isDark = theme === "dark";

  return (
    <Card
      className={`max-w-5xl mx-auto overflow-hidden ${
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
      }`}
    >
      <CardContent className="p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Column - Pricing & CTA */}
          <div
            className={`p-8 md:p-10 ${isDark ? "bg-slate-900" : "bg-white"}`}
          >
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2
                    className={`text-3xl md:text-4xl font-extrabold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Customization and Support?
                  </h2>
                  <HelpCircle
                    className={`w-6 h-6 ${
                      isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  />
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg line-through ${
                        isDark ? "text-slate-500" : "text-slate-400"
                      }`}
                    >
                      $500
                    </span>
                    <span className="px-3 py-1 text-sm font-semibold text-red-700 bg-red-100 rounded-full">
                      UP TO 40% OFF
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-sm font-medium ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      Start At
                    </span>
                    <span
                      className={`text-5xl font-black ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      $300
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p
                className={`text-lg ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Get a customized version of HubStack tailored to your specific
                needs, with premium support and deployment assistance.
              </p>

              {/* CTA Button */}
              <Button
                asChild
                className={`w-full h-14 text-lg font-bold gap-2 group
                  ${
                    isDark
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  } text-white`}
              >
                <a href="https://wa.me/message/5USU26346OWRF1">
                  Get In Touch
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right Column - Features */}
          <div
            className={`p-8 md:p-10 ${
              isDark ? "bg-slate-800/50" : "bg-slate-50"
            }`}
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-purple-100">
                  <Code className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold mb-1 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Custom Feature Development
                  </h3>
                  <p
                    className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                  >
                    Get custom features built specifically for your needs
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100">
                  <Layout className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold mb-1 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Customized Landing Page
                  </h3>
                  <p
                    className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                  >
                    Unique landing page design matching your brand
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-green-100">
                  <Server className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold mb-1 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Server Setup & Deployment
                  </h3>
                  <p
                    className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                  >
                    Complete server configuration and deployment support
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-amber-100">
                  <Rocket className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3
                    className={`text-lg font-bold mb-1 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    Everything your team needs
                  </h3>
                  <p
                    className={`${isDark ? "text-slate-300" : "text-slate-600"}`}
                  >
                    All premium features plus priority support
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomizationCard;
