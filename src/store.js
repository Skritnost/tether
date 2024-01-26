import widgetReducer from "./features/widget/widgetSlice";
import { configureStore } from "@reduxjs/toolkit";
import { socketMiddleware } from "./middleware/socket";
import { Socket } from "./utils/Socket";

const store = configureStore({
    reducer: {
        widget: widgetReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketMiddleware(new Socket())),
})

export default store;