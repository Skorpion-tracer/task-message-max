import styles from "./Chat.module.scss";
import {type FC, useEffect, useRef, useState} from "react";
import InputNumber from "../../components/InputNumber/InputNumber.js";
import axios from "axios";
import InputMessage from "../../components/InputMessage/InputMessage.js";
import { API_URL } from "../../api/Config.js";

const MAX_COUNT_MESSAGES = 40;

type Chanel = "receive" | "response";

type Message = {
    id: number;
    message: string;
    chanel: Chanel;
    createdAt: number;
}

const Chat: FC = () => {
    const [ chatId, setChatId ] = useState<boolean>(false);
    const [ messages, setMessages ] = useState<Message[]>([]);

    const messagesPlaceRef = useRef<HTMLDivElement>(null);

    const timeFormatter = new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const getPhone = async (phone: number) => {
        console.log(phone);
        const response = await axios.post(`${API_URL}/api/check-account`, { phoneNumber: phone }, { withCredentials: true });
        if (response.data.ok) {
            setChatId(true);
        }
        return;
    };

    const addMessage = (message: string, chanel: Chanel) => {
        console.log("Добавляем сообщение!");
        setMessages((prev) => {
            const id = prev.length > 0 ? Math.max(...prev.map(i => i.id)) + 1 : 1;
            const next = [ ...prev, { id, message, chanel, createdAt: Date.now() } ];
            return next.length > MAX_COUNT_MESSAGES
                ? next.slice(next.length - MAX_COUNT_MESSAGES)
                : next;
        });
    };

    const onSendMessage = async (message: string) => {
        try {
            const response = await axios.post(`${API_URL}/api/send`, { message: message }, { withCredentials: true });
            if (response.data.ok) {
                addMessage(message, "response");
            }
        } catch (e) {
            const messageError = e instanceof Error ? e.message : 'Неизвестная ошибка';
            console.log(messageError);
        }
    };

    const setStyle = (msg: Message) => {
        if (msg.chanel === "receive") {
            return {
                background: "#FFFFFF",
                marginRight: "auto"
            };
        } else if (msg.chanel === "response") {

            return {
                background: "#E9FDFF",
                marginLeft: "auto",
            };
        }
        return undefined;
    };

    useEffect(() => {
        let cancelled = false;
        let timerId: ReturnType<typeof setTimeout>;

        console.log("Запуск таймера");

        const poll = async () => {
            console.log("Запуск метода таймера");
            if (cancelled) return;
            try {
                const response = await axios.get(`${API_URL}/api/receive`, { withCredentials: true });
                console.log(response.data.message);
                if (response.data.ok && response.data.message?.textMessage) {
                    addMessage(response.data.message.textMessage, "receive");
                }
            } catch (e) {
                console.error(e);
            }
            if (!cancelled) {
                timerId = setTimeout(poll, 2000);
            }
        };

        poll();
        return () => {
            cancelled = true;
            clearTimeout(timerId);
        };
    }, []);

    useEffect(() => {
        const el = messagesPlaceRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [ messages ]);

    return (
        <div className={styles.chatContainer}>
            {
                !chatId ?
                    <InputNumber onSubmit={getPhone}/>
                    :
                    <main className={styles.messagesContainer}>
                        <div className={styles.messagesPlace} ref={messagesPlaceRef}>
                            {messages.map((msg) => (
                                <div className={styles.messageItem} style={setStyle(msg)} key={msg.id}>
                                    <span className={styles.message}>{msg.message}</span>
                                    <span className={styles.date}>{timeFormatter.format(msg.createdAt)}</span>
                                </div>
                            ))}
                        </div>
                        <InputMessage sendMessage={onSendMessage}/>
                    </main>
            }
        </div>
    );
};

export default Chat;