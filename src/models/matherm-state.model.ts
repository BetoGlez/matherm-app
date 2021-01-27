export interface MathermState {
    ledColor: "red" | "green" | "blue";
	mateState: "Burning" | "Optimal" | "Mild" | "Cold";
	resistanceState: boolean;
	screenMsg: string;
}

export interface MathermInputPayload {
    temperature: number;
    buttonState: boolean;
}