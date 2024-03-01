import { Alert } from "react-native";

/**
 * utilitis javascripts
 * @author Alencar
 * @created 2022-09-11
 */
export default class Utils{
    static logActive = (typeof Utils.logActive !== "undefined"? Utils.logActive : true);
    static setLogActive(active) {
        Utils.logActive = active;
    }
    static showError(error){
        Utils.logi(Utils.name,Utils.showError.name);
        try {
            if (Utils.logActive === true) {               
                console.error(error);
            }
            let typeOfError = typeof error;
            let title = "Erro";
            typeOfError = typeOfError.toLowerCase().trim();
            if (typeOfError === "string") {
                Alert.alert(title,error);
            } else if (typeOfError === "object") {
                Alert.alert(title,(error.message || error.toString()));
            } else {
                Alert.alert(title,`erro nao pode ser mostrado: ${typeOfError}, vide log`);
            }
        } catch (e) {
            Utils.log(e);
        }
        Utils.logf(Utils.name,Utils.showError.name);
    }
    static log(...objs) {
        if (Utils.logActive === true) {
            if (objs != null) {
                console.log(objs);
            }
        }
    }
    static logi(objName, methodName) {
        Utils.log(`INIT ${objName}.${methodName}`);
    }
    static logf(objName, methodName) {
        Utils.log(`END  ${objName}.${methodName}`);
    }

    static toNumber(value) {        
        let result = null;
        if (value != null) {
            let tp = typeof value;
            if (tp == "number") {
                result = value;
            } else if (tp == "string") {
                result = value.replace(",",".") - 0;
            } else {
                console.log(value);
                throw new Error("tipo nao esperado: " + tp);
            }
        }
        return result;
    }
}