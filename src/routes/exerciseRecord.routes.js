const express = require('express')
const router = express.Router()
const controller = require('../controllers/exerciseRecord.controller')
const upload = require('../middlewares/upload')

/**
 * @swagger
 * tags:
 *   name: ExerciseRecord
 *   description: 운동 기록 관리 API
 */


/**
 * @swagger
 * /exercise-record:
 *   get:
 *     summary: 운동 기록 전체 조회
 *     description: 로그인한 사용자의 운동 기록 목록을 조회합니다.
 *     tags: [ExerciseRecord]
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             example:
 *               - record_id: 12
 *                 exercise_date: 2026-03-09
 *                 success: 1
 *                 memo: 발레 성공
 *               - record_id: 11
 *                 exercise_date: 2026-03-08
 *                 success: 0
 *                 memo: 피곤해서 실패
 *       500:
 *         description: 서버 에러
 */
router.get('/', controller.getExerciseRecords)


/**
 * @swagger
 * /exercise-record/{record_id}:
 *   get:
 *     summary: 특정 운동 기록 조회
 *     description: record_id 기준으로 운동 기록 하나를 조회합니다.
 *     tags: [ExerciseRecord]
 *     parameters:
 *       - in: path
 *         name: record_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 조회할 운동 기록 ID
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             example:
 *               record_id: 12
 *               exercise_date: 2026-03-09
 *               success: 1
 *               memo: 발레 성공
 *       404:
 *         description: 운동 기록 없음
 *       500:
 *         description: 서버 에러
 */
router.get('/:record_id', controller.getExerciseRecord)


/**
 * @swagger
 * /exercise-record:
 *   post:
 *     summary: 운동 기록 등록
 *     description: |
 *       운동 기록을 생성합니다.
 *
 *       규칙
 *       - success가 true이면 fail_reason을 입력할 수 없습니다.
 *       - success가 false이면 fail_reason을 입력할 수 있습니다.
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
 *               - ticket_id
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
 *                 example: 발레 수업 다녀왔다!
 *               fail_reason:
 *                 type: string
 *                 nullable: true
 *                 example: 피곤해서 못감
 *               ticket_id:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 운동 기록 생성 성공
 *         content:
 *           application/json:
 *             example:
 *               message: 운동 기록 생성 완료
 *               record_id: 12
 *       400:
 *         description: 잘못된 요청
 *       404:
 *         description: 티켓 없음
 *       500:
 *         description: 서버 에러
 */
router.post('/', upload.single('image'), controller.createExerciseRecord)


/**
 * @swagger
 * /exercise-record/{record_id}:
 *   patch:
 *     summary: 운동 기록 수정
 *     description: |
 *       기존 운동 기록을 수정합니다.
 *
 *       일부 필드만 수정할 수 있습니다.
 *
 *       규칙
 *       - success=true이면 fail_reason은 사용할 수 없습니다.
 *     tags: [ExerciseRecord]
 *     parameters:
 *       - in: path
 *         name: record_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 수정할 운동 기록 ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               exercise_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-24
 *               success:
 *                 type: boolean
 *                 example: false
 *               memo:
 *                 type: string
 *                 example: 오늘은 쉬었다
 *               fail_reason:
 *                 type: string
 *                 example: 야근
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 운동 기록 수정 성공
 *         content:
 *           application/json:
 *             example:
 *               message: 운동 기록 수정 완료
 *       404:
 *         description: 운동 기록 없음
 *       500:
 *         description: 서버 에러
 */
router.patch('/:record_id', upload.single('image'), controller.updateExerciseRecord)


/**
 * @swagger
 * /exercise-record/{record_id}:
 *   delete:
 *     summary: 운동 기록 삭제
 *     description: 특정 운동 기록을 삭제합니다.
 *     tags: [ExerciseRecord]
 *     parameters:
 *       - in: path
 *         name: record_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 삭제할 운동 기록 ID
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             example:
 *               message: 운동 기록 삭제 완료
 *       404:
 *         description: 운동 기록 없음
 *       500:
 *         description: 서버 에러
 */
router.delete('/:record_id', controller.deleteExerciseRecord)

module.exports = router