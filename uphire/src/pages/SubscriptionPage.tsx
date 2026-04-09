import { Link } from "react-router-dom";
import { Check, ArrowLeft } from "lucide-react";
import { contactConfig } from "@/config/contact";

type PricingTier = {
  months: number;
  price: number;
  perMonth?: boolean;
  discount?: string;
};

const plans = [
  {
    id: "starter",
    name: "Starter",
    stripeUrl: "https://buy.stripe.com/cNiaEZ7IN6PK4rr0p07Re02",
    label: null,
    description: "For teams replacing occasional agency use",
    keyPoints: "3 concurrent hires",
    keyPointsSub: "Hiring capacity for ongoing single and dual-role staffing",
    pricingType: "tiered" as const,
    tiers: [
      { months: 12, price: 1000, perMonth: true },
      { months: 18, price: 900, discount: "10% discount" },
      { months: 24, price: 800, discount: "20% discount" },
    ] as PricingTier[],
    featuresPrefix: "Includes:",
    features: [
      "AI candidate sourcing & screening",
      "NLP CV parsing",
      "Interview scheduling automation",
      "Bias detection",
      "Basic integrations",
      "3 team seats",
      "Email support",
    ],
    popular: false,
  },
  {
    id: "professional",
    name: "Professional",
    stripeUrl: "https://buy.stripe.com/00w00l1kp3Dy6zzb3E7Re01",
    label: "MOST POPULAR",
    labelColor: "text-pink-400",
    description: "Designed for teams replacing significant agency spend or scaling internal hiring without adding headcount",
    keyPoints: "5 concurrent hires",
    keyPointsSub: "Designed to support continuous hiring across multiple positions",
    pricingType: "tiered" as const,
    tiers: [
      { months: 12, price: 2500, perMonth: true },
      { months: 18, price: 2250, discount: "10% discount" },
      { months: 24, price: 2000, discount: "20% discount" },
    ] as PricingTier[],
    featuresPrefix: "Everything in Starter, plus:",
    features: [
      "Advanced workflow automation",
      "Advanced skill assessments",
      "Custom scoring & criteria",
      "ATS/calendar integrations",
      "Real-time analytics",
      "Up to 8 team seats",
      "Burst capacity for peak hiring",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    stripeUrl: "https://buy.stripe.com/dRm7sN2otgqk1ff5Jk7Re00",
    label: null,
    description: "For high-volume hiring with predictable outcomes and minimal manual overhead",
    keyPoints: "10+ concurrent hires",
    keyPointsSub: "Hiring infrastructure for scaled, predictable talent acquisition",
    pricingType: "tiered" as const,
    tiers: [
      { months: 12, price: 5000, perMonth: true },
      { months: 18, price: 4500, discount: "10% discount" },
      { months: 24, price: 4000, discount: "20% discount" },
    ] as PricingTier[],
    featuresPrefix: "Everything in Professional, plus:",
    features: [
      "Predictable infrastructure scaling",
      "Custom assessment scenarios",
      "HRIS/data warehouse integrations",
      "Unlimited team seats",
      "Burst capacity for volume spikes",
      "Dedicated success manager",
      "Quarterly business reviews",
      "24/7 support",
    ],
    popular: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    stripeUrl: null,
    label: null,
    description: "Custom hiring infrastructure for complex or regulated environments. Priced to replace agency frameworks and fragmented hiring systems.",
    keyPoints: "Custom scope",
    keyPointsSub: "Unlimited hiring capacity with dedicated infrastructure",
    pricingType: "custom" as const,
    customLabel: "Custom quote",
    customSub: "Based on hiring volume & requirements",
    featuresPrefix: "Includes:",
    features: [
      "Unlimited hiring capacity",
      "Custom infrastructure setup",
      "API & data warehouse access",
      "Advanced security & compliance",
      "Custom integrations",
      "Dedicated engineering support",
      "SLA-backed uptime guarantees",
    ],
    popular: false,
  },
];

const SubscriptionPage = () => (
  <div className="min-h-screen bg-[#0a0a0b]">
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pt-4 pb-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-xl p-6 min-w-[280px] transition-all duration-200 overflow-visible ${
              plan.popular
                ? "bg-zinc-900/90 border-2 border-pink-500/60 shadow-lg shadow-pink-500/10"
                : "bg-zinc-900/80 border border-zinc-700/50"
            }`}
          >
            {plan.label && (
              <div className="absolute -top-2.5 left-0 right-0 flex justify-center z-10">
                <span
                  className={`text-xs font-semibold px-3 py-0.5 rounded shadow-md ${
                    plan.labelColor === "text-emerald-400"
                      ? "bg-emerald-500 text-white"
                      : "bg-pink-500 text-white"
                  }`}
                >
                  {plan.label}
                </span>
              </div>
            )}

            <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
            <p className="text-sm text-slate-400 mb-3">{plan.description}</p>
            <div className="mb-4">
              <p className="text-sm text-slate-300">{plan.keyPoints}</p>
              {"keyPointsSub" in plan && plan.keyPointsSub && (
                <p className="text-xs text-slate-500 mt-1">{plan.keyPointsSub}</p>
              )}
            </div>

            {/* Pricing */}
            <div className="mb-6">
              {plan.pricingType === "tiered" && plan.tiers && (
                <div className="space-y-1.5">
                  <div>
                    <span className="text-base font-semibold text-cyan-400">
                      {plan.tiers[0].months}-month term £{plan.tiers[0].price.toLocaleString()}
                      {plan.tiers[0].perMonth && " /month"}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-pink-400">
                      {plan.tiers[1].months}-month term £{plan.tiers[1].price.toLocaleString()}
                    </span>
                    {plan.tiers[1].discount && (
                      <span className="text-xs text-slate-500 ml-1">
                        {plan.tiers[1].discount}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-purple-400">
                      {plan.tiers[2].months}-month term £{plan.tiers[2].price.toLocaleString()}
                    </span>
                    {plan.tiers[2].discount && (
                      <span className="text-xs text-slate-500 ml-1">
                        {plan.tiers[2].discount}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {plan.pricingType === "custom" && (
                <>
                  <span className="text-lg font-bold text-cyan-400">
                    {plan.customLabel}
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">{plan.customSub}</p>
                </>
              )}
            </div>

            {/* Features */}
            {plan.featuresPrefix && (
              <p className="text-xs text-slate-400 mb-2">{plan.featuresPrefix}</p>
            )}
            <ul className="space-y-2 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="mt-auto">
              <a
                href={plan.stripeUrl ?? contactConfig.pricingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 px-4 rounded-lg text-center text-sm font-semibold text-white bg-blue-900/80 border border-blue-600/50 hover:bg-blue-900 transition-colors"
              >
                {plan.id === "enterprise" ? "Contact Sales" : "Subscribe"}
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-slate-500 text-sm mt-8">
        Billing managed via your main site.{" "}
        <a
          href={contactConfig.pricingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          View full pricing
        </a>
      </p>
    </div>
  </div>
);

export default SubscriptionPage;
