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
import Rooms from "../components/ManageRooms/Rooms";
import ManageStudents from "../components/Management/ManageStudents";
import ManageServices from "../components/Management/ManageServices";
import Payment from "../components/Payment/Payment";
import Invoices from "../components/Invoice/Invoices";
import UserAccount from "../components/UserAccount/UserAccount";
import ManageRevenue from "../components/Management/ManageRevenue";
import HouseDetail from "../components/Home/HouseDetail";
import Booking from "../components/Home/Booking";

const AppRoutes = (props) => {
    return (
        <>
        <Switch>
            <PrivateRoutes path="/dashboards" component={Dashboards} />
            <PrivateRoutes path="/users" component={Users} />
            <PrivateRoutes path="/houses" component={Houses} />
            <PrivateRoutes path="/rooms" component={Rooms} />
            <PrivateRoutes path="/roles" component={Role} />
            <PrivateRoutes path="/group-role" component={GroupRole} />
            <PrivateRoutes path="/manage/student" component={ManageStudents} />
            <PrivateRoutes path="/manage/service" component={ManageServices} />
            <PrivateRoutes path="/payment" component={Payment} />
            <PrivateRoutes path="/invoices" component={Invoices} />
            <PrivateRoutes path="/my-account" component={UserAccount} />
            <PrivateRoutes path="/manage/revenue" component={ManageRevenue} />
            <PrivateRoutes path="/house/booking/:roomId" component={Booking} />
            
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/house/house-detail/:id">
              <HouseDetail />
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