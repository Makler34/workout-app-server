import expressAsyncHandler from "express-async-handler";
import { prisma, } from "../prisma.js";
import { calculateMinute } from "./calculate-minute.js";

export const createNewWorkout = expressAsyncHandler(async (req, res) => {

    const { name, exerciseIds } = req.body;

    const workout = await prisma.workout.create({
        data: {
            name,
            exercises: {
                connect: exerciseIds.map(id => ({ id: +id }))
            }
        },
    })


    res.json(workout);
})

export const getWorkout = expressAsyncHandler(async (req, res) => {

    try {
        const workout = await prisma.workout.findUnique({
            where: { id: +req.params.id },
            include: {
                exercises: true,
            }
        });

        const minutes = calculateMinute(workout.exercises.length);

        res.json({ ...workout, minutes });

    } catch (error) {
        res.status(404)
        throw new Error('Workout not found!')
    }

})

export const getWorkouts = expressAsyncHandler(async (req, res) => {

    const workouts = await prisma.workout.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            exercises: true,
            workoutLog: true,
        }
    });

    res.json(workouts);
})

export const deleteWorkout = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.workout.delete({
            where: { id: +id },
        });

        res.json({ message: 'Workout deleted' });

    } catch (error) {
        res.status(404)
        throw new Error('Workout not found!')
    }
})

export const updateWorkout = expressAsyncHandler(async (req, res) => {
    const { name, exerciseIds } = req.body;

    try {
        const workout = await prisma.workout.update({
            where: { id: +req.params.id },
            data: { 
                name, 
                exercises: {
                    set: exerciseIds.map(id => ({ id: +id }))
                },
            }
        });

        res.json(workout);

    } catch (error) {
        res.status(404)
        throw new Error('Workout not found!')
    }

})