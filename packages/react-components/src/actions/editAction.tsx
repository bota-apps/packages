import { Pencil } from "lucide-react";
import { RouteLink, type RoutePath } from "../routeLink";

type EditActionProps = {
  to: RoutePath;
  label: string;
  params?: Record<string, string>;
};

/** Text link to an entity's edit route. */
export function EditAction({ to, label, params }: EditActionProps) {
  return <RouteLink variant="text" to={to} params={params} icon={Pencil} label={label} />;
}
