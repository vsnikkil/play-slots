export class Animation {
    x: number;
    func: (x: number) => void;
    easingFunc: (x: number) => number;
    time: number;
    af: number | null;
    prevTick: number | null;
    resolveOnFinish: () => void;

    static quadraticEaseInFunc = (x: number) => x * x;
    static quadraticEaseOutFunc = (x: number) => 1 - (1 - x) * (1 - x);

    static defaultTimingFunc = (x: number) => x;

    constructor(
        func?: Animation["func"],
        time = 1000,
        easingFunc?: (x: number) => number
    ) {
        this.x = 0;
        this.func = func;
        this.easingFunc = easingFunc ?? Animation.defaultTimingFunc;
        this.time = time;
        this.af = null;
        this.prevTick = null;
        this.resolveOnFinish = null;
    }

    reset = () => {
        this.x = 0;
    };

    setFunc = (func: Animation["func"]): void => {
        this.func = func;
    };

    setTime = (time: number) => {
        this.time = time;
    };

    setEasingFunc = (easingFunc: Animation["easingFunc"]): void => {
        this.easingFunc = easingFunc;
    };

    start = (): Promise<unknown> => {
        this.prevTick = performance.now();
        this.af = window.requestAnimationFrame(this.continueAnimation);
        const p = new Promise<void>((resolve) => {
            this.resolveOnFinish = resolve;
        });

        return p;
    };

    continueAnimation = (): void => {
        if (this.x === 1) {
            this.resolveOnFinish();
            return;
        } else {
            const currentTick = performance.now();
            this.func(this.easingFunc(this.x));
            this.x = this.x + (currentTick - this.prevTick) / this.time;
            this.prevTick = currentTick;

            if (this.x > 1) {
                this.x = 1;
            }

            this.af = window.requestAnimationFrame(this.continueAnimation);
        }
    };

    stop = (): void => {
        if (this.af !== null) {
            window.cancelAnimationFrame(this.af);
            this.af = null;
        }
    };
}
