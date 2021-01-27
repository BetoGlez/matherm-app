import React from "react";
import { IonCol, IonContent, IonFooter, IonGrid, IonIcon, IonPage, IonRow} from "@ionic/react";
import { powerOutline } from "ionicons/icons";
import "./Home.scss";
import useDatabase from "../hooks/useRealtimeDatabase";

const Home: React.FC = () => {
    const { mathermState } = useDatabase();

    return (
        <IonPage>
            {mathermState &&
            <React.Fragment>
                <IonContent fullscreen>
                    <IonGrid>
                        <IonRow>
                            <IonCol className="ion-text-center matherm-screen-message">
                                <h1>{ mathermState?.screenMsg }</h1>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="ion-text-center ion-no-padding matherm-state-info">
                                <h1 className={mathermState?.ledColor}>{ mathermState?.mateState }</h1>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="button-container ion-no-padding">
                                <div className="switch-button">
                                    <IonIcon className={ mathermState?.resistanceState ? "heating-on" : ""}
                                        slot="icon-only" icon={powerOutline} />
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
                <IonFooter>
                    <IonRow>
                        <IonCol className="ion-text-center">
                            <h4 className="resistance-state">{ mathermState?.resistanceState ? "MaTherm is heating your drink" : "MaTherm heating is not active"}</h4>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol className="ion-text-center image-state">
                            <img className="image-state" src={`/assets/images/${mathermState?.mateState}.svg`} alt="status"/>
                        </IonCol>
                    </IonRow>
                </IonFooter>
            </React.Fragment>
            }
        </IonPage>
    );
};

export default Home;
