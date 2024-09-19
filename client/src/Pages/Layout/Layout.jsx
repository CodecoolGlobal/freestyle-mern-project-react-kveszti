
import { Outlet } from "react-router-dom";
import Header from "../../Features/Header/Header";
import Footer from "../../Features/Footer/Footer";
import {useAuth} from "../../Authentication/AuthProvider.jsx";


export function Layout() {
    const { validUser, setValidUser } = useAuth()
    return (<>
        <Header validUser={validUser} setValidUser={setValidUser} />
        <Outlet />
        <Footer />
    </>
    );
}