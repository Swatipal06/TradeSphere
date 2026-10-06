import React from "react";
import { Route, Routes } from "react-router-dom";

import Apps from "./Apps";
import Funds from "./Funds";
import Holdings from "./Holdings";
import Orders from "./Orders";
import Positions from "./Positions";
import Summary from "./Summary";
import WatchList from "./WatchList";
import AiNews from "./AiNews";
import TradeCoach from "./TradeCoach";
import { GeneralContextProvider } from "./GeneralContext";

const Dashboard = () => {
    return (
        <GeneralContextProvider>
            <div className="dashboard-container">
                <WatchList />
                <div className="content">
                    <Routes>
                        <Route exact path="/" element={<Summary />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/holdings" element={<Holdings />} />
                        <Route path="/positions" element={<Positions />} />
                        <Route path="/funds" element={<Funds />} />
                        <Route path="/apps" element={<Apps />} />
                        <Route path="/news" element={<AiNews />} />
                        <Route path="/coach" element={<TradeCoach />} />
                    </Routes>
                </div>
            </div>
        </GeneralContextProvider>
    );
};

export default Dashboard;