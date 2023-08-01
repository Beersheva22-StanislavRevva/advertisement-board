import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { codeReducer } from "./slices/codeSlice";
import CodeType from "../model/CodeType";
import CodePayload from "../model/CodePayload";

export const store = configureStore({
    reducer: {
     codeState: codeReducer
    }
});

export function useSelectorCode() {
    return useSelector<any, CodePayload>(state => state.codeState.codeMessage);
}

