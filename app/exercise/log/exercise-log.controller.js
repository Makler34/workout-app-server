import expressAsyncHandler from "express-async-handler";
import { prisma } from "../../prisma.js";
import { addPrevValues } from "./add-prev-values.util.js";

export const createNewExerciseLog = expressAsyncHandler(async (req, res) => {
    const exerciseId = +req.params.exerciseId;

    const exercise = await prisma.exercise.findUnique({
        where: {
            id: exerciseId
        }
    })

    if (!exercise) {
        res.status(404);
        throw new Error('Exercise not found!');
    }

    let timesDefault = []

    for (let i = 0; i < exercise.times; i++) {
        timesDefault.push({
            weight: 0,
            repeat: 0
        })
    }

    const exerciseLog = await prisma.exerciseLog.create({
        data: {
            user: {
                connect: {
                    id: req.user.id
                }
            },
            Exercise: {
                connect: {
                    id: exerciseId
                }
            },
            times: {
                createMany: {
                    data: timesDefault
                }
            },
        },
        include: {
            times: true
        }
    })


    res.json(exerciseLog);
})

export const completeExerciseLog = expressAsyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        res.status(404);
        throw new Error(`id is not defined`)
    }

    const exerciseLogs = await prisma.exerciseLog.update({
        where: {
            id: +id
        },
        data: {
            isCompleted: true,
        }
    });

    if (!id) {
        res.status(404);
        throw new Error(`No updated rows by id: ${id}`)
    }

    res.json(exerciseLogs);
})



export const getExerciseLog = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(404);
            throw new Error(`id is not defined`)
        }

        const exerciseLogs = await prisma.exerciseLog.findUnique({
            where: {
                id: +id
            },
            include: {
                Exercise: true,
                times: {
                    orderBy: {
                        id: 'asc'
                    }
                }
            }
        });

        if (!exerciseLogs) {
            res.status(404);
            throw new Error(`Logs no founded by id ${id}`)
        }

        const prevExerciseLog = await prisma.exerciseLog.findFirst({
            where: {
                exerciseId: exerciseLogs.exerciseId,
                userId: req.user.id,
                isCompleted: true,
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                times: true
            }
        })

        let newTimes = addPrevValues(exerciseLogs, prevExerciseLog)

        res.json({ ...exerciseLogs, times: newTimes });

    } catch (error) {
        res.status(500);
        throw new Error(error?.message)

    }
})
