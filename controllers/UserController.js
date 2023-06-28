const UserDB = require('../models/UserDB');
const bcrypt = require('bcrypt');

module.exports = class UserController {
    static async register(req, res) {
        var id = req.body.id
        const max = await UserDB.findOne({}).sort({ id: -1 });
        id = max == null ? 1 : max.id + 1;
        const name = req.body.name;
        const password = req.body.password;
        const address = req.body.address;
        const phone = req.body.phone;
        const funcao = req.body.funcao;
    
        // validations
        if (!name) {
          res.status(422).json({ message: 'O nome é obrigatório!' });
          return;
        }
    
        if (!password) {
          res.status(422).json({ message: 'A senha é obrigatória!' });
          return;
        }
        if (!address) {
          res.status(422).json({ message: 'O endereço é obrigatório!' });
          return;
        }
        if (!phone) {
          res.status(422).json({ message: 'O telefone é obrigatório!' });
          return;
        }
    
        // check if user exists
        const userExists = await UserDB.findOne({ id: id });
    
        if (userExists) {
          res.status(422).json({ message: 'ID já cadastrado.' });
          return;
        }
    
        // create password
        /*const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);*/
    
        // finally create user
        const user = new UserDB({
          id: id,
          name: name,
          address: address,
          //password: passwordHash,
          password: password,
          phone: phone,
          funcao: funcao,
        });
    
        try {
          const newUser = await user.save();
          res.status(201).json({
            message: 'Cadastrado com sucesso!',
            newUser: newUser,
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Erro ao salvar usuário' });
        }
      }
    
      static async getAll(req, res) {
        try {
          const resultado = await UserDB.find({});
          res.render('relatorios', { relatorios: resultado });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Erro ao listar os usuários' });
        }
      }
      
    
      static async login(req, res) {
        const { name, password } = req.body;
    
        // Checar se o campo está preenchido
        if (!name) {
          res.status(422).json({ message: 'O nome é obrigatório.' });
          return;
        }
        if (!password) {
          res.status(422).json({ message: 'A senha é obrigatória.' });
          return;
        }
    
        try {
          // Verificar se o usuário existe
          const user = await UserDB.findOne({ name: name });
    
          if (!user) {
            return res.status(422).json({ message: 'Usuário não encontrado.' });
          }
    
          // Verificar se a senha corresponde
          //const checkPassword = await bcrypt.compare(password, user.password);
    
          if(user.password != password){
            return res.status(422).json({message: 'A senha não coincide com o usuário.'})
          } 

         /* if (!checkPassword) {
            return res.status(422).json({ message: 'Senha inválida.' });
          } */
    
          // Redirecionar com base na função do usuário
          if (user.funcao === 'Diretor(a)') {
            return res.render('directorhome');
          } else if (user.funcao === 'Responsável') {
            return res.render('parenthome');
          }
    
          // Renderizar o login.handlebars se a função do usuário não for "Diretor(a)" ou "Responsável"
          res.render('login');
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
        }
      }

    static async getUserById(req, res) {
      const id = req.params.id;
    
      try {
        const user = await UserDB.findOne({ id: id });
    
        if (!user) {
          res.status(404).json({ message: 'Usuário não encontrado!' });
          return;
        }
    
        res.status(200).json({ user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar usuário!' });
      }
    }

    static async editUser(req, res) {

        const id = req.body.id;
        const name = req.body.name;
        const password = req.body.password;
        const phone = req.body.phone;
        const address = req.body.address;
        
        const user = req.body

        // validations
        if (!name) {
            res.status(422).json({ message: 'O name é obrigatório!' })
            return
        }

        user.name = name;

        if (!address) {
            res.status(422).json({ message: 'O endereço é obrigatório!' })
            return
        }

        user.address = address;

        // check if user exists
        const userExists = await UserDB.findOne({ id: id })

        if (!password) {
            // creating password
            const salt = await bcrypt.genSalt(12)
            const reqPassword = req.body.password

            const passwordHash = await bcrypt.hash(reqPassword, salt)

            user.password = passwordHash;
        }

        if (!phone) {
            res.status(422).json({ message: 'O telefone é obrigatório!' })
            return
        }

        user.phone = phone;

        try {
            // returns updated data
            const updatedUser = await UserDB.findOneAndUpdate(
                { id: user.id },
                { $set: user },
                { new: true },
            )
            res.json({
                message: 'Usuário atualizado com sucesso!',
                data: updatedUser,
            })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    static async deleteUser(req, res) {
        try {
            const id = req.params.id;
            const _id = String((await UserDB.findOne({ id: id }))._id);
            await UserDB.findByIdAndRemove(String(_id));
            res.status(200).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erro ao excluir o usuário" });
        }
    }
}
