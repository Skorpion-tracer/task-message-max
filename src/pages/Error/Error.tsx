import styles from "./Error.module.scss";
import {type FC} from "react";
import {useNavigate} from "react-router";
import errorIcon from '../../assets/error.svg';
import Header from "../../components/Header/Header.js";
import Button from "../../components/Button/Button.js";

const Error: FC = () => {
    const navigate = useNavigate();

    const onHome = () => {
        navigate('/');
    };

    return (
        <div className={styles.error}>
            <Header>Ошибка</Header>
            <img className={styles.image} src={errorIcon} alt="error"/>
            <Button onClick={onHome} className={styles.button}>На главную</Button>
        </div>
    );
};

export default Error;