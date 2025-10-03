import WoodControl from './WoodControl';
import BerryControl from './BerryControl';
import StoneControl from './StoneControl';
import HatchetControl from './HatchetControl';
import PickaxeControl from './PickaxeControl';

export function GatherControl() {
    return (
        <>
            <WoodControl />
            <BerryControl />
            <StoneControl />
            <HatchetControl />
            <PickaxeControl />
        </>)
}