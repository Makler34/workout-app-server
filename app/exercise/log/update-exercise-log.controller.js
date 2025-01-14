import expressAsyncHandler from "express-async-handler";
import { prisma } from "../../prisma.js";


export const updateExerciseLogTime = expressAsyncHandler(async (req, res) => {
    const { weight, repeat, isCompleted } = req.body;

    try {
        const exerciseLogTime = await prisma.exerciseTime.update({
            where: {
                id: +req.params.id
            },
            data: {
                weight,
                repeat,
                isCompleted,
            }
        })

        return res.json(exerciseLogTime);
    } catch (error) {
        res.status(404);
        throw new Error('Exercise log time log not found!');
    }
})

export const updateCompleteExerciseLog = expressAsyncHandler(async (req, res) => {

    const { isCompleted } = req.body
    try {
        const exerciseLogTime = await prisma.exerciseLog.update({
            where: {
                id: +req.params.id
            },
            data: {
                isCompleted
            },
            include: {
                Exercise: true,
                workoutLog: true,
            }
        })

        return res.json(exerciseLogTime);
    } catch (error) {
        res.status(404);
        throw new Error('Exercise log time log not found!');
    }
})