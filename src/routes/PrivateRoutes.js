import { useEffect } from "react";
import { Route, useHistory } from "react-router-dom";

const PrivateRoutes = (props) => {
    let history = useHistory();
    
    useEffect (() => {
        let session = sessionStorage.getItem('account');
        if (!session) {
            history.push("/login");
            window.location.reload();
        }
        if (session) {
            // Check role
        }
    }, []);
    
    return (
        <>
            <Route path={props.path} component={props.component} />
        </>
    );
}

export default PrivateRoutes;