import { StopPoint } from "../Models/GLPoint";
import { LineMode } from "../Models/Imported";
import { LineModeWeighting } from "./Line_etc";

function MostWeightedMode(stopPoint: StopPoint): LineMode {
    var modes = stopPoint.lineModeGroups ?? [];

    modes.sort((a, b) => {
        return LineModeWeighting(a.modeName ?? LineMode.Unk) > LineModeWeighting(b.modeName ?? LineMode.Unk) ? -1 : 1
    });
    return modes[0]?.modeName ?? LineMode.Unk;
}

export { MostWeightedMode }