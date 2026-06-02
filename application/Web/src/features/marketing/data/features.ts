import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  ClipboardList,
  HardHat,
  LineChart,
  Receipt,
  Truck,
} from "lucide-react";

export type MarketingFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const marketingFeatures: MarketingFeature[] = [
  {
    icon: ClipboardList,
    title: "Project Management",
    description:
      "Schedule milestones, track progress, and route approvals across every active site — without juggling spreadsheets.",
  },
  {
    icon: HardHat,
    title: "Resource & Equipment",
    description:
      "Allocate machinery, materials, and crews with real-time availability. Spot idle capacity before it eats your margin.",
  },
  {
    icon: Receipt,
    title: "Finance & Billing",
    description:
      "Track BOQs, certify completed work, raise invoices, and manage subcontractor payments — all in one ledger.",
  },
  {
    icon: Truck,
    title: "Procurement",
    description:
      "Centralize purchase orders, vendor catalogs, and material reconciliation so site requests reach finance without friction.",
  },
  {
    icon: BarChart3,
    title: "Site Reporting",
    description:
      "Daily progress reports, manpower logs, and incident records captured from the field — synced to your project of record.",
  },
  {
    icon: LineChart,
    title: "Analytics & Insights",
    description:
      "Live dashboards across project health, cash flow, and resource utilization. Decide on data, not on phone calls.",
  },
];
