
import React, { useState } from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, KeyboardAvoidingView, Alert, ScrollView } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { CommonActions } from '@react-navigation/native'
import { DefaultStyles } from '../../DefaultStyles'
import Dados from '../../../controllers/Dados'
import { useRealm } from '@realm/react'
import Usuarios from '../../../database/models/Users'
import { TextInput } from 'react-native-paper'
import { DefaultProps } from '../../DefaultProps'
import { RFValue } from 'react-native-responsive-fontsize'
import Utils from '../../../controllers/Utils'

const schema = yup.object({
    nomeCompleto: yup.string().required("Informe seu nome completo"),
    email: yup.string().email("Email inválido").required("Informe seu email"),
    senha: yup.string().min(6, '6 digitos').required("Informe sua senha"),
    confirmeSenha: yup.string().min(6, '6 digitos').required("Informe sua senha"),
})


function FormUser(props: React.PropsWithChildren): JSX.Element {
    const realm = useRealm();
    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })


    /**
     * submited on user registration
     * @param data 
     * @returns 
     * @updates 
     *      - 2024-03-19 - implemented server user register request
     */
    async function onSubmit(data: any) {
        try {

            if (data.senha !== data.confirmeSenha) {
                Alert.alert('Erro encontrado', 'Senhas divergentes')
                return
            }
            Dados.user = data;


            //erver user register request
            console.log('requesting to server');
            let serverResponse = await fetch("http://68.183.105.44:3000/api/auth/register",{
                method: "POST",
                headers: {
                    "Content-type":"application/json",
                    accept:"application/json"
                },
                body:JSON.stringify({
                    mail: data.email,
                    password: data.senha,
                    name: data.name                
                })
            });
            console.log('requested to server', serverResponse.status);
            if (serverResponse && serverResponse.status == 200){
                serverResponse = await serverResponse.json();
                if (serverResponse && Utils.toBool(serverResponse.success)) {


                    //local save
                    realm.write(() => {
                        let novoUsuario = realm.create(Usuarios.name, {
                            "name": data.nomeCompleto,
                            "mail": data.email,
                            "password": data.senha,
                            "logged": false
                        });

                        props.navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'Login', params: data }]
                            })
                        );
                    });


                } else {
                    Utils.showError(serverResponse.message || 'Erro ao se cadastrar');
                }
            } else {
                serverResponse = await serverResponse.json();
                Utils.showError(serverResponse.message || 'Erro ao se cadastrar');
            }
        } catch (e) {
            console.log(e);
            Utils.showError(e);
        }
    }

    return (
        <View style={style.container}>
            <ScrollView>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, paddingTop: '30%' }}>
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Nome Completo'
                                autoComplete='name'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="nomeCompleto"
                    />
                    {errors.nomeCompleto ?
                        <View style={style.viewErro} >
                            <Text style={style.textoErro}>{errors.nomeCompleto?.message}</Text>

                        </View>
                        : false
                    }
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                keyboardType='email-address'
                                label='E-mail'
                                secureTextEntry={false}
                                autoComplete='email'
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="email"
                    />
                    {errors.email ?
                        <View style={style.viewErro} >
                            <Text style={style.textoErro}>{errors.email?.message}</Text>

                        </View>
                        : false
                    }
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Senha'
                                secureTextEntry={true}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="senha"
                    />
                    {errors.senha ?
                        <View style={style.viewErro} >
                            <Text style={style.textoErro}>{errors.senha?.message}</Text>
                        </View>
                        : false
                    }
                    <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Confirme a senha'
                                secureTextEntry={true}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                            />
                        )}
                        name="confirmeSenha"
                    />
                    {errors.confirmeSenha && errors.senha !== errors.confirmeSenha ?
                        <View style={[style.viewErro, { marginBottom: 25 }]} >
                            <Text style={style.textoErro}>Senha divergente</Text>
                        </View>
                        : false}

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={handleSubmit(onSubmit)}
                        style={style.button}
                    ><Text style={style.textButton}>Confirmar</Text></TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
        borderTopLeftRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        // paddingTop:20
    },
    button: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: DefaultStyles.colors.botao,
        width: '64%',
        height: Dimensions.get('window').height / 14,
        borderRadius: RFValue(16),
        borderBottomWidth: 1,
        borderBottomColor: DefaultStyles.colors.tabBar,
        marginTop: RFValue(35)
    },
    textButton: {
        color: DefaultStyles.colors.tabBar,
        fontWeight: 'bold',
        fontSize: 20,
    },
    textoErro: {
        color: '#CD1515',
    },
    viewErro: {
        alignSelf: 'flex-start',
        height: 18,
        marginLeft: RFValue(10),
    }
});

export default FormUser;