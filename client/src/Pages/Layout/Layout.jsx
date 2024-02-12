
import { Outlet } from "react-router-dom";
import { useContext } from "react";

import Header from "../../Features/Header/Header";
import Footer from "../../Features/Footer/Footer";
import { ValidUserContext } from "../../App";


export function Layout() {
    const { validUser } = useContext(ValidUserContext)
    return (<>
        <Header validUser={validUser} />
        <Outlet />
        <Footer />
    </>
    );
}