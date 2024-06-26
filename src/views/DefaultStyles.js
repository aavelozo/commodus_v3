import { Dimensions} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

class DefaultStyles {

    static windowWidth =  Dimensions.get('window').width;
    static windowHeight =  Dimensions.get('window').height;

    

    static colors = {
        fundo: '#DDDDDD',
        tabBar: '#0E0D13',
        botao: '#F4FF00',
        fundoInput: '#F4F4F4',
    }

    static dimensions = {
        width:{
            formElement : Dimensions.get('window').width * 0.9
        },
        height:{
            formElement : Dimensions.get('window').height / 14
        },
        defaultLabelFontSize: RFValue(16),
        defaultInputFontSize: RFValue(14),
        defaultInputMaginButton : RFValue(7)
    }

    static formElement = {       
        width:DefaultStyles.dimensions.width.formElement,
        //height: defaultStyles.dimensions.height.formElement, comentado corrigiu o rollback
        marginBottom: DefaultStyles.dimensions.defaultInputMaginButton,        
        backgroundColor: DefaultStyles.colors.fundoInput,
        color: DefaultStyles.colors.tabBar,
        paddingLeft: RFValue(5),
        borderRadius: RFValue(5),
        alignSelf: 'center',
        //height: RFValue(50),
        fontSize: DefaultStyles.dimensions.defaultInputFontSize,
        fontFamily: 'verdana'        
    }

    static textInput = {
        width: DefaultStyles.windowWidth * 0.9,
        marginBottom: RFValue(7),        
        // paddingLeft: RFValue(2),
        borderRadius: RFValue(5),
        alignSelf: 'center',
        backgroundColor: DefaultStyles.colors.fundoInput,                    
        fontSize: RFValue(14),
        fontFamily: 'verdana',
    }
    static textInputWithDropdown = {
        width: DefaultStyles.windowWidth * 0.9,
        // marginLeft: RFValue(30),
        borderRadius: RFValue(5),
        alignSelf: 'center',
        backgroundColor: DefaultStyles.colors.fundoInput,                    
        fontSize: RFValue(14),
        fontFamily: 'verdana',
        marginBottom: Dimensions.get('window').height > 700 ? RFValue(DefaultStyles.dimensions.height.formElement * -0.75) : RFValue(DefaultStyles.dimensions.height.formElement * -1.2)
    }
    static selectDropdown = {
        width: DefaultStyles.windowWidth * 0.9,
        marginBottom: RFValue(7),        
        paddingLeft: RFValue(7),
        borderRadius: RFValue(5),
        alignSelf: 'center',
        backgroundColor: DefaultStyles.colors.fundoInput,                    
        fontSize: RFValue(16),
        fontFamily: 'verdana',
        borderWidth: 1,
        borderColor: DefaultStyles.colors.tabBar 
    }

    static selectDropdownWithTextInput = {
        width: DefaultStyles.windowWidth * 0.9,
        marginBottom: RFValue(7),        
        paddingLeft: RFValue(15),
        borderRadius: RFValue(5),
        alignSelf: 'center',
        backgroundColor: 'transparent',
        fontSize: RFValue(14),
        fontFamily: 'verdana',
        borderWidth: 0,        
        borderColor: 'transparent'/*,
        borderColor: 'none',
        backgroundColor: 'none' */
    }

    static viewSwitch =  {
        width: '100%', 
        alignItems: 'center', 
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        marginBottom: 10
    } 

    static buttonConclude = {
        position: 'absolute',
        right: RFValue(10),
    }
    static buttonCancel = {
        position: 'absolute',
        left: RFValue(10),
    }
    static textButton = {
        fontSize: RFValue(20),
        color: DefaultStyles.colors.tabBar
    }

}
export {DefaultStyles}