/**
 * Market Intelligence full-page tab
 * Extracted from Index.tsx for maintainability
 */

import React from "react";
import { MarketIntelligence } from "./MarketIntelligence";

export const MarketIntelligenceTab = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-white">Market Intelligence</h1>
      <p className="text-slate-200">
        Real-time salary data and market insights for UK roles
      </p>
    </div>
    <MarketIntelligence />
  </div>
);
