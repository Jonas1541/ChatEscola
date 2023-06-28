const StudentDB = require('../models/StudentDB');
const UserDB = require('../models/UserDB');

module.exports = class StudentController {
  static async register(req, res) {
    var id = req.body.id
    const max = await StudentDB.findOne({}).sort({ id: -1 });
    id = max == null ? 1 : max.id + 1;
    const name = req.body.name;
    const parentName = req.body.parent;

    // Validationsresponsável
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório!' });
      return;
    }

    if (!parentName) {
      res.status(422).json({ message: 'O nome do responsável é obrigatório!' });
      return;
    }

    try {
      // Verificar se o Aluno responsável existe
      const user = await UserDB.findOne({ name: parentName });

      if (!user) {
        res.status(404).json({ message: 'Responsável não encontrado!' });
        return;
      }

      // Verificar se o aluno já está cadastrado
      const studentExists = await StudentDB.findOne({ id: id });

      if (studentExists) {
        res.status(422).json({ message: 'ID já cadastrado.' });
        return;
      }

      // Criar novo aluno
      const newStudent = new StudentDB({
        id: id,
        name: name,
        parent: user._id,
      });

      const savedStudent = await newStudent.save();

      res.status(201).json({
        message: 'Aluno cadastrado com sucesso!',
        newStudent: savedStudent,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao salvar aluno' });
    }
  }

  static async getAll(req, res) {
    try {
      const students = await StudentDB.find({});
      res.status(200).json(students);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao listar os alunos' });
    }
  }

  static async getStudentById(req, res) {
    const id = req.params.id;

    try {
      const student = await StudentDB.findOne({ id: id });

      if (!student) {
        res.status(404).json({ message: 'Aluno não encontrado!' });
        return;
      }

      res.status(200).json({ student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar aluno!' });
    }
  }

  static async editStudent(req, res) {
    const id = req.body.id;
    const name = req.body.name;
    const parentName = req.body.parent;

    // Validations
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório!' });
      return;
    }

    if (!parentName) {
      res.status(422).json({ message: 'O nome do responsável é obrigatório!' });
      return;
    }

    try {
      // Verificar se o usuário responsável existe
      const user = await UserDB.findOne({ name: parentName });

      if (!user) {
        res.status(404).json({ message: 'Usuário responsável não encontrado!' });
        return;
      }

      // Verificar se o aluno existe
      const student = await StudentDB.findOne({ id: id });

      if (!student) {
        res.status(404).json({ message: 'Aluno não encontrado!' });
        return;
      }

      // Atualizar os dados do aluno
      student.name = name;
      student.parent = user._id;

      const updatedStudent = await student.save();

      res.json({
        message: 'Aluno atualizado com sucesso!',
        data: updatedStudent,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  }

  static async deleteStudent(req, res) {
    try {
      const id = req.params.id;
      const student = await StudentDB.findOne({ id: id });

      if (!student) {
        res.status(404).json({ message: 'Aluno não encontrado!' });
        return;
      }

      await StudentDB.findByIdAndRemove(student._id);
      res.status(200).json({ message: 'Aluno excluído com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao excluir o aluno' });
    }
  }
};
