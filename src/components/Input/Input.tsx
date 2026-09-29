import styles from "./Input.module.scss";
import {type InputHTMLAttributes, forwardRef} from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    return <input className={styles.input} ref={ref} {...props}/>
});
Input.displayName = "Input";