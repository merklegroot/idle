import ResourceControl from "../ResourceControl";
import { WoodDef } from "../../app/models/ResourceDef";

export default function WoodControl() {
  return <ResourceControl resourceDef={WoodDef} />;
}
