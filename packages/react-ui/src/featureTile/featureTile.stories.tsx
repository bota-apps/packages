import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart3, Check, FileText, Layers, Rocket, Shield, Users, Wallet } from "lucide-react";
import { Card } from "../card";
import { Inline } from "../layout";
import { QuickLink } from "../quickLink";
import { StatCard } from "../statCard";
import { Text } from "../typography";
import { FeatureTile } from "./index";

const meta: Meta<typeof FeatureTile> = {
  title: "Display/FeatureTile",
  component: FeatureTile,
};
export default meta;

type Story = StoryObj<typeof FeatureTile>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[64rem] grid-cols-4 gap-4">
      <FeatureTile
        icon={Users}
        title="Team directory"
        description="Keep every member's profile and role in one place."
      />
      <FeatureTile
        icon={BarChart3}
        title="Reporting"
        description="Dashboards and exports for every dataset you track."
      />
      <FeatureTile
        icon={Layers}
        title="Integrations"
        description="Connect the tools your team already relies on."
      />
      <FeatureTile
        icon={Shield}
        title="Access control"
        description="Role-based permissions from a single dashboard."
      />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="grid w-[48rem] grid-cols-3 gap-4">
      <FeatureTile icon={Rocket} title="Primary" description="Default brand tint." />
      <FeatureTile
        icon={Check}
        title="Success"
        tone="success"
        description="Positive completion tint."
      />
      <FeatureTile icon={FileText} title="Muted" tone="muted" description="Neutral tint." />
    </div>
  ),
};

export const WithBodyAndFooter: Story = {
  render: () => (
    <div className="grid w-[42rem] grid-cols-2 gap-4">
      <FeatureTile
        icon={Wallet}
        title="Statements"
        description="Everything about a statement in one record."
        footer={
          <Text size="sm" tone="muted">
            Included in every plan
          </Text>
        }
      >
        <ul className="space-y-2">
          {["Line items and totals", "A full audit trail", "Export to PDF"].map((item) => (
            <li key={item}>
              <Inline gap="sm" align="center">
                <Check size={16} className="shrink-0 text-primary" />
                <Text size="sm" tone="muted">
                  {item}
                </Text>
              </Inline>
            </li>
          ))}
        </ul>
      </FeatureTile>
      <FeatureTile
        icon={Users}
        title="Member portal"
        description="Give every member a portal of their own."
      >
        <ul className="space-y-2">
          {["Submit requests online", "Review and approve", "Follow status updates"].map((item) => (
            <li key={item}>
              <Inline gap="sm" align="center">
                <Check size={16} className="shrink-0 text-primary" />
                <Text size="sm" tone="muted">
                  {item}
                </Text>
              </Inline>
            </li>
          ))}
        </ul>
      </FeatureTile>
    </div>
  ),
};

export const NarrowCollapse: Story = {
  name: "Narrow container collapse",
  render: () => (
    <div className="flex items-start gap-4">
      <div className="w-80">
        <FeatureTile
          icon={Rocket}
          title="Wide column"
          description="From 16rem of container width the icon tile stacks above the title."
        />
      </div>
      <div className="w-56">
        <FeatureTile
          icon={Rocket}
          title="Narrow column"
          description="Below 16rem the header collapses to an inline icon + title row."
        />
      </div>
    </div>
  ),
};

/**
 * The reference sheet for icon placement on card surfaces. Three sanctioned
 * placements — stacked (marketing), leading (content/navigation/stat), and
 * inline glyphs at text size. Trailing/corner icons are not sanctioned.
 */
export const IconPlacementReference: Story = {
  name: "Icon placement reference",
  render: () => (
    <div className="grid w-[64rem] gap-6">
      <div>
        <p className="mb-2 text-sm font-semibold">
          Stacked — marketing feature cards (FeatureTile)
        </p>
        <div className="grid grid-cols-3 gap-4">
          <FeatureTile
            icon={Users}
            title="Feature tile"
            description="Tinted 40px tile stacked above the title."
          />
          <FeatureTile
            icon={BarChart3}
            title="Feature tile"
            description="Same tile, same gap rhythm, every card."
          />
          <FeatureTile
            icon={Shield}
            title="Feature tile"
            description="Tone varies; geometry never does."
          />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Leading — content, navigation, and stat cards</p>
        <div className="grid grid-cols-3 items-start gap-4">
          <Card icon={FileText} title="Content card" description="Leading 40px tile." />
          <QuickLink icon={Layers} label="Navigation tile" description="Same tile on QuickLink." />
          <StatCard label="Stat card" value={128} icon={Wallet} />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Inline — bare glyphs at text size only</p>
        <Inline gap="sm" align="center">
          <Check size={16} className="text-primary" />
          <Text size="sm">Checklist rows keep bare glyphs at 16px, aligned to the text.</Text>
        </Inline>
      </div>
    </div>
  ),
};
