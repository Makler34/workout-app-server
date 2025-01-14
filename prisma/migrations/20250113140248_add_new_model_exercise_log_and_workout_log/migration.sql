-- CreateTable
CREATE TABLE "Exercise_log" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "user_id" INTEGER NOT NULL,
    "exercise_id" INTEGER,
    "workout_log_id" INTEGER,

    CONSTRAINT "Exercise_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise_time" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "weight" INTEGER NOT NULL,
    "repeat" INTEGER NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "exercise_log_id" INTEGER,

    CONSTRAINT "Exercise_time_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_log" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "workout_id" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "workout_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exercise_log" ADD CONSTRAINT "Exercise_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise_log" ADD CONSTRAINT "Exercise_log_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise_log" ADD CONSTRAINT "Exercise_log_workout_log_id_fkey" FOREIGN KEY ("workout_log_id") REFERENCES "workout_log"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise_time" ADD CONSTRAINT "Exercise_time_exercise_log_id_fkey" FOREIGN KEY ("exercise_log_id") REFERENCES "Exercise_log"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_log" ADD CONSTRAINT "workout_log_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_log" ADD CONSTRAINT "workout_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
