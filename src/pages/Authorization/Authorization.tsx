import styles from './Authorization.module.scss';
import cn from 'classnames';
import {type FC, useEffect} from "react";
import {type SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {useNavigate} from "react-router";
import Header from "../../components/Header/Header.js";
import Button from "../../components/Button/Button.js";
import {Input} from "../../components/Input/Input.js";
import { API_URL } from '../../api/Config.js';

type FormData = {
    idInstance: number;
    apiTokenInstance: string;
}

const Authorization: FC = () => {

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/api/me`, { withCredentials: true })
            .then(r => {
                if (r.data.authorized) navigate('/chat');
            })
            .catch(() => {
            });
    }, [ navigate ]);

    const {
        register, handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        watch,
        clearErrors
    } = useForm<FormData>();

    const idInstance = watch('idInstance');
    const apiTokenInstance = watch('apiTokenInstance');

    const isValid =
        !!idInstance && !!apiTokenInstance?.trim();

    useEffect(() => {
        if (!apiTokenInstance || apiTokenInstance.length === 0) {
            clearErrors('root.server');
        }
    }, [ apiTokenInstance, clearErrors ]);

    const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
        try {
            const response = await axios.post(`${API_URL}/api/login`, { ...formData }, { withCredentials: true });
            if (response.data.ok) {
                navigate('/chat');
                console.log("Авторизация успешна");
            }
        } catch (e) {
            if (axios.isAxiosError(e) && e.response?.data?.error) {
                setError('root.server', {
                    type: 'server',
                    message: e.response.data.error
                });
            } else {
                setError('root.server', {
                    type: 'server',
                    message: 'Не удалось авторизоваться в Green API'
                });
            }
        }
    };

    return (
        <div className={styles.authorization}>
            <Header className={styles.header}>Авторизация</Header>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.authorizationForm}>
                <Input {...register('idInstance', {
                    pattern: {
                        value: /^\d+$/,
                        message: 'Только цифры',
                    }
                })} type="text" placeholder="idInstance"/>
                {!errors.idInstance &&
                    <span className={styles.hint}>Для получения параметров запроса idInstance и apiTokenInstance необходимо войти в систему&nbsp;
                        <a href="https://green-api.com/max">Green-api</a></span>}
                {errors.idInstance &&
                    <span className={cn(styles.hint, styles.hintError)}>{errors.idInstance?.message}</span>}
                <Input {...register('apiTokenInstance', {
                    pattern: {
                        value: /^\S+$/,
                        message: 'необходимо ввести токен'
                    }
                })} placeholder="apiTokenInstance" type="text"/>
                {errors.apiTokenInstance &&
                    <span className={cn(styles.hint, styles.hintError)}>{errors.apiTokenInstance?.message}</span>}
                {errors.root?.server && (
                    <span className={cn(styles.hint, styles.hintError)}>
                    {errors.root.server.message}
                </span>
                )}
                <Button type="submit" disabled={!isValid && !isSubmitting} className={styles.button}>
                    {isSubmitting ? 'Отправка...' : 'Войти'}
                </Button>
            </form>
        </div>
    );
};

export default Authorization;