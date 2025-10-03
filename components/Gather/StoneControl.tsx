import ResourceControl from '../ResourceControl';
import { StoneDef } from '../../app/models/ResourceDef';

export default function StoneControl() {
    return <ResourceControl resourceDef={StoneDef} />;
}
