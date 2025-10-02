import ResourceControl from "./ResourceControl";
import { BerryDef } from "../app/models/ResourceDef";

export default function BerryControl() {
  return <ResourceControl resourceDef={BerryDef} />;
}
