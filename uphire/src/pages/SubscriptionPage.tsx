import { Link } from "react-router-dom";
import { Check, ArrowLeft, Zap, Building2 } from "lucide-react";
import { contactConfig } from "@/config/contact";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    period: "month",
    description: "For small teams getting started with AI recruitment",
    features: [
      "Up to 5 active roles",
      "AI candidate matching",
      "Basic analytics",
      "Email support",
    ],
    cta: "Get started",
    popular: false,
    icon: Zap,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    period: "month",
    description: "For scaling teams with advanced needs",
    features: [
      "Unlimited roles",
      "AI + VR screening",
      "Advanced analytics",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Contact sales",
    popular: true,
    icon: Building2,
  },
];

const SubscriptionPage = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to platform
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Choose your plan
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Scale your hiring with AI-powered recruitment. Manage your subscription
          or upgrade anytime.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 transition-all duration-200 ${
                plan.popular
                  ? "bg-white shadow-2xl shadow-purple-500/20 ring-2 ring-purple-500/50"
                  : "bg-white/95 backdrop-blur-sm border border-white/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-semibold px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white">
                    Most popular
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20">
                  <Icon className="w-6 h-6 text-violet-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  £{plan.price}
                </span>
                <span className="text-gray-500">/{plan.period}</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-700">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={contactConfig.pricingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-3 px-6 rounded-lg text-center font-semibold transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:from-violet-600 hover:to-pink-600 shadow-lg hover:shadow-xl"
                    : "bg-gray-900 text-white hover:bg-gray-800 hover:ring-2 hover:ring-violet-500/50"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          );
        })}
      </div>

      <p className="text-center text-slate-500 text-sm mt-8">
        Billing managed via your main site.{" "}
        <a
          href={contactConfig.pricingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 hover:text-violet-300 transition-colors"
        >
          View full pricing
        </a>
      </p>
    </div>
  </div>
);

export default SubscriptionPage;
