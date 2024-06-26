
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert, ToastAndroid, Image } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultStyles } from '../../DefaultStyles';
import ModalAlert from '../../components/ModalAlert';
import Header from '../../components/Header';
import { useRealm } from '@realm/react';
import Utils from '../../../controllers/Utils';
import Vehicles from '../../../database/models/Vehicles';
import AuthController from '../../../controllers/AuthController';
import { useNavigation } from '@react-navigation/native';
import TitleView from '../../components/TitleView';
import ContentContainer from '../../components/ContentContainer';
import FormLayout from '../../components/FormLayout';
import Radio from '../../components/Radio';
import { TextInput } from 'react-native-paper';
import { DefaultProps } from '../../DefaultProps';
import SelectDropdown from 'react-native-select-dropdown';
import { Switch } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { Text } from 'react-native';
import Camera from '../../assets/iconSvg/camera.svg'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Svg } from 'react-native-svg';
import SvgImage from 'react-native-svg/lib/typescript/elements/Image';
const { width, height } = Dimensions.get('window')
const base64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABGdBTUEAALGPC/xhBQAAACBjSFJN
AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAABM
9UlEQVR42u3dd5gV1f3H8fddWHpZOgpIsaAoCtjBhl3BFluiMRo1iZqiP5NojCW2GGMSNZqoMdZY
Yo1i7713REQsFEWQ6tLrcn9/fHcF12XZnXPOnLn3fl7Pcx59Emfu98zOnfO9Z04BERERERERERER
ERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER
ERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER
ERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERER
ERERERERERERERERERERERERERERERERERERERERERERERERERERERGRwpaLHYCIJ2VAP2Bg9T97
AusCHYFWQPPYAUpB+RpYAnwJTAUmA2OBD4FFsYMT8UEJgBSqFsBQYBdgODAEa+hFQloJfAy8CDwP
PANMix2USBJKAKSQtARGAgcD+wJtYwckJW8l8DrwP+Au4PPYAYmIFJNNgMuBOUBeRSWjpQp4BDgQ
aBrgeyAiUjIGYb+qVhL/4a6i0pgyETgZe1UlIiINtCnwKPEf4ioqruVz4Cj0ulVEpF4dgCuB5cR/
cKuo+CyvA9v6+6qIiBSPfYAviP+gVlEJVaqAfwGtPX1nREQKWmvgRuI/nFVU0iofAVv4+PKIuGgS
OwApaRsCTwB7xQ5EJEWdgWOAmcDbsYOR0qUEQGLZC2v814sdiEgETYH9gC7A41jPgEiqlABIDEcB
d6CV+0S2wV4HPIANfhVJjaamSNr+D/gbuvdEVvcSNhB2QexApHToISxpOh64Ft13InV5GdgbJQGS
Ej2IJS3HADege06kPk9j+1wsix2IFD89jCUNuwKPAeUpfNYy4D3gDWzXtjnY1q5fo4eqNEwFtihV
R6AXttPkNtjo/TTcBPw49kUQEXHVn/Cb+EwCLsRWWmseu8JStPoBx2FbAFcR9p7+fezKioi4aAmM
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
qQ9jgw1mxb4CjsqBMz2d6xzU+IuISHgzgN1I2PiDn8aqJ3A7NkugUM0FumC9AUm1x8YUaAqjiIiE
9DxwBLZcf2I+3lNPAYYD55Hu9Dqf2mOJjIv+qPEXEZFw8sAVWO+7U+MP/gaqVQHnAnvi5116DO0c
j28buwIiIlK0xmNd/ifj1lv9Dd8j1Z/G9h0+G1ic6qVx95Xj8dNjV0BERIrOImyc2ubAsz5PHHLA
Wl/gIuAwsj8l7mOsC99FEyyJ6By7MiIiUvCqsHn9ZwKTQnxAyIZ5IvADYABwE566LAK5ycM5qoBb
YldEREQK2nLgRmAT4EgCNf6Q7pS1Ptjqe0fiPuDOp8+wrpVFHs7VGfgAW/tfRESkoaYAtwL/ImCj
v7oYc9bLgF2Bo4D9gYoIMdSYhc1g+MDjOYcCj6FBgSIiUr9KYBTWe/wsKc+ki71oTRNsXf5dq8tQ
oE1Kn/0icDT2qsK3TYGbgS1TqouIiGTffGy12Geqy7vY6+MoYicAdVkP2Ki69Ac6YUlBa2ybRRfz
sV/792EXP6QcsA/WyzGAwl8yWURE1u5rbIneBVgv88fVZTzwRezgRERERERERERERERERERERERE
RERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERE
RERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERE
RERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERE
REREREREREREREREREREREREREREREREREREREREREREisn/A5od5/OXGAT7AAAAJXRFWHRkYXRl
OmNyZWF0ZQAyMDIzLTA2LTA5VDIzOjU0OjM2KzAwOjAwvARY/QAAACV0RVh0ZGF0ZTptb2RpZnkA
MjAyMy0wNi0wOVQyMzo1NDozNiswMDowMM1Z4EEAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjMt
MDYtMDlUMjM6NTQ6MzYrMDA6MDCaTMGeAAAAAElFTkSuQmCC`

/*********************************************************************************************************
 *                                      TELA EDITVEICULO
 **********************************************************************************************************/
function EditVehicle(props: React.PropsWithChildren): JSX.Element {
    const realm = useRealm();
    let vehicle = ((props?.route || {}).params || {}).vehicle || props?.vehicle;//se o objeto veio de uma query do realm, é inalteravel  

    const [brands, setBrands] = useState(realm.objects('Brands'));
    const [showAlert, setShowAlert] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(vehicle?.linkingObjects("Models", "vehicles")[0].linkingObjects("Brands", "models")[0] || null);
    const [models, setModels] = useState(vehicle?.linkingObjects("Models", "vehicles")[0]?.linkingObjects("Brands", "models")[0]?.models || realm.objects('Models'));
    const [selectedModel, setSelectedModel] = useState(vehicle?.linkingObjects("Models", "vehicles")[0] || null);
    const [selectedYear, setSelectedYear] = useState(vehicle?.year || null);
    const [selectedFuel, setSelectedFuel] = useState(vehicle?.preferedFuel || null);
    const [isColorEnabled, setIsColorEnabled] = useState(vehicle?.color || null ? true : false);
    const [color, setColor] = useState(vehicle?.color || null);
    const [km, setKm] = useState(vehicle?.km === 0 ? 0 : (vehicle?.km || null));
    const [idEngineType, setIdEngineType] = useState(vehicle?.idEngineType === 0 ? 0 : (vehicle?.idEngineType || 0));
    const [plate, setPlate] = useState(vehicle?.plate || null);
    const [photo, setPhoto] = useState(vehicle?.photo || null);
    const fuels = ['Álcool', 'Gasolina', 'Diesel'];
    const years = (function () {
        let anos = [];
        let anoFinal = new Date().getFullYear() + 1;
        let anoInicial = anoFinal - 100;
        for (let i = anoFinal; i > anoInicial; i--) {
            anos.push(i);
        }
        return anos;
    }());

    const navigator = useNavigation();



    const saveVehicle = () => {
        try {
            if (!selectedModel || !selectedBrand || !selectedYear || !km || !plate) {
                setShowAlert(true)
            } else {
                if (typeof vehicle != 'undefined' && vehicle != null) {
                    //update
                    realm.write(() => {
                        vehicle.idEngineType = idEngineType;
                        vehicle.year = selectedYear;
                        vehicle.km = Utils.toNumber(km);
                        vehicle.plate = plate;
                        vehicle.color = color;
                        vehicle.preferedFuel = selectedFuel;
                        vehicle.photo = photo;
                    });
                } else {

                    //create
                    vehicle = {
                        idEngineType: idEngineType,
                        year: selectedYear,
                        km: Utils.toNumber(km),
                        plate: plate,
                        color: color,
                        preferedFuel: selectedFuel,
                        photo: photo
                    };
                    realm.write(() => {
                        vehicle = realm.create(Vehicles.name, vehicle);
                        selectedModel.vehicles.push(vehicle);
                        AuthController.getLoggedUser().vehicles.push(vehicle);
                    });
                }
                navigator.navigate('ViewVehicle', { vehicle: vehicle });
            }
        } catch (e) {
            console.log(e);
            Utils.showError(e);
        }
    }



    // mostra alert para selecionar camera ou galeria
    const handleImageCar = () => {
        Alert.alert("IMAGEM", "Selecione o local em que está a foto:", [
            {
                text: 'Galeria',
                onPress: () => pickImageGalery(),
                style: 'default'
            },
            {
                text: 'Câmera',
                onPress: () => pickImageCamera(),
                style: 'default'
            }
        ],
            {
                cancelable: true,
                onDismiss: () => console.log("tratar depois")
            })
    }

    const pickImageGalery = async () => {
        const options = {
            mediaType: 'photo'
        }
        const result = await launchImageLibrary(options)
        if (result.assets) {
            setPhoto(result.assets[0].uri.toString());
            showToast()
            return
        }
    }

    const pickImageCamera = async () => {
        const options = {
            mediaType: 'photo',
            saveToPhotos: false,
            cameraType: 'front',
            quality: 1
        }
        const result = await launchCamera(options)
        if (result.assets) {
            setPhoto(result.assets[0].uri.toString());
            showToast()
            return
        }
    }

    const showToast = () => {
        ToastAndroid.showWithGravity("Imagem salva com sucesso!", ToastAndroid.LONG, ToastAndroid.CENTER, 25, 50);
    };




    return (
        <View style={style.container}>
            {showAlert
                ? <ModalAlert
                    onlyConfirm={false}
                    title="Dados incompletos"
                    message='Preecha todos os campos obrigatórios'
                    textConfirm='Confirmar'
                    textCancel="Cancelar"
                    updateShowAlert={pBool => setShowAlert(pBool)}
                />
                : false
            }
            <Header withButtons={true} onPressConclude={saveVehicle} onPressCancel={() => navigator.goBack()} />
            <View style={style.title}>
                <TitleView title={vehicle !== undefined ? 'Edição de veículo' : 'Cadastro de veículo'} />
                <ContentContainer  >
                    <FormLayout>
                        <Radio
                            enginesTypes={
                                Vehicles.ENGINES_TYPES.map((engineType, index) => { return { label: engineType, value: index } })
                            }
                            selected={idEngineType}
                            funcao={index => setIdEngineType(index)}
                        />

                        {/*SELECT BRAND*/}
                        <View style={{ height: DefaultStyles.dimensions.height.formElement + RFValue(15), }}>
                            {/* Input: apenas visual, usa o dropdown para alterar a marca */}
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInputWithDropdown}
                                label='Marca'
                                showSoftInputOnFocus={false}
                                value={selectedBrand ? " " : null}
                            />
                            {/* dropdown: usado para selecionar marca e atualizar o txtinput */}
                            <SelectDropdown
                                {...DefaultProps.selectDropdownWithTextInput}
                                data={brands}
                                rowTextForSelection={(item, index) => {
                                    return item.brand;
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return selectedItem.brand;
                                }}
                                defaultButtonText={selectedBrand ? selectedBrand?.brand || ' ' : ' '}
                                onSelect={(selectedItem, index) => {
                                    setSelectedBrand(selectedItem);
                                    setModels(selectedItem.models);
                                    setSelectedModel(null);
                                }}
                            />
                        </View>

                        {/*SELECT MODEL*/}
                        <View style={{ height: DefaultStyles.dimensions.height.formElement + RFValue(15), }}>
                            {/* Input: apenas visual, usa o dropdown para alterar o modelo */}
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInputWithDropdown}
                                label='Modelo'
                                showSoftInputOnFocus={false}
                                value={selectedModel ? " " : null}
                            />
                            {/* dropdown: usado para selecionar o modelo e atualizar o txtinput */}
                            <SelectDropdown
                                {...DefaultProps.selectDropdownWithTextInput}
                                data={models}
                                onSelect={(selectedItem, index) => {
                                    setSelectedModel(selectedItem);
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return (
                                        selectedModel
                                            ? (selectedItem ? selectedItem.model : null)
                                            : null
                                    );
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item.model;
                                }}
                                defaultButtonText={selectedModel ? selectedModel?.model || ' ' : ' '}
                            />
                        </View>

                        {/*SELECT YEAR*/}
                        <View style={{ height: DefaultStyles.dimensions.height.formElement + RFValue(15), }}>
                            {/* Input: apenas visual, usa o dropdown para alterar o modelo */}
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInputWithDropdown}
                                label='Ano'
                                showSoftInputOnFocus={false}
                                value={selectedYear ? " " : null}
                            />
                            {/* dropdown: usado para selecionar o modelo e atualizar o txtinput */}
                            <SelectDropdown
                                {...DefaultProps.selectDropdownWithTextInput}
                                data={years}
                                onSelect={(selectedItem, index) => {
                                    setSelectedYear(selectedItem);
                                }}

                                defaultButtonText={selectedYear ? selectedYear.toString() || ' ' : ' '}
                            />
                        </View>

                        {/*SELECT FUEL*/}
                        <View style={{ height: DefaultStyles.dimensions.height.formElement + RFValue(15), }}>
                            {/* Input: apenas visual, usa o dropdown para alterar o modelo */}
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInputWithDropdown}
                                label='Combustível Preferido'
                                showSoftInputOnFocus={false}
                                value={selectedFuel ? " " : null}
                            />
                            {/* dropdown: usado para selecionar o modelo e atualizar o txtinput */}
                            <SelectDropdown
                                {...DefaultProps.selectDropdownWithTextInput}
                                data={fuels}
                                onSelect={(selectedItem, index) => {
                                    setSelectedFuel(selectedItem);
                                }}

                                defaultButtonText={selectedFuel ? selectedFuel.toString() || ' ' : ' '}
                            />
                        </View>

                        {/*TEXTINPUT KM*/}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='numeric'
                            label='Quilometragem atual'
                            onChangeText={km => {
                                if (km.includes('.')) return
                                if (km.includes(',')) return
                                if (km.includes('-')) return
                                if (km.includes(' ')) return
                                setKm(km);
                            }}
                            maxLength={7}
                            defaultValue={(km || '').toString()}
                        />

                        {/*TEXTINPUT PLACA*/}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={[DefaultStyles.textInput, { marginTop: RFValue(7) }]}
                            label='Placa do veículo'
                            onChangeText={plate => setPlate(plate)}
                            defaultValue={plate}
                            maxLength={7}
                        />

                        <View style={DefaultStyles.viewSwitch}>
                            {/* se ativo, liberar input de Cor */}
                            <Switch
                                trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                                thumbColor={isColorEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={enabled => setIsColorEnabled(enabled)}
                                value={isColorEnabled}
                            />
                            <TouchableWithoutFeedback onPress={() => setIsColorEnabled(!isColorEnabled)}>
                                <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                                    Cor
                                </Text>
                            </TouchableWithoutFeedback>
                        </View>
                        {isColorEnabled 
                            ? <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                label='Cor'
                                value={color ? color : null}
                                onChangeText={color => setColor(color)}
                                defaultValue={color}
                                maxLength={15}
                            /> 
                            : null
                        }
                        <TouchableOpacity
                            style={{ alignItems: 'center', marginTop: RFValue(10), alignSelf: 'flex-end' }}
                            onPress={() => {
                                handleImageCar()
                            }}
                        >
                            <Camera width={RFValue(50)} height={RFValue(50)} />
                        </TouchableOpacity >
                    </FormLayout>
                </ContentContainer>
            </View>
        </View >
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
    },
    espacoCentral: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 9,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderTopLeftRadius: RFValue(25),
        width: '100%',
    },
    title: {
        flex: 9,
        backgroundColor: DefaultStyles.colors.tabBar,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: width * 0.9,
        backgroundColor: DefaultStyles.colors.fundoInput,
        height: height / 14,
        marginBottom: 15,
        borderRadius: 5,
        paddingLeft: 5,
        color: DefaultStyles.colors.tabBar,
        fontSize: 20,
        alignSelf: 'center'
    },
    textSwitch: {
        fontSize: 20,
        color: DefaultStyles.colors.tabBar,

    },
    picker: {
        borderWidth: 1,
        height: height / 14,
        width: width * 0.9,
        backgroundColor: DefaultStyles.colors.fundoInput,
        marginBottom: 10,
        borderRadius: 5,
    },
    pickerItem: {
        backgroundColor: DefaultStyles.colors.fundoInput,
        color: DefaultStyles.colors.tabBar,
        marginLeft: 20,
        color: DefaultStyles.colors.tabBar,
        fontSize: 20,
        borderColor: 'transparent',
    }
});

export default EditVehicle;


