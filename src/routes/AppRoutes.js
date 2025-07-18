import { Switch, Route } from "react-router-dom";
import Login from '../components/Login/Login';
import Register from '../components/Login/Register';
import Users from '../components/ManageUsers/Users';
import PrivateRoutes from "./PrivateRoutes";
import Role from "../components/Role/Role";
import GroupRole from "../components/Role/GroupRole";
import About from "../components/About/About";
import Home from "../components/Home/Home";
import Houses from "../components/ManageHouses/Houses";
import Dashboards from "../components/Dashboard/Dashboards";

const AppRoutes = (props) => {
    return (
        <>
        <Switch>
            <PrivateRoutes path="/dashboards" component={Dashboards} />
            <PrivateRoutes path="/users" component={Users} />
            <PrivateRoutes path="/houses" component={Houses} />
            <PrivateRoutes path="/roles" component={Role} />
            <PrivateRoutes path="/group-role" component={GroupRole} />
            
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="*">
              <div className="container">404 Not Found</div>
            </Route>
          </Switch>
        </>
    );
}

export default AppRoutes;