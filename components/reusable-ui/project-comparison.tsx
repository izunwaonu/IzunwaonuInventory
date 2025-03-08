import React from "react";
import {
  LayoutTemplate,
  KeyRound,
  Mail,
  Database,
  Palette,
  FileText,
  Search,
  TableProperties,
  Upload,
  CheckCircle,
  Clock,
  Rocket,
  X,
  ArrowRight,
} from "lucide-react";

interface TimelineStep {
  title: string;
  highlight: string;
  duration: number;
  icon: React.ReactNode;
  painPoint: string;
  benefit: string;
}

const ProjectComparison = ({ theme = "light" }) => {
  const steps: TimelineStep[] = [
    {
      title: "Creating",
      highlight: "Agency page",
      duration: 10,
      icon: <LayoutTemplate className="w-4 h-4" />,
      painPoint:
        "Struggling with responsive design, animations, and optimizing for different devices",
      benefit:
        "Pre-built, responsive landing pages with modern animations and optimized performance",
    },
    {
      title: "Setting up",
      highlight: "DB and Authentication w Roles",
      duration: 15,
      icon: <KeyRound className="w-4 h-4" />,
      painPoint:
        "Implementing secure auth flows, social logins, and session management",
      benefit:
        "Production-ready authentication with multiple providers,user roles and secure session handling",
    },
    {
      title: "Setting up",
      highlight: "Forms & Uploads",
      duration: 10,
      icon: <Database className="w-4 h-4" />,
      painPoint:
        "Creating forms,Handling file uploads can be really a daunting task where you can spend countless hours ",
      benefit:
        "Pre-configured Reusable Form Inputs with react hook form, Re-usable file upload components with uploadthing",
    },
    {
      title: "Setting up",
      highlight: "Emails",
      duration: 6,
      icon: <Mail className="w-4 h-4" />,
      painPoint: "Wrestling with email templates, testing, and deliverability",
      benefit:
        "Ready-to-use email templates with testing and reliable delivery setup",
    },

    {
      title: "Designing",
      highlight: "Modern UI",
      duration: 18,
      icon: <Palette className="w-4 h-4" />,
      painPoint:
        "Building consistent UI components and maintaining design system",
      benefit:
        "Beautiful, ready-to-use UI components following modern design principles",
    },
    {
      title: "Setting up",
      highlight: "Blog",
      duration: 8,
      icon: <FileText className="w-4 h-4" />,
      painPoint:
        "Creating blog layout, managing content, and implementing features",
      benefit:
        "Full-featured blog system with content management and rich features",
    },
    {
      title: "Setting up",
      highlight: "Mdx Docs",
      duration: 10,
      icon: <FileText className="w-4 h-4" />,
      painPoint: "Creating a documentation is very Scary",
      benefit: "Full-featured Mdx docs ",
    },
    {
      title: "Optimizing",
      highlight: "SEO",
      duration: 4,
      icon: <Search className="w-4 h-4" />,
      painPoint: "Implementing meta tags, sitemaps, and SEO best practices",
      benefit:
        "SEO-optimized structure with automatic meta tags and sitemap generation",
    },
    {
      title: "Building",
      highlight: "Dashboard & Data tables",
      duration: 12,
      icon: <TableProperties className="w-4 h-4" />,
      painPoint:
        "Creating responsive dashboards and implementing data tables with search , pagination and filters",
      benefit:
        "Ready-to-use dashboard with Working Data tables with extra functionalities like export to excel",
    },

    {
      title: "Configuring",
      highlight: "Forms & Uploads",
      duration: 6,
      icon: <Upload className="w-4 h-4" />,
      painPoint:
        "Setting up form validation, file uploads, and progress tracking",
      benefit:
        "Pre-built form components with validation and optimized file uploads",
    },
  ];

  const totalHours = steps.reduce((acc, step) => acc + step.duration, 0);

  return (
    <section className="w-full bg-teal-50/20">
      {/* Updated Header Section */}
      <div className="w-full max-w-6xl mx-auto py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-8">
          Why Waste Time Starting
          <br />
          from
          <span className="inline-block bg-gradient-to-r from-orange-100 via-purple-100 to-purple-200 px-4 rounded-lg">
            Scratch?
          </span>
        </h2>

        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          See how HubStack dramatically reduces development time with
          production-ready features that typically take days to implement.
          <br />
          Save up to {totalHours} hours of development time
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Without HubStack */}
          <div className="relative">
            <div className="sticky top-8 bg-white rounded-3xl border border-rose-100 overflow-hidden">
              <div className="p-6 border-b border-rose-100 bg-gradient-to-b from-rose-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                    <X className="w-5 h-5 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Without HubStack
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-rose-500">
                    {totalHours} Hours
                  </span>
                  <span className="text-slate-600">of development time</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-6">
                  {steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-900">
                            {step.title}{" "}
                            <span className="font-bold">{step.highlight}</span>
                          </h4>
                          <span className="text-rose-500 text-sm">
                            ~ {step.duration}hrs
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm">
                          {step.painPoint}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* With HubStack */}
          <div className="relative">
            <div className="sticky top-8 bg-white rounded-3xl border border-emerald-100 overflow-hidden">
              <div className="p-6 border-b border-emerald-100 bg-gradient-to-b from-emerald-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    With HubStack
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-emerald-500">
                    Instant Setup
                  </span>
                  <span className="text-slate-600">with ready features</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-6">
                  {steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-900">
                            {step.title}{" "}
                            <span className="font-bold">{step.highlight}</span>
                          </h4>
                          <ArrowRight className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500 text-sm">
                            Ready to use
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm">{step.benefit}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectComparison;
