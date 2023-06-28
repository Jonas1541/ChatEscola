const router = require("express").Router();
const UserController = require("../controllers/UserController");

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/list', UserController.getAll);
router.get('/cadastros', UserController.cadastros);
router.get('/registrarResponsavel', UserController.registrarResponsavel);
router.get('/registrarAluno', UserController.registrarAluno);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.editUser);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
