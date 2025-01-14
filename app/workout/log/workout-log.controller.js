import expressAsyncHandler from "express-async-handler";
import { prisma } from "../../prisma.js";
import { calculateMinute } from "../calculate-minute.js";

export const createNewWorkoutLog = expressAsyncHandler(async (req, res) => {
    const { workoutId } = req.params;

    const workout = await prisma.workout.findUnique({
        where: {
            id: +workoutId
        },
        include: {
            exercises: true
        }
    })

    if (!workout) {
        res.status(404);
        throw new Error('Workout not found!');
    }

    const workoutLog = await prisma.workoutLog.create({
        data: {
            workout: {
                connect: {
                    id: +workoutId
                }
            },
            user: {
                connect: {
                    id: +req.user.id
                }
            },
            exerciseLogs: {
                create: workout.exercises.map(exercise => ({
                    user: {
                        connect: {
                            id: req.user.id
                        }
                    },
                    Exercise: {
                        connect: {
                            id: exercise.id
                        }
                    },
                    times: {
                        create: Array.from({ length: exercise.times }, () => ({
                            weight: 0,
                            repeat: 0
                        }))

                    }
                }))
            }
        },
        include: {
            exerciseLogs: {
               include: {
                times: true
               }
            }
        }
    })


    res.json(workoutLog);
})

export const getWorkoutLog = expressAsyncHandler(async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            res.status(404);
            throw new Error(`id is not defined`)
        }

        const workoutLog = await prisma.workoutLog.findUnique({
            where: {
                id: +id
            },
            include: {
                workout: {
                    include: {
                        exercises: true
                    }
                },
                exerciseLogs: {
                    include: {
                        Exercise: true
                    },
                    orderBy: {
                        id: 'asc'
                    }
                }

            }
        });

        if (!workoutLog) {
            res.status(404);
            throw new Error(`Logs no founded by id ${id}`)
        }

          const minutes = calculateMinute();

        res.json({ ...workoutLog, minutes: calculateMinute(workoutLog.workout.exercises.length) });

    } catch (error) {
        res.status(500);
        throw new Error(error?.message)

    }
})

export const updateWorkoutLog = expressAsyncHandler(async (req, res) => {
    try {
        const workoutLog = await prisma.workoutLog.update({
            where: {
                id: +req.params.id
            },
            data: {
                isCompleted: true,
            }
        })

        return res.json(workoutLog);
    } catch (error) {
        res.status(404);
        throw new Error('workout log time log not found!');
    }
})