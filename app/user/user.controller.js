import expressAsyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";
import { UserFields } from "../utils/user.utils.js";
import { isClientConnected, addMessages, sendMessages } from "../../websocket.server.js";

export const getUserProfile = expressAsyncHandler(async (req, res) => {

    const user = await prisma.user.findUnique({
        where: {
            id: req.user.id
        },
        select: UserFields
    })

    if (isClientConnected()) {
        addMessages((message) => {
            console.log(`Получено сообщение от клиента: ${message}`);
            try {
                const parsedMessage = JSON.parse(message);
                console.log('Parsed message:', parsedMessage);

                sendMessages(JSON.stringify({ confirmation: 'Message received', receivedData: parsedMessage }));
            } catch (error) {
                console.error('Error parsing message:', error);
                sendMessages(JSON.stringify({ error: 'Invalid message format' }));
            }
        });
    }

    res.json(user);
})

export const getStatisticByUser = expressAsyncHandler(async (req, res) => {
    const result = await prisma.workoutLog.findMany({
        where: {
            isCompleted: true,
            userId: +req.user.id
        },
        select: {
            exerciseLogs: {
                where: {
                    isCompleted: true
                },
                select: {
                    id: true,
                    times: {
                        select: {
                            weight: true,
                            repeat: true
                        }
                    }
                }
            }
        }
    });
    
    const totalMinutes = Math.ceil(
        result.reduce((sum, workoutLog) => 
            sum + workoutLog.exerciseLogs.reduce((innerSum, log) => innerSum + log.times.length, 0), 0) * 2.7
    );
    
    const totalWorkouts = new Set(
        result.flatMap(workoutLog => workoutLog.exerciseLogs.map(log => log.id))
    ).size;
    
    const totalWeight = result.reduce((sum, workoutLog) => 
        sum + workoutLog.exerciseLogs.reduce((innerSum, log) => 
            innerSum + log.times.reduce((total, time) => total + time.weight, 0), 0), 0
    ) * result.reduce((sum, workoutLog) => 
        sum + workoutLog.exerciseLogs.reduce((innerSum, log) => 
            innerSum + log.times.reduce((total, time) => total + time.repeat, 0), 0), 0
    );
    
    res.json({
        ...req.user,
        statistics: [
            {
                label: 'Minutes',
                value: totalMinutes
            },
            {
                label: 'Workouts',
                value: totalWorkouts
            },
            {
                label: 'kgs',
                value: totalWeight
            }
        ]
    })
})