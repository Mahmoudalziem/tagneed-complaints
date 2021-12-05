import React from "react";
import { Route, Switch,withRouter } from "react-router-dom";
import Adminstration from "../components/adminstration";
import Register from "../components/Register/Register";
import RegisteredPeople from "../components/RegisteredPeople/RegisteredPeople";
import AfterAdminstration from "../components/after_adminstration";
import Reports from "../components/Statistics";
import Inquire from "../components/inquire";

const AppRouter = () => {
  return (
    <Switch>
       <Route exact path="/" component={Register} />
       <Route exact path="/RegisteredPeople" component={RegisteredPeople} />
      <Route exact path="/adminstration" component={Adminstration} />
      <Route exact path="/after_adminstration" component={AfterAdminstration} /> 
      <Route exact path="/reports" component={Reports} /> 
      <Route exact path="/inquire" component={Inquire} /> 
    </Switch>
  );
};

export default withRouter(AppRouter);
