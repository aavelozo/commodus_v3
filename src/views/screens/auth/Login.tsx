import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableWithoutFeedback, Text, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { DefaultStyles } from '../../DefaultStyles';
import { DefaultProps } from '../../DefaultProps';
import AuthController from '../../../controllers/AuthController';
import { useRealm } from '@realm/react';
import { RFValue } from 'react-native-responsive-fontsize';


function Login(props: Object): JSX.Element {
    const [login, setLogin] = useState((props.user || {}).email)
    const [senha, setSenha] = useState('')
    const [logged, setLogged] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigation = useNavigation();
    const realm = useRealm();

    useEffect(() => {
        const usuarios = realm.objects('Users')
    }, [])

    return (
        <View style={style.container}>

            <View style={style.imagem}>
                <Image
                    style={{ height: RFValue(130), width: RFValue(130) }}
                    resizeMode='cover'
                    source={require('../../assets/logoCommodusEscuro.png')}
                />
            </View>

            <View style={style.viewInput}>

                <TextInput
                    {...DefaultProps.textInput}
                    style={DefaultStyles.textInput}
                    label='E-mail'
                    mode='outlined'
                    keyboardType='email-address'
                    defaultValue=''
                    onChangeText={text => {
                        setLogin(text)
                        setErrorMessage('')
                        setLogged(false)
                    }}
                    value={login}
                />
                {
                    !logged && errorMessage != '' ?
                        <Text style={style.textoErro}>{errorMessage}</Text>
                        : false
                }
                <TextInput
                    {...DefaultProps.textInput}
                    style={DefaultStyles.textInput}
                    label='Senha'
                    mode='outlined'
                    onChangeText={text => {
                        setLogged(false)
                        setErrorMessage('')
                        setSenha(text)
                    }}
                    value={senha}
                    secureTextEntry={true}
                    autoComplete='email'
                />

                <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('RecoverLogin')}
                >
                    <Text
                        style={{ marginBottom: RFValue(20), color: DefaultStyles.colors.tabBar, alignSelf: 'flex-start', marginLeft: RFValue(20) }}
                    >
                        Esqueceu a senha ?
                    </Text>
                </TouchableWithoutFeedback>



                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={async () => {

                        let result = await AuthController.login({ email: login, senha: senha }, realm);
                        if (result === true) {
                            setLogged(true);

                            //navigate to home and remove actual screen of stack (login)
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Tab' }]
                                })
                            );
                        } else {
                            console.log(result);
                            setLogged(false);
                            setErrorMessage(result?.message || result);
                        };
                    }}
                    style={style.button}
                >
                    <Text style={style.textButton}>
                        Entrar
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('UserRegistration')}>
                    <>
                        <Text style={{ marginTop: 50, color: DefaultStyles.colors.tabBar }}>Ainda não tem cadastro ?</Text>
                        <Text style={{ textAlign: 'center', color: DefaultStyles.colors.tabBar }}>Registre-se</Text>
                    </>

                </TouchableOpacity>
            </View>


        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
        // borderTopLeftRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: DefaultStyles.colors.botao,
        width: '65%',
        height: Dimensions.get('window').height / 14,
        borderRadius: RFValue(16),
        borderBottomWidth: 1,
        borderBottomColor: DefaultStyles.colors.tabBar,
    },
    textButton: {
        color: DefaultStyles.colors.tabBar,
        fontWeight: 'bold',
        fontSize: RFValue(20),

    },
    textoErro: {
        color: '#cb0000',
        alignSelf: 'flex-start',
        marginLeft: RFValue(30)
    },
    viewErro: {
        // paddingHorizontal: Dimensions.get('window').width * 0.10, 
        alignSelf: 'center',

    },
    imagem: {
        justifyContent: 'center',
        flex: 3,
        width: '100%',
        alignItems: 'center',
    },

    viewInput: {
        flex: 4,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'

        // borderWidth: 1,
        // borderColor: 'blue'
    }
})

export { Login }