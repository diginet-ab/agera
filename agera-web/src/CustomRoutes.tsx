import React from "react";
import { Route } from "react-router-dom";
import SendSms from "./PlcControl";
import Setup from "./configuration/Configuration";

export default [
    <Route exact path="/control" component={SendSms} /* noLayout */ />,
    <Route exact path="/setup" component={Setup} /* noLayout */ />,
];