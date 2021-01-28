import React, { useState, useEffect } from "react";
import { IonCol, IonContent, IonFooter, IonGrid, IonIcon, IonPage, IonRow, IonToast} from "@ionic/react";
import { powerOutline } from "ionicons/icons";
import "./Home.scss";
import axios from "axios";
import useDatabase from "../hooks/useRealtimeDatabase";
import { MathermInputPayload, MathermState } from "../models/matherm-state.model";
import { AppConfig } from "../app.constants";

const Home: React.FC = () => {
    const { mathermState } = useDatabase();
    const [ isResistanceActive, setIsResistanceActive ] = useState<boolean>();
    const [ mathermToastMsg, setMathermToastMsg ] = useState("");

    useEffect(() => {
        setIsResistanceActive(mathermState?.resistanceState);
        if (mathermState && mathermState.mateState === "Optimal") {
            setMathermToastMsg("Your mate is at optimal temperature and ready to drink")
        }
    }, [mathermState])

    const saveMathermStateThingsbrd = async (currentMatherState?: MathermState) => {
        if (currentMatherState) {
            const isResistanceActive = !currentMatherState.resistanceState;
            const temperature = +currentMatherState.screenMsg.substr(0, currentMatherState.screenMsg.indexOf(" "));
            const mathermInputPayload: MathermInputPayload = {
                temperature,
                buttonState: isResistanceActive
            };
            const mathermStateRequest = await axios.post<MathermInputPayload, any>(
                AppConfig.THINGSBOARD_BUTTON_DEVICE_ENDPOINT,
                mathermInputPayload);
            if (mathermStateRequest.status === 200) {
                setIsResistanceActive(mathermInputPayload.buttonState);
                setMathermToastMsg(mathermInputPayload.buttonState ? "MaTherm resistance turned on" : "MaTherm resistance turned off");
            }
        }
    };

    const composeScreenMsg = (screenMsg?: string) => {
        if (screenMsg) {
            const temperature = +screenMsg.substr(0, screenMsg.indexOf(" "));
            return `${temperature.toFixed(1)} ºC`;
        }
    };

    return (
        <IonPage>
            {mathermState ?
            <React.Fragment>
                <IonToast isOpen={!!mathermToastMsg} message={mathermToastMsg} duration={2000} position="top"
                    onDidDismiss={() => setMathermToastMsg("")} color="dark"/>
                <IonContent fullscreen>
                    <IonGrid>
                        <IonRow>
                            <IonCol className="ion-text-center matherm-screen-message">
                                <h1>{ composeScreenMsg(mathermState?.screenMsg) }</h1>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="ion-text-center ion-no-padding matherm-state-info">
                                <h1 className={mathermState?.ledColor}>{ mathermState?.mateState }</h1>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="button-container ion-no-padding">
                                <div className={ isResistanceActive ? "switch-button heating-on" : "switch-button" } onClick={() => saveMathermStateThingsbrd(mathermState)}>
                                    <IonIcon className={ isResistanceActive ? "heating-on" : ""}
                                        slot="icon-only" icon={powerOutline} />
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
                <IonFooter className="ion-no-border">
                    <IonRow>
                        <IonCol className="ion-text-center">
                            <h4 className="resistance-state">{ isResistanceActive ? "MaTherm is heating your drink" : "MaTherm heating is not active"}</h4>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol className="ion-text-center image-state">
                            <img className="image-state" src={`/assets/images/${mathermState?.mateState}.svg`} alt="status"/>
                        </IonCol>
                    </IonRow>
                </IonFooter>
            </React.Fragment>
            :
            <React.Fragment>
                <IonContent>
                    <IonGrid>
                        <IonRow className="no-matherm-state-img-container">
                            <IonCol className="ion-text-center">
                                <img className="no-matherm-state-img" src="/assets/images/Void.svg" alt="NoData"/>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="ion-text-center">
                                <h1 className="no-matherm-state-legend">There is no data from your MaThermSensor</h1>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </React.Fragment>
            }
        </IonPage>
    );
};

export default Home;
