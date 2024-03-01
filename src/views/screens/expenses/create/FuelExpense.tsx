import React, { useRef, useState, useEffect } from 'react'
import { View, StyleSheet, Alert, Dimensions, ScrollView } from 'react-native'
import { RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../../components/TitleView';
import Header from '../../../components/Header';
import ContentContainer from '../../../components/ContentContainer';
import { DefaultStyles } from '../../../DefaultStyles';
import { TextInput } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import { DefaultProps } from '../../../DefaultProps';
import SelectVehicle from '../../../components/vehicles/SelectVehicle';
import Vehicles from '../../../../database/models/Vehicles';
import DateComponent from '../../../components/expenses/DateComponent';
import InputKM from '../../../components/vehicles/InputKM';
import Establishment from '../../../components/expenses/Establishment';
import Observations from '../../../components/expenses/Observations';
import Utils from '../../../../controllers/Utils';
import { useRealm } from '@realm/react';
const { width, height } = Dimensions.get('window')



//VALORES CALCULADOS
class InputsValoresCalculados extends React.Component {
    constructor(props) {
        super(props);
        state = {
            valorunitario: props.valorunitario,
            litros: props.litros,
            valortotal: props.valortotal
        };
    }
    render() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width * 0.9 }}>
                <TxtInput
                    style={{ ...DefaultStyles.components.formInputElement, ...{ width: width * 0.27 } }}
                    keyboardType='numeric'
                    label='Preço/L'
                    placeholder='R$'
                    placeholderTextColor='#666'
                    //color={DefaultStyles.colors.tabBar}
                    onChangeText={valorunitario => {
                        if (valorunitario.includes(',')) return
                        if (valorunitario.includes('-')) return
                        if (valorunitario.includes(' ')) return
                        if (valorunitario.includes('/')) return
                        if (valorunitario.includes('+')) return
                        if (valorunitario.includes('(')) return
                        if (valorunitario.includes(')')) return
                        if (valorunitario.includes('-')) return
                        if (valorunitario.includes(';')) return
                        if (valorunitario.includes('#')) return
                        if (valorunitario.includes('*')) return
                        setState({
                            valorunitario: valorunitario,
                            valortotal: Utils.toNumber(valorunitario || 0) * Utils.toNumber(state.litros || 0)
                        })
                    }}
                    value={(state.valorunitario || "").toString()}
                    maxLength={6}
                    search={false}
                />
                <TxtInput
                    style={{ ...DefaultStyles.components.formInputElement, ...{ width: width * 0.27 } }}
                    keyboardType='numeric'
                    label='Litros'
                    onChangeText={litros => {
                        if (litros.includes(',')) return
                        if (litros.includes('-')) return
                        if (litros.includes(' ')) return
                        if (litros.includes('/')) return
                        if (litros.includes('+')) return
                        if (litros.includes('(')) return
                        if (litros.includes(')')) return
                        if (litros.includes('-')) return
                        if (litros.includes(';')) return
                        if (litros.includes('#')) return
                        if (litros.includes('*')) return
                        setState({
                            litros: litros,
                            valortotal: Utils.toNumber(state.valorunitario || 0) * Utils.toNumber(litros || 0)
                        })
                    }}
                    value={(state.litros || "").toString()}
                    maxLength={3}
                    search={false}
                />

                <TxtInput
                    style={{ ...DefaultStyles.components.formInputElement, ...{ width: width * 0.27 } }}
                    keyboardType='numeric'
                    label='Valor'
                    placeholder='R$'

                    placeholderTextColor='#666'
                    onChangeText={valortotal => setState({
                        valortotal: valortotal
                    })}
                    maxLength={7}
                    value={(state.valortotal || "").toString()}
                    search={false}
                />

            </View>
        );
    };
};



