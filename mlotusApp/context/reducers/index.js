import { combineReducers } from "redux";
import  userAuthReducer  from "./userAuthReducer";

const myReducer = combineReducers({
    config: userAuthReducer
})
export default myReducer