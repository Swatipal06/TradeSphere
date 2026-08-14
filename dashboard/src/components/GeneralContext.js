import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
    openBuyWindow: (uid, price) => { },
    openSellWindow: (uid, price) => { },
    closeBuyWindow: () => { },
    triggerOrderRefresh: () => { },
    refreshCounter: 0,
});

export const GeneralContextProvider = (props) => {
    const [isWindowOpen, setIsWindowOpen] = useState(false);
    const [selectedStockUID, setSelectedStockUID] = useState("");
    const [selectedStockPrice, setSelectedStockPrice] = useState(0);
    const [orderMode, setOrderMode] = useState("BUY");
    const [refreshCounter, setRefreshCounter] = useState(0);

    const handleOpenBuyWindow = (uid, price = 0) => {
        setIsWindowOpen(true);
        setSelectedStockUID(uid);
        setSelectedStockPrice(price);
        setOrderMode("BUY");
    };

    const handleOpenSellWindow = (uid, price = 0) => {
        setIsWindowOpen(true);
        setSelectedStockUID(uid);
        setSelectedStockPrice(price);
        setOrderMode("SELL");
    };

    const handleCloseWindow = () => {
        setIsWindowOpen(false);
        setSelectedStockUID("");
    };

    const triggerOrderRefresh = () => {
        setRefreshCounter((prev) => prev + 1);
    };

    return (
        <GeneralContext.Provider
            value={{
                openBuyWindow: handleOpenBuyWindow,
                openSellWindow: handleOpenSellWindow,
                closeBuyWindow: handleCloseWindow,
                triggerOrderRefresh,
                refreshCounter,
            }}
        >
            {props.children}
            {isWindowOpen && (
                <BuyActionWindow
                    uid={selectedStockUID}
                    price={selectedStockPrice}
                    initialMode={orderMode}
                />
            )}
        </GeneralContext.Provider>
    );
};

export default GeneralContext;