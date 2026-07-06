import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Inline, Text } from "@bota-apps/react-ui";
import { LanguageToggle, type LanguageOption } from "./index";

type AppLanguage = "en" | "am";

const languages: readonly LanguageOption<AppLanguage>[] = [
  { value: "en", label: "English" },
  { value: "am", label: "አማርኛ" },
];

function StatefulLanguageToggle() {
  const [language, setLanguage] = useState<AppLanguage>("en");
  return (
    <Inline gap="sm" align="center">
      <LanguageToggle languages={languages} value={language} onChange={setLanguage} />
      <Text size="sm" tone="muted">
        current: {language}
      </Text>
    </Inline>
  );
}

const meta: Meta<typeof LanguageToggle> = {
  title: "react-components/LanguageToggle",
  component: LanguageToggle,
};

export default meta;
type Story = StoryObj<typeof LanguageToggle>;

export const Default: Story = {
  render: () => <StatefulLanguageToggle />,
};
