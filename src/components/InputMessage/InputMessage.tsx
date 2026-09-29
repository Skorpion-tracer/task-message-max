import styles from "./InputMessage.module.scss";
import {type FC} from "react";
import {type SubmitHandler, useForm} from "react-hook-form";
import {type InputMessageProps} from "./InputMessage.props.js";
import cn from "classnames";
import arrowIcon from "../../assets/arrow.svg"

type MessageValue = {
    message: string
}

const InputMessage: FC<InputMessageProps> = ({ sendMessage, className }) => {

    const {
        register, handleSubmit,
        watch,
        reset
    } = useForm<MessageValue>();

    const message = watch('message');
    const isVisible = !!message;

    const send: SubmitHandler<MessageValue> = (data) => {
        sendMessage(data.message);
        reset();
    };

    return (
        <div className={cn(styles.messageInput, className)}>
            <form onSubmit={handleSubmit(send)}>
                <input className={styles.input} {...register('message')}
                       placeholder="Сообщение" autoComplete="off"/>
                <button className={styles.button} style={{display: isVisible ? "block" : "none"}}>
                    <img src={arrowIcon} alt="иконка стрелки"/>
                </button>
            </form>
        </div>
    );
};

export default InputMessage;