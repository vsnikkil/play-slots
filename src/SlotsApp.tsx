import * as React from "react";
import * as chessPieces from "./chessPieces/chessPieces";
import { Animation } from "./animation";

enum Slot {
    King,
    Queen,
    Rook,
    Bishop,
    Knight,
    Pawn,
}

const slotTypeMap = Object.freeze({
    [Slot.King]: chessPieces.king,
    [Slot.Queen]: chessPieces.queen,
    [Slot.Rook]: chessPieces.rook,
    [Slot.Bishop]: chessPieces.bishop,
    [Slot.Knight]: chessPieces.knight,
    [Slot.Pawn]: chessPieces.pawn,
});
const typeToSlotIcon = (slotType: Slot) => slotTypeMap[slotType] ?? "-";

type SlotState = Slot[];

const NUM_OF_SLOTS = 3;
const initialSlotState: SlotState = Array.from(
    { length: NUM_OF_SLOTS },
    () => Slot.King
);

export const SlotsApp = () => {
    const [slotState, setSlotState] =
        React.useState<SlotState>(initialSlotState);
    return (
        <section className="slots-app">
            <h1 className="slots-app__header">Play Slots!</h1>
            <SlotMachine onChange={setSlotState} slotState={slotState} />
            <Score slotState={slotState} />
        </section>
    );
};

export const SlotMachine = ({
    onChange,
    slotState,
}: {
    onChange?: (newState: SlotState) => void;
    slotState: SlotState;
}) => {
    const [machineState, setMachineState] = React.useState<"idle" | "rolling">(
        "idle"
    );

    const [rollingSlotState, setRollingSlotState] =
        React.useState<SlotState>(slotState);

    const startRoll = React.useCallback(async () => {
        if (machineState === "idle") {
            setMachineState("rolling");
            const animation = new Animation();
            let clamp = 0;
            let newRollingState: SlotState;
            animation.setFunc((x: number) => {
                if (x - clamp > 1 / 40) {
                    clamp = x;
                    newRollingState = Array.from({ length: NUM_OF_SLOTS }, () =>
                        Math.floor(Math.random() * (Slot.Pawn + 1))
                    );
                    setRollingSlotState(newRollingState);
                }
            });

            animation.setTime(4000);
            animation.setEasingFunc(Animation.quadraticEaseOutFunc);

            await animation.start();
            if (onChange) {
                onChange(newRollingState);
            }
            setMachineState("idle");
        }
    }, [setMachineState, machineState, onChange]);

    return (
        <div className="slot-machine">
            <div className="slot-machine__slots">
                {(machineState === "rolling"
                    ? rollingSlotState
                    : slotState
                ).map((slotEntry, idx) => (
                    <div key={idx} className="slot-machine__slot">
                        {typeToSlotIcon(slotEntry)}
                    </div>
                ))}
            </div>
            <button
                disabled={machineState === "rolling"}
                onClick={startRoll}
                className="slot-machine__roll"
            >
                {machineState === "idle" ? "Roll!" : "Rolling..."}
            </button>
        </div>
    );
};

export const Score = ({ slotState }: { slotState: SlotState }) => {
    const same = NUM_OF_SLOTS - new Set(slotState).size + 1;

    if (same > 1) {
        return <h2 className="score">Got {same} the same!</h2>;
    } else {
        return <h2 className="score">Got nothing...</h2>;
    }
};
