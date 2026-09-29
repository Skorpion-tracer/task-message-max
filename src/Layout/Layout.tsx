import styles from "./Layout.module.scss";
import type {FC} from "react";
import {Outlet} from "react-router";

const Layout: FC = () => {
    return (
        <div className={styles.layout}>
            <Outlet/>
        </div>
    );
};

export default Layout;