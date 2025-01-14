import express from "express";
import { createNewWorkout, deleteWorkout, getWorkout, getWorkouts, updateWorkout } from "./workout.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { createNewWorkoutLog, getWorkoutLog, updateWorkoutLog } from "./log/workout-log.controller.js";

const router = express.Router();

router.route('/')
    .post(protect, createNewWorkout)
    .get(protect, getWorkouts)

router.route('/:id')
    .get(protect, getWorkout)
    .put(protect, updateWorkout)
    .delete(protect, deleteWorkout)

router.route('/log/:workoutId')
    .post(protect, createNewWorkoutLog)

router.route('/log/:id')
    .get(protect, getWorkoutLog)

router.route('/log/complete/:id')
    .patch(protect, updateWorkoutLog)


export default router;