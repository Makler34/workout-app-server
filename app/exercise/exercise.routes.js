import express from "express";
import { createNewExercise, deleteExercise, getExercises, updateExercise } from "./exercise.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { completeExerciseLog, createNewExerciseLog, getExerciseLog } from "./log/exercise-log.controller.js";
import { updateExerciseLogTime } from "./log/update-exercise-log.controller.js";

const router = express.Router();

router.route('/').post(protect, createNewExercise);
router.route('/').get(protect, getExercises);
router.route('/:id').delete(protect, deleteExercise);
router.route('/:id').put(protect, updateExercise);
router.route('/log/:exerciseId').post(protect, createNewExerciseLog);
router.route('/log/:id').get(protect, getExerciseLog);
router.route('/log/complete/:id').patch(protect, completeExerciseLog);
router.route('/log/time/:id').put(protect, updateExerciseLogTime);

export default router;