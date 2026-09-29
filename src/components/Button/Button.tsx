import styles from "./Button.module.scss";
import cn from "classnames";
import {type ButtonProps} from "./Button.props.js";
import {type FC} from "react";

const Button:FC<ButtonProps> = ({children, className, ...props}) => {
  return (
      <button className={cn(styles.button, className)} {...props}>{children}</button>
  );
};

export default Button;