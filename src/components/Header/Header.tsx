import styles from "./Header.module.scss"
import {type FC} from "react";
import {type HeaderProps} from "./Header.props.js";
import cn from "classnames";

const Header:FC<HeaderProps> = ({children, className, ...props}) => {
    return (
        <h1 className={cn(className, styles.header)} {...props}>{children}</h1>
    );
};

export default Header;