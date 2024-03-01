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
const { width, height } = Dimensions.get('window')




/******************************************************
** COMPONENTE PRINCIPAL                             **
******************************************************/
function OilExpense(props) : JSX.Element {
    const despesa = (props?.route?.params || props?.params || {})?.despesa || null;
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicles>(despesa?.linkingObjects('Vehicles', 'expenses')[0] || null);
    const [date, setDate] = useState<any>(despesa?.date || new Date());
    const [km, setKM] = useState<number>(despesa?.linkingObjects('Vehicles', 'expenses')[0]?.km === 0 ? null : (despesa?.linkingObjects('Vehicles', 'expenses')[0]?.km || null));
    const [establishment, setEstablishment] = useState(despesa?.establishment || null);
    const [isEnabledEstablishment, setIsEnabledEstablishment] = useState(despesa?.establishment ? true : false);
    const [observations, setObservations] = useState(despesa?.observations || null);
    const [isEnabledObservations, setIsEnabledObservations] = useState(despesa?.observations ? true : false);
    const [codOil, setCodOil] = useState(despesa?.othersdatas?.codOil || null);
    const [totalValue, setTotalValue] = useState(despesa?.totalValue || 0);
    const [isReminderEnabled, setIsReminderEnabled] = useState((despesa?.othersdatas?.reminderMonths || despesa?.othersdatas?.reminderKM) ? true : false);
    const [reminderMonths, setReminderMonths] = useState(despesa?.othersdatas?.reminderMonths || null);
    const [reminderKM, setReminderKM] = useState(despesa?.othersdatas?.reminderKM || null);
    const [isFiltersEnabled, setIsFiltersEnabled] = useState((despesa?.othersdatas?.oilFilterPrice || despesa?.othersdatas?.fuelFilterPrice || despesa?.othersdatas?.airFilterPrice) ? true : false);
    const [isOilFilterChecked, setIsOilFilterChecked] = useState((despesa?.othersdatas?.oilFilterPrice) ? true : false);
    const [oilFilterPrice, setOilFilterPrice] = useState(despesa?.othersdatas?.oilFilterPrice || null);
    const [isFuelFilterChecked, setIsFuelFilterChecked] = useState((despesa?.othersdatas?.fuelFilterPrice) ? true : false);
    const [fuelFilterPrice, setFuelFilterPrice] = useState(despesa?.othersdatas?.fuelFilterPrice || null);
    const [isAirFilterChecked, setIsAirFilterChecked] = useState((despesa?.othersdatas?.airFilterPrice) ? true : false);
    const [airFilterPrice, setAirFilterPrice] = useState(despesa?.othersdatas?.airFilterPrice || null);
    const [isOilBrandEnabled, setIsOilBrandEnabled] = useState((despesa?.othersdatas?.oilBrand) ? true : false);
    const [oilBrand, setOilBrand] = useState(despesa?.othersdatas?.oilBrand || null);


    const realm = useRealm();

    useEffect(() => {
        setKM(selectedVehicle?.km)
    }, [selectedVehicle])
    
    //salva no banco, pressionado Concluir do Header aciona essa function
    saveExpense = () => {
        try {
            if (totalValue && date && selectedVehicle && codOil) {
                if (typeof despesa != 'undefined' && despesa != null) {
                    realm.write(() => {
                        despesa.type = 'OIL';
                        despesa.date = date;
                        despesa.actualkm = km;
                        despesa.totalValue = totalValue;
                        despesa.establishment = establishment;
                        despesa.observations = observations;
                        despesa.othersdatas = {};
                        despesa.othersdatas.codOil = codOil;
                        despesa.othersdatas.reminderMonths = reminderMonths;
                        despesa.othersdatas.reminderKM = reminderKM;
                        despesa.othersdatas.oilFilterPrice = oilFilterPrice;
                        despesa.othersdatas.fuelFilterPrice = fuelFilterPrice;
                        despesa.othersdatas.airFilterPrice = airFilterPrice;
                        despesa.othersdatas.oilBrand = oilBrand;
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
                        type: 'OIL',
                        date: date,
                        actualkm: km,
                        totalValue: totalValue,
                        establishment: establishment,
                        observations: observations,
                        othersdatas: {
                            codOil : codOil,
                            reminderMonths : reminderMonths,
                            reminderKM : reminderKM,
                            oilFilterPrice : oilFilterPrice,
                            fuelFilterPrice : fuelFilterPrice,
                            airFilterPrice : airFilterPrice,
                            oilBrand : oilBrand
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
                    <TitleView title='Despesa Óleo' />

                    <ContentContainer >
                        <ScrollView>
                            {/* SELECIONE VEICULO (Caso tenha mais que 1 veiculo) */}
                            <SelectVehicle  selected={selectedVehicle} setSelected={setSelectedVehicle}/>

                            {/* DATE INPUT */}
                            <DateComponent date={date} setDate={setDate}/>
                            
                            {/* QUILOMETRAGEM ATUAL */}
                            <InputKM km={km} setKM={setKM}/>

                            {/* CÓDIGO DO ÓLEO */}
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                keyboardType='default'
                                label='Código do óleo'
                                onChangeText={value=>setCodOil(value)}
                                value={codOil}
                            />

                            {/* PREÇO TOTAL */}
                            <TextInput
                                {...DefaultProps.textInput}
                                style={DefaultStyles.textInput}
                                keyboardType='numeric'
                                label='Valor Total'
                                onChangeText={value=>setTotalValue(Utils.toNumber(value))}
                                value={totalValue.toString()}
                            />

                            {/*LEMBRETE*/}
                            <View style={style.viewSwitch}>
                                <Switch
                                    trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                                    thumbColor={isReminderEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={enabled => setIsReminderEnabled(enabled)}
                                    value={isReminderEnabled}
                                />
                                <TouchableWithoutFeedback onPress={() => setIsReminderEnabled(!isReminderEnabled)}>
                                    <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                                        Lembrete próxima troca
                                    </Text>
                                </TouchableWithoutFeedback>

                            </View>
                            {isReminderEnabled ? <>
                                <TextInput
                                    {...DefaultProps.textInput}
                                    style={DefaultStyles.textInput}
                                    label='Validade do óleo (Meses)'
                                    value={reminderMonths ? reminderMonths.toString() : null}
                                    onChangeText={lembreteMeses => setReminderMonths(lembreteMeses)}
                                />
                                <TextInput
                                    {...DefaultProps.textInput}
                                    style={DefaultStyles.textInput}
                                    label='Próxima troca (KM)'
                                    value={reminderKM ? reminderKM.toString() : null}
                                    onChangeText={lembreteKm => setReminderKM(lembreteKm)}
                                />
                            </> : false}

                            {/*FILTRO*/}
                            <View style={style.viewSwitch}>
                                <Switch
                                    trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                                    thumbColor={isFiltersEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={enabled => setIsFiltersEnabled(enabled)}
                                    value={isFiltersEnabled}
                                />
                                <TouchableWithoutFeedback onPress={() => setIsFiltersEnabled(!isFiltersEnabled)}>
                                    <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                                        Troquei o filtro
                                    </Text>
                                </TouchableWithoutFeedback>
                            </View>
                            {isFiltersEnabled ?
                                <View style={style.viewCheckBox}>
                                    <Checkbox
                                        status={isOilFilterChecked ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setIsOilFilterChecked(!isOilFilterChecked);
                                        }}
                                    />
                                    <TouchableWithoutFeedback onPress={() => setIsOilFilterChecked(!isOilFilterChecked)}>
                                        <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>Filtro de óleo</Text>
                                    </TouchableWithoutFeedback>

                                </View> : false}

                            {isOilFilterChecked && isFiltersEnabled ?
                                <TextInput
                                    {...DefaultProps.textInput}
                                    style={DefaultStyles.textInput}
                                    label='Preço do filtro de óleo'
                                    value={oilFilterPrice ? oilFilterPrice.toString() : null}
                                    keyboardType='numeric'
                                    onChangeText={filtroOleo => setOilFilterPrice(Utils.toNumber(filtroOleo))}
                                /> : false}

                            {isFiltersEnabled ?
                                <View style={style.viewCheckBox}>
                                    <Checkbox
                                        status={isFuelFilterChecked ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setIsFuelFilterChecked(!isFuelFilterChecked);
                                        }}
                                    />
                                    <TouchableWithoutFeedback onPress={() => setIsFuelFilterChecked(!isFuelFilterChecked)}>
                                        <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>Filtro de combustível</Text>
                                    </TouchableWithoutFeedback>
                                </View> : false}

                            {isFuelFilterChecked && isFiltersEnabled ?
                                <TextInput
                                    {...DefaultProps.textInput}
                                    style={DefaultStyles.textInput}
                                    label='Preço do filtro de combustível'
                                    value={fuelFilterPrice ? fuelFilterPrice.toString() : null}
                                    keyboardType='numeric'
                                    onChangeText={filtroCombustivel => setFuelFilterPrice(Utils.toNumber(filtroCombustivel))}
                                /> : false}

                            {isFiltersEnabled ?
                                <View style={style.viewCheckBox}>
                                    <Checkbox
                                        status={isAirFilterChecked ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            setIsAirFilterChecked(!isAirFilterChecked);
                                        }}
                                    />
                                    <TouchableWithoutFeedback onPress={() => setIsAirFilterChecked(!isAirFilterChecked)}>
                                        <Text style={[style.textCheckBox, { fontSize: DefaultStyles.dimensions.defaultLabelFontSize }]}>Filtro de ar</Text>
                                    </TouchableWithoutFeedback>
                                </View> : false}

                            {isAirFilterChecked && isFiltersEnabled ?
                                <TextInput
                                    {...DefaultProps.textInput}
                                    style={DefaultStyles.textInput}
                                    label='Preço do filtro de ar'
                                    value={airFilterPrice ? airFilterPrice.toString() : null}
                                    keyboardType='numeric'
                                    onChangeText={filtroAr => setAirFilterPrice(Utils.toNumber(filtroAr))}
                                /> : false}



                            <Establishment
                                isEnabled={isEnabledEstablishment}
                                establishment={establishment}
                                setIsEnabled={setIsEnabledEstablishment}
                                setEstablishment={setEstablishment}
                            />                       

                            <View style={{ width: '100%', alignItems: 'flex-start', flexDirection: 'row', marginBottom: 10 }}>
                                <Switch
                                    trackColor={{ false: "#767577", true: "rgba(0,124,118,0.6)" }}
                                    thumbColor={isOilBrandEnabled ? "#007C76" : DefaultStyles.colors.fundoInput}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={enabled => setIsOilBrandEnabled(enabled)}
                                    value={isOilBrandEnabled}
                                />
                                <TouchableWithoutFeedback onPress={() => setIsOilBrandEnabled(!isOilBrandEnabled)}>
                                    <Text style={{ fontSize: DefaultStyles.dimensions.defaultLabelFontSize, color: DefaultStyles.colors.tabBar }}>
                                        Marca
                                    </Text>
                                </TouchableWithoutFeedback>
                            </View>

                            {
                                isOilBrandEnabled ? <TextInput
                                    {...DefaultProps.textInput}
                                    style={DefaultStyles.textInput}
                                    label='Marca do óleo'
                                    onChangeText={marcaOleo => setOilBrand(marcaOleo)}
                                    value={oilBrand}
                                /> : false
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
}

const style = StyleSheet.create({
    container: {
        backgroundColor: '#202D46',
        flex: 1,
        overflow:"scroll"
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

export default OilExpense;