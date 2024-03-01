import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, TouchableWithoutFeedback, Alert, Dimensions, Switch, ScrollView } from 'react-native'
import { Checkbox, TextInput } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import Header from '../../../components/Header';
import TitleView from '../../../components/TitleView';
import ContentContainer from '../../../components/ContentContainer';
import SelectVehicle from '../../../components/vehicles/SelectVehicle';
import Vehicles from '../../../../database/models/Vehicles';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import { useRealm } from '@realm/react';
import Utils from '../../../../controllers/Utils';
import Observations from '../../../components/expenses/Observations';
import Establishment from '../../../components/expenses/Establishment';
import SelectDropdown from 'react-native-select-dropdown';
const { width, height } = Dimensions.get('window')




/******************************************************
** COMPONENTE PRINCIPAL                             **
******************************************************/
function AppearanceExpense(props): JSX.Element {
    const despesa = (props?.route?.params || props?.params || {})?.despesa || null;
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicles>(despesa?.linkingObjects('Vehicles', 'expenses')[0] || null);
    const [date, setDate] = useState<any>(despesa?.date || new Date());
    const [km, setKM] = useState<number>(despesa?.linkingObjects('Vehicles', 'expenses')[0]?.km === 0 ? null : (despesa?.linkingObjects('Vehicles', 'expenses')[0]?.km || null));
    const [establishment, setEstablishment] = useState(despesa?.establishment || null);
    const [isEnabledEstablishment, setIsEnabledEstablishment] = useState(despesa?.establishment ? true : false);
    const [observations, setObservations] = useState(despesa?.observations || null);
    const [isEnabledObservations, setIsEnabledObservations] = useState(despesa?.observations ? true : false);
    const [totalValue, setTotalValue] = useState(despesa?.totalValue || 0);
    const [regularWashing, setRegularWashing] = useState((despesa?.othersdatas?.regularWashing) ? true : false);
    const [completeWashing, setCompleteWashing] = useState((despesa?.othersdatas?.completeWashing) ? true : false);

    const [serviceList, setServiceList] = useState(['1', '2', '3', '4', '5', '6']);
    const [service, setService] = useState(despesa?.othersdatas?.service || 'Outros Serviços');
    const realm = useRealm();


    //salva no banco, pressionado Concluir do Header aciona essa function
    saveExpense = () => {
        try {
            if (totalValue && date && selectedVehicle && regularWashing || completeWashing  ) {
                if (typeof despesa != 'undefined' && despesa != null) {
                    realm.write(() => {
                        despesa.type = 'APPEARANCE';
                        despesa.date = date;
                        despesa.actualkm = km;
                        despesa.totalValue = totalValue;
                        despesa.establishment = establishment;
                        despesa.observations = observations;
                        despesa.othersdatas = {};
                        despesa.othersdatas.regularWashing = regularWashing;
                        despesa.othersdatas.completeWashing = completeWashing;
                        despesa.othersdatas.othersServices = service;
                        if (typeof selectedVehicle != 'undefined' && selectedVehicle != null) {
                            if (despesa.linkingObjects('Vehicles', 'expenses')[0] != selectedVehicle) {
                                Alert.alert('implementar alteracao veiculo');
                            }
                            if (Utils.toNumber(despesa.actualkm) > Utils.toNumber(selectedVehicle.km)) {
                                selectedVehicle.km = Utils.toNumber(despesa.actualkm);
                            }
                        }
                    });
                } else {
                    let newDespesa = {
                        type: 'APPEARANCE',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            regularWashing: regularWashing ? 'Lavagem normal' : false,
                            completeWashing: completeWashing ? 'Lavagem completa' : false,
                            othersServices: service
                        }
                    }
                    realm.write(() => {
                        newDespesa = realm.create('Expenses', newDespesa);
                        if (typeof selectedVehicle != 'undefined' && selectedVehicle != null) {
                            selectedVehicle.expenses.push(newDespesa);
                            if (Utils.toNumber(newDespesa.actualkm) > Utils.toNumber(selectedVehicle.km)) {
                                selectedVehicle.km = Utils.toNumber(newDespesa.actualkm);
                            }
                        }
                    });
                }
                Alert.alert("Salvo", "Dados Salvos com Sucesso", [{ "text": "OK", onPress: () => goBack(), style: "ok" }]);
            } else {
                Alert.alert("Faltam dados essenciais");
            }
        } catch (e) {
            Utils.showError(e);
        }
    }

    useEffect(() => {
        setKM(selectedVehicle?.km)
    }, [selectedVehicle])

    //pressionado Cancelar do Header, volta o velocimetro
    goBack = () => {
        props.navigation.goBack(null);
    };


    return (
        <View style={style.container}>
            <Header withButtons={true} onPressConclude={saveExpense} onPressCancel={goBack} />
            <View style={style.espacoCentral}>
                <TitleView title='Despesa aparência' />

                <ContentContainer >
                    <ScrollView>
                        {/* SELECIONE VEICULO (Caso tenha mais que 1 veiculo) */}
                        <SelectVehicle selected={selectedVehicle} setSelected={setSelectedVehicle} />

                        {/* DATE INPUT */}
                        <DateComponent date={date} setDate={setDate} />

                        {/* QUILOMETRAGEM ATUAL */}
                        <InputKM km={km} setKM={setKM} />

                        <View style={style.viewCheckBox}>
                            <Checkbox
                                status={regularWashing ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setRegularWashing(!regularWashing);
                                }}
                            />
                            <TouchableWithoutFeedback onPress={() => setRegularWashing(!regularWashing)}>
                                <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>Lavagem Normal</Text>
                            </TouchableWithoutFeedback>

                        </View>

                        <View style={style.viewCheckBox}>
                            <Checkbox
                                status={completeWashing ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setCompleteWashing(!completeWashing);
                                }}
                            />
                            <TouchableWithoutFeedback onPress={() => setCompleteWashing(!completeWashing)}>
                                <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>Lavagem Completa</Text>
                            </TouchableWithoutFeedback>

                        </View>


                        <View style={{ height: DefaultStyles.dimensions.height.formElement + RFValue(15), }}>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInputWithDropdown}
                                label='Outros serviços'
                                keyboardType='default'
                                showSoftInputOnFocus={false}
                                value={service ? " " : null}
                            />
                            {/* dropdown: usado para selecionar o ano e atualizar o txtinput */}
                            <SelectDropdown
                                {...DefaultProps.selectDropdownWithTextInput}
                                data={serviceList}
                                onSelect={(selectedItem, index) => {
                                    setService(selectedItem);
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return (
                                        service
                                            ? (selectedItem ? selectedItem.toString() : null)
                                            : null
                                    );
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item.toString();
                                }}
                                defaultButtonText={service ? service.toString() : null}
                            />
                        </View>

                        {/* PREÇO TOTAL */}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='numeric'
                            label='Preço Total'
                            onChangeText={value => setTotalValue(Utils.toNumber(value))}
                            value={totalValue.toString()}
                        />

                        <Establishment
                            isEnabled={isEnabledEstablishment}
                            establishment={establishment}
                            setIsEnabled={setIsEnabledEstablishment}
                            setEstablishment={setEstablishment}
                        />



                        <Observations
                            isEnabled={isEnabledObservations}
                            observations={observations}
                            setIsEnabled={setIsEnabledObservations}
                            setObservations={setObservations}
                        />

                    </ScrollView>
                </ContentContainer>
            </View >

        </View>
    );
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#202D46',
        flex: 1,
        overflow: "scroll"
    },
    espacoCentral: {
        backgroundColor: 'black',
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lancamento: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
        alignItems: 'center',
        borderTopLeftRadius: RFValue(25),
        padding: RFValue(10),
        width: '100%',
    },
    input: {
        width: "100%",
        backgroundColor: DefaultStyles.colors.fundoInput,
        height: height * 0.071,
        marginBottom: RFValue(15),
        borderRadius: RFValue(5),
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(20),
        alignSelf: 'center',
        justifyContent: 'center',

    },
    viewCheckBox: {
        // borderWidth: 1,
        width: '65%',

        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: width * 0.03,
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    textCheckBox: {
        fontSize: RFValue(25),
        color: DefaultStyles.colors.tabBar

    },
    inputFiltro: {
        width: width * 0.85,
        height: height * 0.071,
        backgroundColor: DefaultStyles.colors.fundoInput,
        color: DefaultStyles.colors.tabBar,
        borderRadius: RFValue(5),
        fontSize: RFValue(20),
        alignSelf: 'flex-end'
    },
    viewSwitch: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10
    }
});

export default AppearanceExpense;