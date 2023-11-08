const appError = require("../utils/appError")
const sqlConnection = require("../database/sqlite")
const { hash, compare } = require("bcrypt")


class UserController {
    /** 
    index - GET listar vários registro
    show - GET exibir um registro especifico 
    create - POST para criar um registro
    update - PUT para atualizar um registro
    delete - DELETE para deletar um registro
    */

    
    async create(request, response){
        const { name, email, password } = request.body

        const database = await sqlConnection()       

        const checkIfEmailExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkIfEmailExists){
            throw new appError("Esse e-mail já está cadastrado.")
        }

        const hashPassword = await hash(password, 8)

        database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashPassword])

        return response.status(201).json();


    }

    async update(request, response){
        const {name, email, password, old_password} = request.body;
        const user_id = request.user.id;

        const database = await sqlConnection();

        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);
        
        if(!user){
            throw new appError("Usuário não encontrado")
        }
        
        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
        console.log(userWithUpdatedEmail.email, user.email)

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new appError("Esse email já esta em uso.");
        }

        user.name = name ?? user.name; // ?? Quer dizer que não tiver o primeiro dado ele usa o segundo
        user.email = email ?? user.email;

        if(password && !old_password){
            throw new appError("Digite a senha antiga para conseguir redefinir a nova senha")
        }

        if(password && old_password){


            const CheckOldPassword = await compare(old_password, user.password)

            console.log(CheckOldPassword)

            if(!CheckOldPassword){
                throw new appError("Senha antiga informada não confere")
            }

            user.password = await hash(password, 8)
            
        } //Update de senha
        
        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        update_at = DATETIME('NOW')
        WHERE id = ?
        `, [user.name, user.email, user.password, user_id]);

       return response.json()
    }
}

module.exports = UserController;

