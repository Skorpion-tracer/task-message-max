import styles from "./Spinner.module.scss";
import type {FC} from "react";
import Header from "../Header/Header.js";
import reactIcon from "../../assets/react.svg";

const Spinner:FC = () => {
    return (
        <div className={styles.spinner}>
            <Header>Загрузка</Header>
            <img className={styles.spinnerIcon} src={reactIcon} alt="Иконка загрузки"/>
        </div>
    );
};

export default Spinner;