"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Instagram, Facebook, Linkedin, MessageSquare } from "lucide-react";

// Define the form schema using Zod
const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

export default function WaitList() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", data);
      reset();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-blue-900 flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(circle at center, black, transparent 80%)",
        }}
      />

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl" />

      {/* Main Content */}
      <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
        {/* Headline with Gradient Effect */}
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 mb-6 animate-gradient">
            Join Our Product
            <br />
            Launch Waitlist
          </h1>
          <div className="absolute inset-0 text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 blur-lg opacity-50">
            Join Our Product
            <br />
            Launch Waitlist
          </div>
        </div>

        <p className="text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed">
          Be part of something truly extraordinary. Join thousands of others
          already gaining early access to our revolutionary new product.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-12">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="flex-grow max-w-md">
              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className={`w-full px-6 py-4 rounded-lg bg-blue-800/20 backdrop-blur-sm text-white 
                  placeholder-gray-400 border ${errors.email ? "border-red-500" : "border-blue-700/50"}
                  focus:outline-none focus:border-blue-500 transition-colors`}
                disabled={isSubmitting || isSubmitSuccessful}
              />
              {errors.email && (
                <div className="text-red-500 text-sm text-left mt-2">
                  {errors.email.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isSubmitSuccessful}
              className={`px-8 py-4 bg-black text-white rounded-lg font-semibold transition-all
                ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-900"}
                ${isSubmitSuccessful ? "bg-green-600 hover:bg-green-600" : ""}`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : isSubmitSuccessful ? (
                "Thanks for joining! ✓"
              ) : (
                "Get Notified"
              )}
            </button>
          </div>
        </form>

        {/* Success Message */}
        {isSubmitSuccessful && (
          <div className="text-green-400 text-lg animate-fade-in">
            We'll notify you when we launch!
          </div>
        )}

        {/* Waitlist Counter */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="flex -space-x-2">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold ring-2 ring-blue-900">
              JD
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold ring-2 ring-blue-900">
              AS
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold ring-2 ring-blue-900">
              MK
            </div>
          </div>
          <span className="text-gray-400 ml-4">
            100+ people on the waitlist
          </span>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6">
          <a
            href="#"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <Linkedin className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
}

// Add keyframe animations
const style = document.createElement("style");
style.textContent = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-gradient {
    background-size: 200% auto;
    animation: gradient 8s linear infinite;
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);
