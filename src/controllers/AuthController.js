import Users from "../database/models/Users";

/**
 * classe para controlar o login
 */
export default class AuthController{

    static #loggedUser = null;

    /**
     * @deprecated (used only unitary test)
     * @param {Object} user 
     * @returns {boolean}
     */
    static testLogin(user){
        try {
            if ((user||{}).senha.length > 0 && (user||{}).senha == (Dados.user||{}).senha && (user||{}).email == (Dados.user||{}).email) {
                return true;    
            } else {
                return false;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * metodo que efetua login ou rejeita a promise
     * @param {object} user - o objeto login que contem o email e senha
     * @returns {Promise}
     * @created 2022-09-12
     */
    static async login(pUser,realm){
        try {          
            let user = await realm.objects(Users.name).filtered(`${"mail"} == '${(pUser||{}).email}' and ${"password"} == '${(pUser||{}).senha}'`);
            if (user.length > 0) {
                await realm.write(() => {           
                    user[0].logged = true;
                });   
                AuthController.#loggedUser = user[0]; 
                return true;
            } else {
                return "usuário não encontrado ou senha inválida";
            }
        } catch (e) {
            console.log(e);
            return e.message || e;
        }    
    }

    static getLoggedUser(){
        return AuthController.#loggedUser;
    }

    static setLoggedUser(loggedUser){
        AuthController.#loggedUser = loggedUser;
    }

    static getUser(email){
        return dbRealm.getDbInstance().objects(Usuarios.name).filtered("mail == '"+email+"'");
    }

    static getPassword(senha){
        return dbRealm.getDbInstance().objects(Usuarios.name).filtered("password == '"+senha+"'");
    }



    static sendRecoverPasswordEmail(email) {
        return new Promise((resolve,reject)=>{
            try {
                resolve(true);
            } catch (e) {
                reject(e);
            }
        });
    }


}
