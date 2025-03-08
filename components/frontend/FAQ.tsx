"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, HelpCircle, Minus, Plus } from "lucide-react";
import Link from "next/link";
const faqs = [
  {
    question: "What is the difference between a starter kit and a boilerplate?",
    answer:
      "A starter kit is typically more opinionated and comes with pre-built features, components, and design decisions, making it ready for immediate use in production. A boilerplate, on the other hand, is usually a bare-bones template with basic setup and structure, requiring more customization and development work. Our starter kit includes fully implemented features like authentication, payment systems, and user management, saving you significant development time.",
  },
  {
    question:
      "How is supastarter different from other starter kits or boilerplates?",
    answer:
      "Our starter kit stands out by providing a complete, production-ready solution with fully implemented features rather than just templates. We include advanced functionality like user authentication, payment processing, email systems, and responsive UI components. Additionally, we maintain clean, well-documented code, regular updates, and provide dedicated support through our Discord community.",
  },
  {
    question: "How do I get access to the boilerplate code?",
    answer:
      "After purchasing, you'll receive immediate access to the complete source code via GitHub. You'll be invited to our private repository where you can clone or download the code. We'll also send you detailed documentation and setup instructions to your registered email address.",
  },
  {
    question: "Is the boilerplate being maintained regularly?",
    answer:
      "Yes, we actively maintain and update the codebase with regular commits, bug fixes, and feature improvements. Our team consistently reviews dependencies, implements security patches, and adds new features based on user feedback and modern development practices. You can check our changelog for detailed update history.",
  },
  {
    question: "What if I find a bug?",
    answer:
      "If you encounter any bugs, you can report them through our GitHub issues or Discord community. Our development team actively monitors these channels and typically responds within 24-48 hours. We prioritize bug fixes and regularly release updates to ensure the stability of the codebase.",
  },
  {
    question: "What do I get for my money?",
    answer:
      "Your purchase includes: Full source code access, Regular updates and improvements, Premium UI components, Authentication system, Payment integration, Email templates, Documentation, APIs, Database schema, Admin dashboard, and Customer support through our Discord community. You also get lifetime access to all future updates within the current major version.",
  },
  {
    question: "What am I allowed to do with the starter template?",
    answer:
      "You can use the starter kit to create unlimited personal or commercial projects. Each license is valid for one developer and can be used to create multiple end products. You cannot resell the source code as-is or redistribute it as another starter kit/boilerplate. The code must be part of a larger application.",
  },
  {
    question: "Can I see what I am getting before purchasing?",
    answer:
      "Yes, you can explore our detailed feature list, view our live demo, and check our documentation to understand the full scope of what's included. We also provide code samples and component previews on our website. Additionally, we offer a 14-day money-back guarantee if you're not satisfied with the product.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Yes, we offer a 14-day money-back guarantee. If you're not satisfied with the starter kit, simply contact our support team within 14 days of purchase, and we'll process your refund. No questions asked. However, refunds cannot be issued if you've already used the code in a production project.",
  },
];
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-green-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-green-600 mb-2 uppercase tracking-wide">
            Frequently Asked Questions
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            You ask? We <span className="italic">answer</span>
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border overflow-hidden shadow-sm"
            >
              <button
                className="w-full text-left p-4 focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-green-600" />
                  ) : (
                    <Plus className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-4 pt-0 text-gray-600">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="mt-12 flex items-center justify-between">
          <div className="flex items-center">
            <HelpCircle className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-gray-600">Need further support?</span>
          </div>
          <Link
            href="/#contact"
            className="bg-lime-400 text-green-900 px-6 py-2 rounded-full hover:bg-lime-500 transition duration-300 flex items-center"
          >
            Contact us
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
