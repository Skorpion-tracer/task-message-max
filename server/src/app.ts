import express, {type Request, type Response} from 'express';
import session from 'express-session';
import axios from "axios";
import type {UserData} from "../../src/api/UserData.ts";
import {URL} from "../../src/api/Api.js";
import type {CheckAccount} from "../../src/api/CheckAccount.ts";
import cors from 'cors';

declare module 'express-session' {
    interface SessionData {
        green?: {
            idInstance: number;
            apiTokenInstance: string;
            chatId?: string;
        };
    }
}

const ERROR_MESSAGES: Record<string, string> = {
    notAuthorized: 'Инстанс не авторизован',
    blocked: 'Аккаунт МАХ получил блокировку',
    starting: 'Инстанс в процессе запуска',
    pendingPassword: 'Для завершения авторизации необходимо отправить пароль двухфакторной аутентификации',
};

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.set('trust proxy', 1);

app.use(cors({
    origin: 'https://task-message-max.vercel.app',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'lax',
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000
    },
}));

const PORT = process.env.PORT || 3000;

app.post('/api/login', async (req: Request<{}, {}, UserData>, res: Response) => {
    const { idInstance, apiTokenInstance } = req.body;
    try {
        const { data } = await axios.get(`${URL}waInstance${idInstance}/getStateInstance/${apiTokenInstance}`);

        if (data.stateInstance === "authorized" || data.stateInstance === "suspended") {
            req.session.green = { idInstance, apiTokenInstance };
            res.json({ ok: true });
            return;
        }
        return res.status(401).json({ error: ERROR_MESSAGES[data.stateInstance] ?? "Неизвестная ошибка" });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Неизвестная ошибка';
        return res.status(401).json({ error: message });
    }
});

app.get('/api/me', (req: Request, res: Response) => {
    if (req.session.green) {
        return res.json({ authorized: true });
    }
    return res.json({ authorized: false });
});

app.post('/api/check-account', async (req: Request, res: Response) => {
    const green = req.session.green;
    if (!green) {
        return res.status(401).json({ error: 'Не авторизован' });
    }

    const { phoneNumber } = req.body;

    try {
        const { data } = await axios.post<CheckAccount>(
            `${URL}waInstance${green.idInstance}/checkAccount/${green.apiTokenInstance}`,
            { phoneNumber }
        );
        if (data.exist) {
            green.chatId = data.chatId;
            return res.json({ ok: true, chatId: data.chatId });
        }

        return res.status(404).json({ error: 'Аккаунт не найден' });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Ошибка проверки';
        return res.status(500).json({ error: message });
    }
});

app.post('/api/send', async (req: Request, res: Response) => {
    const green = req.session.green;
    if (!green || !green.chatId) {
        return res.status(401).json({ error: 'Не авторизован или не указан получатель' });
    }

    const { message } = req.body;

    try {
        const { data } = await axios.post(
            `${URL}waInstance${green.idInstance}/sendMessage/${green.apiTokenInstance}`,
            {
                chatId: green.chatId,
                message: message
            }
        );

        return res.json({ ok: true, data });
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка отправки';
        return res.status(500).json({ error: msg });
    }
});

let receiving = false;

app.get('/api/receive', async (req: Request, res: Response) => {
    const green = req.session.green;
    if (!green) return res.status(401).json({ error: 'Не авторизован' });

    if (receiving) {
        return res.json({ ok: true, message: null });
    }

    receiving = true;

    try {
        const { data } = await axios.get(
            `${URL}waInstance${green.idInstance}/receiveNotification/${green.apiTokenInstance}?receiveTimeout=10`
        );

        if (!data) {
            return res.json({ ok: true, message: null });
        }

        const del = await axios.delete(
            `${URL}waInstance${green.idInstance}/deleteNotification/${green.apiTokenInstance}/${data.receiptId}`
        );
        console.log('deleteNotification result:', del.data);

        const body = data.body;

        const message = {
            chatName: body.senderData?.chatName ?? 'Неизвестный',
            textMessage: body.messageData?.textMessageData?.textMessage ?? ''
        };

        return res.json({ ok: true, message });

    } catch (e) {
        const msg = e instanceof Error ? e.message : 'Ошибка получения';
        return res.status(500).json({ error: msg });
    } finally {
        receiving = false;
    }
});
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));