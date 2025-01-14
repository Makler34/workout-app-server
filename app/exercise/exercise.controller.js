import expressAsyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

export const createNewExercise = expressAsyncHandler(async (req, res) => {

    const { name, times, iconPath } = req.body;

    const exercise = await prisma.exercise.create({
        data: {
            name, times, iconPath
        }
    })


    res.json(exercise);
})

export const getExercises = expressAsyncHandler(async (req, res) => {

    const exercise = await prisma.exercise.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    res.json(exercise);
})


export const deleteExercise = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.exercise.delete({
            where: { id: +id },
        });

        res.json({ message: 'Exercise deleted' });

    } catch (error) {
        res.status(404)
        throw new Error('Exercise not found!')
    }
})

export const updateExercise = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, times, iconPath } = req.body;

    try {
        const exercise = await prisma.exercise.update({
            where: { id: +id },
            data: { name, times, iconPath }
        });

        res.json(exercise);

    } catch (error) {
        res.status(404)
        throw new Error('Exercise not found!')
    }

})