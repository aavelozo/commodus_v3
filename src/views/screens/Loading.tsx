import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react"
import { ActivityIndicator, View } from "react-native"
import { InitController } from "../../controllers/InitController";
import {useRealm} from '@realm/react';

function Loading(props: Object) : JSX.Element {

    const navigation = useNavigation();
    const realm = useRealm();
    useEffect(()=>{
        InitController.init(navigation,realm);
    });

    return (
        <View 
            style={{ 
                width:'100%', 
                height:'100%',                
                alignItems: 'center', 
                justifyContent: 'center',
                flex: 1
            }} >
            <ActivityIndicator size={'large'}/>
        </View>
    )
}

export {Loading}