/******************************************************
** COMPONENTE DA VIEW PRINCIPAL                      **
******************************************************/
function FuelExpense(props): JSX.Element {

    const listaCombustiveis = ['Álcool', 'Gasolina', 'Diesel']
    const despesa = (props?.route?.params || props?.params || {})?.despesa || null;
    const [selectedFuel, setSelectedFuel] = useState(despesa?.demaisdados?.combustivel || props?.fuel || null);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicles>(despesa?.linkingObjects('Vehicles', 'expenses')[0] || null);
    const [date, setDate] = useState<any>(despesa?.date || new Date());
    const [km, setKM] = useState<number>(despesa?.linkingObjects('Vehicles', 'expenses')[0]?.km === 0 ? 0 : (despesa?.linkingObjects('Vehicles', 'expenses')[0]?.km || null));
    const [establishment, setEstablishment] = useState(despesa?.establishment || null);
    const [isEnabledEstablishment, setIsEnabledEstablishment] = useState(despesa?.establishment ? true : false);
    const [observations, setObservations] = useState(despesa?.observations || null);
    const [isEnabledObservations, setIsEnabledObservations] = useState(despesa?.observations ? true : false);
    const [totalValue, setTotalValue] = useState(despesa?.totalValue || 0);
    const [unValue, setUnValue] = useState(despesa?.othersdatas?.unValue || 0);
    const [liters, setLiters] = useState(despesa?.othersdatas?.liters || 0);
    const realm = useRealm();


    useEffect(() => {
        setKM(selectedVehicle?.km)
        setSelectedFuel(selectedVehicle?.preferedFuel)
    }, [selectedVehicle])

    //salva no banco, pressionado Concluir do Header aciona essa function
    function saveExpense(): void {
        try {
            if (totalValue && date && selectedVehicle && selectedFuel) {


                if (typeof despesa != 'undefined' && despesa != null) {
                    realm.write(() => {
                        despesa.type = 'FUEL';
                        despesa.date = date;
                        despesa.actualkm = km;
                        despesa.totalValue = totalValue;
                        despesa.establishment = establishment;
                        despesa.observations = observations;
                        despesa.othersdatas = {};
                        despesa.othersdatas.fuel = selectedFuel;
                        despesa.othersdatas.unValue = unValue;
                        despesa.othersdatas.liters = liters;
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
                        type: 'FUEL',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            fuel: selectedFuel,
                            unValue: unValue,
                            liters: liters
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


    return (
        <View style={style.container}>
            <Header withButtons={true} onPressConclude={saveExpense} onPressCancel={goBack} />
            <View style={style.espacoCentral}>
                <TitleView title=' Despesa Combustível' />

                <ContentContainer >
                    <ScrollView>
                        {/* SELECIONE VEICULO (Caso tenha mais que 1 veiculo) */}
                        <SelectVehicle selected={selectedVehicle} setSelected={setSelectedVehicle} />

                        {/* DATE INPUT */}
                        <DateComponent date={date} setDate={setDate} />

                        {/* QUILOMETRAGEM ATUAL */}
                        <InputKM km={km} setKM={setKM} />

                        {/* FUEL */}
                        <View style={{ height: DefaultStyles.dimensions.height.formElement + RFValue(15), }}>
                            {/* Input: apenas visual, usa o dropdown para alterar o ano */}
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInputWithDropdown}
                                label='Combustível'
                                keyboardType='default'
                                showSoftInputOnFocus={false}
                                value={selectedFuel ? " " : null}
                            />
                            {/* dropdown: usado para selecionar o ano e atualizar o txtinput */}
                            <SelectDropdown
                                {...DefaultProps.selectDropdownWithTextInput}
                                data={listaCombustiveis}
                                onSelect={(selectedItem, index) => {
                                    setSelectedFuel(selectedItem);
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return (
                                        selectedFuel
                                            ? (selectedItem ? selectedItem.toString() : null)
                                            : null
                                    );
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item.toString();
                                }}
                                defaultButtonText={selectedFuel ? selectedFuel.toString() : ' '}
                            />
                        </View>

                        {/* PREÇO/L, LITRO, VALOR */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width * 0.9, marginTop: RFValue(-10) }}>
                            <TextInput
                                {...DefaultProps.textInput}
                                style={[DefaultStyles.textInput, { width: width * 0.27, marginTop: RFValue(12)  }]}
                                keyboardType='numeric'
                                label='Preço/L'
                                placeholder='R$'
                                placeholderTextColor='#666'
                                //color={DefaultStyles.colors.tabBar}
                                onChangeText={valorunitario => {
                                    if (valorunitario.includes(',')) return
                                    if (valorunitario.includes('-')) return
                                    if (valorunitario.includes(' ')) return
                                    if (valorunitario.includes('/')) return
                                    if (valorunitario.includes('+')) return
                                    if (valorunitario.includes('(')) return
                                    if (valorunitario.includes(')')) return
                                    if (valorunitario.includes('-')) return
                                    if (valorunitario.includes(';')) return
                                    if (valorunitario.includes('#')) return
                                    if (valorunitario.includes('*')) return
                                    setUnValue(Utils.toNumber(valorunitario));
                                    setTotalValue(Utils.toNumber(liters) * Utils.toNumber(valorunitario));
                                }}
                                value={(unValue || 0).toString()}
                                maxLength={6}
                                search={false}
                            />
                            <TextInput
                                {...DefaultProps.textInput}
                                style={[DefaultStyles.textInput, { marginLeft: RFValue(15), width: width * 0.27 , marginTop: RFValue(12) }]}
                                keyboardType='numeric'
                                label='Litros'
                                onChangeText={litros => {
                                    if (litros.includes(',')) return
                                    if (litros.includes('-')) return
                                    if (litros.includes(' ')) return
                                    if (litros.includes('/')) return
                                    if (litros.includes('+')) return
                                    if (litros.includes('(')) return
                                    if (litros.includes(')')) return
                                    if (litros.includes('-')) return
                                    if (litros.includes(';')) return
                                    if (litros.includes('#')) return
                                    if (litros.includes('*')) return

                                    setLiters(Utils.toNumber(litros));
                                    setTotalValue(Utils.toNumber(litros) * Utils.toNumber(unValue));
                                }}
                                value={(liters || 0).toString()}
                                maxLength={3}
                                search={false}
                            />

                            <TextInput
                                {...DefaultProps.textInput}
                                style={[DefaultStyles.textInput, { marginLeft: RFValue(15), width: width * 0.27, marginTop: RFValue(12) }]}
                                keyboardType='numeric'
                                label='Valor'
                                placeholder='R$'

                                placeholderTextColor='#666'
                                onChangeText={totalValue => setTotalValue(totalValue)}
                                maxLength={7}
                                value={(totalValue || 0).toString()}
                                search={false}
                            />

                        </View>
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

export default FuelExpense;