import styles from "./InputNumber.module.scss";
import {type FC} from "react";
import {type SubmitHandler, useForm} from "react-hook-form";
import {type InputNumberProps} from "./InputNumber.props.js";
import Header from "../Header/Header.js";
import {Input} from "../Input/Input.js";
import Button from "../Button/Button.js";

type FormValues = {
    phoneNumber: string;
};

const InputNumber: FC<InputNumberProps> = ({ onSubmit }) => {

    const {
        register, handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>();

    const onHandleSubmit: SubmitHandler<FormValues> = async (data) => {
        const number = Number(data.phoneNumber);
        console.log(number);
        if (Number.isNaN(number)) {
            setError('phoneNumber', {
                type: 'phone',
                message: "Телефон должен состоять только из цифр"
            });
            return;
        }
        try {
            await onSubmit(number);
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Неизвестная ошибка';
            setError('phoneNumber', { type: 'server', message: message });
        }
    };

    return (
        <div className={styles.inputNumber}>
            <Header>Введите номер телефона получателя</Header>
            <form onSubmit={handleSubmit(onHandleSubmit)} className={styles.inputForm}>
                <Input {...register('phoneNumber', {
                    pattern: {
                        value: /^(7|375)\d{0,10}$/,
                        message: 'Номер телефона получателя в международном формате: 11 или 12 цифр: Допускается использовать только номера телефонов для РФ и РБ с кодами "7" и "375" соответственно.',
                    }
                })} placeholder="123 456 78 90"/>
                {errors.phoneNumber && <span style={{ color: 'red' }}>{errors.phoneNumber?.message}</span>}
                <Button disabled={isSubmitting}>
                    {isSubmitting ? 'Отправка...' : 'Найти чат'}
                </Button>
            </form>
        </div>
    );
};

export default InputNumber;