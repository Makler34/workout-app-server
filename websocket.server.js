import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import { findUniqueUser } from './app/utils/user.utils.js';


let wsConnection = null;

const createWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });
    wss.on('connection', (ws, req) => {
        try {
            if (!req?.headers?.authorization) {
                throw Error('Not authorized, no header token')
            }

            if (req.headers.authorization?.startsWith('Bearer')) {
                const token = req.headers.authorization.split(' ')[1];

                let decoded = jwt.verify(token, process.env.JWT_SECRET);

                const userFound = findUniqueUser(decoded);

                if (userFound) {
                    wsConnection = ws;
                    console.log('🟢 WebSocket connection established.'.green.bold);
                    // const sendRandomNumber = () => {
                    //     const randomNumber = Math.floor(Math.random() * 1000) + 1;
                    //     ws.send(JSON.stringify({ number: randomNumber }));
                    // };

                    //const intervalId = setInterval(sendRandomNumber, 5000);
                    // ws.on('message', (message) => {
                    //     console.log(`Получено сообщение от клиента: ${message}`);
                    //     try {
                    //         const parsedMessage = JSON.parse(message);
                    //         console.log('Parsed message:', parsedMessage);

                    //         ws.send(JSON.stringify({ confirmation: 'Message received', receivedData: parsedMessage }));
                    //     } catch (error) {
                    //         console.error('Error parsing message:', error);
                    //         ws.send(JSON.stringify({ error: 'Invalid message format' }));
                    //     }
                    // });

                    ws.on('close', () => {
                        console.log('🔴 WebSocket connection closed.'.red.bold);
                        clearInterval(intervalId);
                    });

                    ws.on('error', (error) => {
                        console.error(`WebSocket error: ${error}`.red.bold);
                        clearInterval(intervalId);
                    });
                } else {
                    throw new Error('Not authorized, token failed')
                }
            }
        } catch (error) {
            ws.send(JSON.stringify({ ErrorMessage: error?.message }));
            ws.close();
        }
    });
};

const isClientConnected = () => {
    return !!wsConnection;
}

const addMessages = (callback) => {
    wsConnection.on('message', callback);
}

const sendMessages = (message) => {
    wsConnection.send(message);
}

export {
    createWebSocketServer,
    addMessages,
    isClientConnected,
    sendMessages
}