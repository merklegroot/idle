import ResourceControl from '../ResourceControl';
import { PickaxeDef } from '../../app/models/ResourceDef';

export default function PickaxeControl() {
  return <ResourceControl resourceDef={PickaxeDef} />;
}
