import { Switch, Route } from "react-router-dom";
import Login from '../components/Login/Login';
import Register from '../components/Login/Register';
import Users from '../components/ManageUsers/Users';
import PrivateRoutes from "./PrivateRoutes";
import Role from "../components/Role/Role";
import GroupRole from "../components/Role/GroupRole";

const AppRoutes = (props) => {
    const Houses = () => {
        return (
            <span>Houses</span>
        );
    }
    
    return (
        <>
        <Switch>
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
            <Route path="/" exact>
              Home
            </Route>
            <Route path="*">
              404 Not Found
            </Route>
          </Switch>
        </>
    );
}

export default AppRoutes;