import { useState, useEffect } from "react";
import { realtimeDatabase } from "../firebase/config";
import { MathermState } from "../models/matherm-state.model";

const useDatabase = () => {

    const [mathermState, setMathermState] = useState<MathermState>();

    useEffect(() => {
        const databaseRef = realtimeDatabase.ref().limitToLast(1);
        databaseRef.on("value", (snapshot) => {
            if (snapshot.val()) {
                snapshot.forEach(snap => {
                    console.log(snap.val());
                    setMathermState(snap.val() as MathermState);
                });
            }
        });
    }, []);

    return { mathermState };
};

export default useDatabase;