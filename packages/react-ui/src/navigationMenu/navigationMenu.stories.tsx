import type { Meta, StoryObj } from "@storybook/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./index";

const meta: Meta<typeof NavigationMenu> = {
  title: "Navigation/NavigationMenu",
  component: NavigationMenu,
};
export default meta;

type Story = StoryObj<typeof NavigationMenu>;

const products = [
  { title: "Projects", description: "Create and organize projects in seconds." },
  { title: "Payments", description: "Accept payments from anywhere." },
  { title: "Reports", description: "Understand your business at a glance." },
];

export const Default: Story = {
  render: () => (
    <div className="h-72">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-96 gap-2 p-4">
                {products.map((product) => (
                  <li key={product.title}>
                    <NavigationMenuLink
                      href="#"
                      className="block rounded-md p-3 hover:bg-muted hover:text-foreground"
                    >
                      <div className="text-sm font-medium">{product.title}</div>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
              Pricing
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
};
