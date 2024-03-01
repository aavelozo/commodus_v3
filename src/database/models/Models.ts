import Realm from "realm";
import Vehicles from "./Vehicles";

/**
 * Classe Models, representa o model da tabela Models
 * @created 2022-10-14
 */
class Models extends Realm.Object {
    model! : string;
    vehicles!: Realm.List<Vehicles>;
    static schema : Realm.ObjectSchema = {
        name: "Models",
        properties: {
            "model"  : "string",
            "vehicles": "Vehicles[]" 
        }
    };    
}

export default Models;  