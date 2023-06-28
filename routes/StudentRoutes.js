const router = require("express").Router();
const StudentController = require("../controllers/StudentController");

router.post('/register', StudentController.register);
router.get('/list', StudentController.getAll);
router.get('/:id', StudentController.getStudentById);
router.put('/:id', StudentController.editStudent);
router.delete('/:id', StudentController.deleteStudent);



module.exports = router;