"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, HelpCircle, Minus, Plus } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "What features does your IzuInventory  offer?",
    answer:
      "Our IzuInventory  provides comprehensive inventory management features including item tracking, stock level monitoring, purchase order management, sales order processing, and barcode scanning. It also includes reporting tools for inventory valuation, stock movement analysis, and sales performance tracking. The app is designed to streamline your inventory workflows and improve operational efficiency.",
  },
  {
    question: "How is your IzuInventory  different from other inventory management solutions?",
    answer:
      "Our IzuInventory  stands out with its intuitive user interface, real-time synchronization across devices, and seamless integration capabilities with popular e-commerce platforms and accounting software. We focus on delivering a complete solution that's both powerful and easy to use, with features like automated reordering, batch tracking, and customizable workflows that adapt to your specific business needs.",
  },
  {
    question: "How do I get started with the IzuInventory ?",
    answer:
      "After signing up, you'll receive immediate access to your account. Our onboarding process will guide you through setting up your inventory items, configuring your warehouses, and importing existing data. We also provide comprehensive documentation and video tutorials to help you get started quickly.",
  },
  {
    question: "Is the IzuInventory  regularly updated?",
    answer:
      "Yes, we actively maintain and update our app with regular feature enhancements, bug fixes, and performance improvements. Our development team closely monitors industry trends and user feedback to continuously improve the application. We typically release updates every two weeks, and you can track our update history in the app's changelog.",
  },
  {
    question: "What should I do if I encounter technical issues?",
    answer:
      "If you experience any technical issues, you can reach out through our in-app support chat or email our dedicated support team. Our technical specialists respond within 24 hours and will work with you to resolve any problems. For common issues, check our knowledge base, which contains troubleshooting guides and FAQs.",
  },
  {
    question: "What pricing plans are available?",
    answer:
      "We offer flexible pricing plans to suit businesses of all sizes. Our plans include: Basic (for small businesses), Professional (for growing businesses), and Enterprise (for large operations). Each plan includes different features and user limits. All plans come with core inventory management features, while advanced features like multi-location management and API access are available in higher-tier plans.",
  },
  {
    question: "Can I use the IzuInventory  on multiple devices?",
    answer:
      "Yes, our IzuInventory  is fully responsive and works across desktop, tablet, and mobile devices. You can access your inventory data from anywhere with an internet connection. Changes made on one device are instantly synchronized across all your devices, ensuring you always have the most up-to-date information.",
  },
  {
    question: "Can I try the IzuInventory  before purchasing?",
    answer:
      "Absolutely! We offer a 14-day free trial with full access to all features. No credit card is required to start your trial. During this period, you can explore all the app's capabilities, import your data, and see how it fits your business needs. Additionally, we offer demo sessions where our team can walk you through specific features.",
  },
  {
    question: "What's your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee on all our plans. If you're not satisfied with our IzuInventory , simply contact our customer support team within 30 days of your purchase, and we'll process your refund. We also offer prorated refunds if you need to cancel an annual subscription after the 30-day period.",
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
            Got questions about our <span className="italic">IzuInventory </span>?
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
            <span className="text-gray-600">Need additional help?</span>
          </div>
          <Link
            href="/#support"
            className="bg-lime-400 text-green-900 px-6 py-2 rounded-full hover:bg-lime-500 transition duration-300 flex items-center"
          >
            Contact support
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}