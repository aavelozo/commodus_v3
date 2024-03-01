import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView, TouchableWithoutFeedback, Switch, Text } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../../components/TitleView';
import Vehicles from '../../../../database/models/Vehicles';
import { useRealm } from '@realm/react';
import Header from '../../../components/Header';
import ContentContainer from '../../../components/ContentContainer';
import Observations from '../../../components/expenses/Observations';
import SelectVehicle from '../../../components/vehicles/SelectVehicle';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import { TextInput } from 'react-native-paper';
import { DefaultProps } from '../../../DefaultProps';
import { DefaultStyles } from '../../../DefaultStyles';
import Utils from '../../../../controllers/Utils';
import SelectDropdown from 'react-native-select-dropdown';
import Establishment from '../../../components/expenses/Establishment';
import { showNotification, scheduleNotification } from '../../../components/Notification'

const { width, height } = Dimensions.get('window')


/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function MechanicsExpense(props): JSX.Element {

    const despesa = (props?.route?.params || props?.params || {})?.despesa || null;
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicles>(despesa?.linkingObjects('Vehicles', 'expenses')[0] || null);
    const [date, setDate] = useState<any>(despesa?.date || new Date());
    const [dateReminder, setDateReminder] = useState<any>(despesa?.othersdatas.dateReminder || new Date());
    const [km, setKM] = useState<number>(despesa?.linkingObjects('Vehicles', 'expenses')[0]?.km || null);
    const [documentName, setDocumentName] = useState(despesa?.othersdatas?.documentName || null);
    const [serviceList, setServiceList] = useState(['1', '2', '3', '4', '5', '6']);
    const [establishment, setEstablishment] = useState(despesa?.establishment || null);
    const [isEnabled, setIsEnabled] = useState(despesa?.othersdatas.dateReminder ? true : false);
    const [isEnabledEstablishment, setIsEnabledEstablishment] = useState(despesa?.establishment ? true : false);

    const [service, setService] = useState(despesa?.othersdatas?.servide || 'Serviço realizado');
    const [observations, setObservations] = useState(despesa?.observations || null);
    const [isEnabledObservations, setIsEnabledObservations] = useState(despesa?.observations ? true : false);
    const [totalValue, setTotalValue] = useState(despesa?.totalValue || 0);

    const realm = useRealm();

    useEffect(() => {
        setKM(selectedVehicle?.km)
    }, [selectedVehicle])






    //salva no banco, pressionado Concluir do Header aciona essa function
    saveExpense = () => {
        try {
            // if (#componentDateRef.current.state.date && #componentVeiculoRef.current.state.selected && #componentRecorrenciaRef.current.state.recorrenciaSelecionado) {
            if (date) {

                if (typeof despesa != 'undefined' && despesa != null) {
                    realm.write(() => {
                        despesa.type = 'MECHANIC';
                        despesa.date = date;
                        despesa.actualkm = km;
                        despesa.totalValue = totalValue;
                        despesa.observations = observations;
                        despesa.establishment = establishment;
                        despesa.othersdatas = {};
                        despesa.othersdatas.service = service;
                        despesa.othersdatas.dateReminder = isEnabled ? dateReminder : false;
                        if (typeof selectedVehicle != 'undefined' && selectedVehicle != null) {
                            if (despesa.linkingObjects('Vehicles', 'expenses')[0] != selectedVehicle) {
                                Alert.alert('implementar alteracao veiculo');
                            }
                            if (Utils.toNumber(despesa.actualkm) > Utils.toNumber(selectedVehicle.km)) {
                                selectedVehicle.km = Utils.toNumber(despesa.actualkm);
                            }
                        }
                        
                    });
                    scheduleNotification()

                } else {

                    let newDespesa = {
                        type: 'MECHANIC',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        observations: observations,
                        establishment: establishment,
                        othersdatas: {
                            service: service,
                            dateReminder: isEnabled ? dateReminder : false
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
                    scheduleNotification()
                }
                Alert.alert("Salvo", "Dados Salvos com Sucesso", [{ "text": "OK", onPress: () => goBack(), style: "ok" }]);
            } else {
                Alert.alert("Faltam dados essenciais");
            }
        } catch (e) {
            Utils.showError(e);
        }
    }

    //pressionado Cancelar do Header, volta o velocimetro
    goBack = () => {
        props.navigation.goBack(null);
    };

    /**
     * renderiza os componentes auxiliares da view principal
     */


    //render
    return (
        <View style={style.container}>

            <Header withButtons={true} onPressConclude={saveExpense} onPressCancel={goBack} />
            <View style={style.espacoCentral}>
                <TitleView title=' Despesa Mecânica' />

                <ContentContainer >
                    <ScrollView>
                        {/* SELECIONE VEICULO (Caso tenha mais que 1 veiculo) */}
                        <SelectVehicle selected={selectedVehicle} setSelected={setSelectedVehicle} />

                        {/* DATE INPUT */}
                        <DateComponent date={date} setDate={setDate} />

                        {/* QUILOMETRAGEM ATUAL */}
                        <InputKM km={km} setKM={setKM} />

                        <View style={{ height: DefaultStyles.dimensions.height.formElement + RFValue(15), }}>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInputWithDropdown}
                                label='Serviço realizado'
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

                        <View style={{ width: '100%', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
                            <Switch
                                trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                                thumbColor={isEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={enabled => setIsEnabled(enabled)}
                                value={isEnabled}
                            />
                            <TouchableWithoutFeedback
                                onPress={() => setIsEnabled(!isEnabled)}
                            >
                                <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                                    Lembrete revisão do serviço
                                </Text>
                            </TouchableWithoutFeedback>
                        </View>

                        {
                            isEnabled ? <DateComponent date={dateReminder} setDate={setDateReminder} /> : false
                        }



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
};

const style = StyleSheet.create({
    container: {
        backgroundColor: '#202D46',
        flex: 1,
    },
    espacoCentral: {
        backgroundColor: 'black',
        flex: 9,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: "100%",
        backgroundColor: DefaultStyles.colors.fundoInput,
        height: height / 14,
        marginBottom: RFValue(15),
        borderRadius: RFValue(5),
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(20),
        alignSelf: 'center',
        justifyContent: 'center',

    },
    viewExpense: {
        flex: 1,
        width: width * 0.9,
        alignItems: 'center',
    },

});

export default MechanicsExpense;