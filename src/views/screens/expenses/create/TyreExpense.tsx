import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native'
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
const { width, height } = Dimensions.get('window')



/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function DocumentationExpense(props): JSX.Element {

    const despesa = (props?.route?.params || props?.params || {})?.despesa || null;
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicles>(despesa?.linkingObjects('Vehicles', 'expenses')[0] || null);
    const [date, setDate] = useState<any>(despesa?.date || new Date());
    const [km, setKM] = useState<number>(despesa?.linkingObjects('Vehicles', 'expenses')[0]?.km || null);
    const [documentName, setDocumentName] = useState(despesa?.othersdatas?.documentName || null);
    const [recurrenceList, setRecurrenceList] = useState(['Sem recorrência', 'Mensal', 'Trimensal', 'Semestral', 'Anual', 'Bianual']);
    const [recurrence, setRecurrence] = useState(despesa?.othersdatas?.recurrence || 'Sem recorrência');
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
                        despesa.type = 'DOCUMENT';
                        despesa.date = date;
                        despesa.actualkm = km;
                        despesa.totalValue = totalValue;
                        despesa.observations = observations;
                        despesa.othersdatas = {};
                        despesa.othersdatas.documentName = documentName;
                        despesa.othersdatas.recurrence = recurrence;
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
                        type: 'DOCUMENT',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        observations: observations,
                        othersdatas: {
                            documentName: documentName,
                            recurrence: recurrence
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
                <TitleView title=' Despesa Borracharia' />

                <ContentContainer >
                    <ScrollView>
                        {/* SELECIONE VEICULO (Caso tenha mais que 1 veiculo) */}
                        <SelectVehicle selected={selectedVehicle} setSelected={setSelectedVehicle} />

                        {/* DATE INPUT */}
                        <DateComponent date={date} setDate={setDate} />

                        {/* QUILOMETRAGEM ATUAL */}
                        <InputKM km={km} setKM={setKM} />

                        {/* DOCUMENT */}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='default'
                            label='Nome do documento'
                            onChangeText={value => setDocumentName(value)}
                            value={documentName}
                        />

                        {/* PREÇO TOTAL */}
                        <TextInput
                            {...DefaultProps.textInput}
                            style={DefaultStyles.textInput}
                            keyboardType='numeric'
                            label='Valor Total'
                            onChangeText={value => setTotalValue(Utils.toNumber(value))}
                            value={totalValue.toString()}
                        />


                        <View style={{ height: DefaultStyles.dimensions.height.formElement + RFValue(15), }}>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInputWithDropdown}
                                label='Recorrência'
                                keyboardType='default'
                                showSoftInputOnFocus={false}
                                value={recurrence ? " " : null}
                            />
                            {/* dropdown: usado para selecionar o ano e atualizar o txtinput */}
                            <SelectDropdown
                                {...DefaultProps.selectDropdownWithTextInput}
                                data={recurrenceList}
                                onSelect={(selectedItem, index) => {
                                    setRecurrence(selectedItem);
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return (
                                        recurrence
                                            ? (selectedItem ? selectedItem.toString() : null)
                                            : null
                                    );
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item.toString();
                                }}
                                defaultButtonText={recurrence ? recurrence.toString() : null}
                            />
                        </View>

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

export default DocumentationExpense;