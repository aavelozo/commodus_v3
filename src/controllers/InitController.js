import { CommonActions } from "@react-navigation/native";
import Users from "../database/models/Users";
import AuthController from "./AuthController";
import brands from "../database/mocked_data/brands";

class InitController{
    static init(navigation,realm){
        let nextRoute = {name:'Login'};

        /*initialize brands*/
        if (realm.objects("Brands").length == 0) {
            for(let i = 0; i < brands.length; i++) {
                realm.write(()=>{  
                    console.log('inserting ', brands[i]);  
                    realm.create('Brands',brands[i]);                        
                });
            }
        }                


        let users = realm.objects(Users.name).filtered(`${"logged"} = true`);
        if (users.length) {
            AuthController.setLoggedUser(users[0]);
            nextRoute = {name:"Tab"}
        } else {
            users = realm.objects(Users.name);
            if (users.length) {
                nextRoute = {
                    name:"Login",
                    params:{
                        email:users[0].email, 
                        senha:users[0].senha
                    }
                } 
            } else {
                nextRoute = {name:"UserRegistration"} 
            }
        }

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [nextRoute]
            })
        );
        
    }
}

export {InitController}