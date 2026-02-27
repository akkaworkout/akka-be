const express = require('express')
const router = express.Router()
const controller = require('../controllers/exerciseRecord.controller')
const upload = require('../middlewares/upload')

/**
 * @swagger
 * tags:
 *   name: ExerciseRecord
 *   description: 운동 기록 API
 */

/**
 * @swagger
 * /exercise-record:
 *   post:
 *     summary: 운동 기록 등록
 *     description: 성공시 fail_reason(실패이유)는 공백으로 비워야합니다.
 *     tags: [ExerciseRecord]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - exercise_date
 *               - success
 *             properties:
 *               exercise_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-23
 *               success:
 *                 type: boolean
 *                 example: true
 *               memo:
 *                 type: string
 *                 example: 발레 갔다왔다!
 *               fail_reason:
 *                 type: string
 *                 nullable: true
 *                 example: 잠
 *               ticket_id:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 운동 기록 생성 성공
 *       500:
 *         description: 서버 에러
 */

router.post('/', upload.single('image'), controller.createExerciseRecord)

module.exports = router