import React, { useState } from 'react'
import { Text, View, StyleSheet, FlatList, Dimensions, TouchableWithoutFeedback, TouchableOpacity, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Swiper from 'react-native-swiper'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../components/TitleView'
import { useRealm } from '@realm/react'
import Vehicles from '../../../database/models/Vehicles'
import Models from '../../../database/models/Models'
import Expenses from '../../../database/models/Expenses'
import { DefaultStyles } from '../../DefaultStyles'
import Header from '../../components/Header'
import ButtonCardExpense from '../../components/ButtonCardExpense'
const { height, width } = Dimensions.get('window');

function ViewExpense(props) : JSX.Element {
    const [allVehicle, setAllVehicle] = useState(true)
    const navigation = useNavigation()
    const [expenses, setExpenses] = useState([])
    const [totalValue, setTotalValue] = useState(0)
    const realm = useRealm();
    const [modelCars, setModelCars] = useState(0)
    // const [expensesByCars, setExpensesByCar] = useState([])

    useFocusEffect(React.useCallback(() => {
        async function getExpenses() {
            // const desp = await realm.objects(Expenses.name)
            var desp = []
            const user = await realm.objects('Users').filtered('logged == true')
            const cars = user[0].vehicles
            cars.forEach(vehicle => {
                vehicle.expenses.forEach(expenses => {
                    desp.push(expenses)
                });
             
            });
   
            setExpenses(desp)
            try {
                const array = await desp.map(d => d.totalValue)
                var vt = 0
                for (var i = 0; i < array.length; i++) {
                    vt += array[i]
                }
                setTotalValue(vt)
                // const cars = await realm.objects(Vehicles.name)
                const arrModelCars = cars.map(c => `${c.linkingObjects('Models', 'vehicles')[0].model}`)
                setModelCars(arrModelCars)
            } catch (error) {
                console.log(error)
            }
        }
        getExpenses()
    }, []))

    return (
        <>
            <Header />
            <View style={style.title}>
                <TitleView title="Despesa" />
                <View style={style.espacoCentral}>
                    <View style={{ flex: 1, paddingTop: RFValue(20) }}>
                        {/* BOTão MOSTRAR TODAS DESPESAS OU VEICULO POR VEICULO */}
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                            <TouchableWithoutFeedback onPress={() => setAllVehicle(true)}>
                                <View style={{ marginLeft: RFValue(10), borderBottomColor: allVehicle ? DefaultStyles.colors.botao : DefaultStyles.colors.tabBar, borderBottomWidth: allVehicle ? RFValue(4) : 1, width: '45%' }}>
                                    <Text style={[style.textExpense, style.textButton]}>Todos os veículos</Text>
                                </View>
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback onPress={() => setAllVehicle(false)}>
                                <View style={{ marginRight: 10, borderBottomColor: !allVehicle ? DefaultStyles.colors.botao : DefaultStyles.colors.tabBar, borderBottomWidth: !allVehicle ? RFValue(4) : 1, width: '45%' }}>
                                    <Text style={[style.textExpense, style.textButton]}>Escolher o veículo</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        {/* ALLVEHICLE = TRUE, MOSTRA TODAS AS DESPESAS, CASO CONTRARIO MOSTRA VEICULO POR VEICULO*/}
                        {allVehicle ?
                            <>
                                {/* Todos os Veiculo */}
                                < View style={{ alignSelf: 'center', height: height * 0.06, marginTop: RFValue(20), justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={style.textSummary}>{modelCars.length} veículo{modelCars.length > 1 ? 's' : ''}</Text>
                                    <Text style={[style.textSummary, { fontSize: RFValue(18), paddingBottom: 2 }]}>Total de gastos: R${totalValue.toFixed(2)}</Text>
                                </View>
                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(20), marginLeft: RFValue(15), color: DefaultStyles.colors.tabBar, marginTop: RFValue(10) }}>Detalhe dos gastos:</Text>
                                <FlatList
                                    ListFooterComponent={() => <View style={{ height: height * 0.09 }} />}
                                    keyExtractor={expenses._id}
                                    data={expenses}
                                    renderItem={({ item }) => {
                                        return (
                                            <>
                                                <ButtonCardExpense data={item} />
                                            </>
                                        )
                                    }}
                                />
                            </> :
                            <Swiper containerStyle={style.wrapper} loop={true} showsButtons={true} nextButton={<Text style={style.buttonTextRight}>›</Text>}
                                prevButton={<Text style={style.buttonTextLeft}>‹</Text>} >
                                {/* Escolher o Veiculo */}
                                {
                                    modelCars.map((model, ind) => {
                                        // Vai mostrar a view do swiper por carro

                                        var vt = 0
                                        expenses.map((exp, ind) => {
                                            if (exp.linkingObjects('Vehicles', 'expenses')[0]?.linkingObjects('Models', 'vehicles')[0].model == model) {
                                                vt += exp.totalValue
                                            }
                                        })
                                        
                                        return (
                                            <View>
                                                < View style={{ alignSelf: 'center', borderBottomWidth: 0.5, borderBottomColor: DefaultStyles.colors.tabBar, height: height * 0.06, marginTop: RFValue(20), justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={style.textSummary}>{modelCars[ind]}</Text>
                                                    <Text style={[style.textSummary, { fontSize: RFValue(17), paddingBottom: RFValue(5) }]}>Total de gastos: R${vt.toFixed(2)}</Text>
                                                </View>
                                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(20), marginLeft: RFValue(15), color: DefaultStyles.colors.tabBar, marginTop: RFValue(10) }}>Detalhe dos gastos:</Text>
                                                <ScrollView showsVerticalScrollIndicator style={{ marginBottom: height * 0.12 }}>
                                                    {
                                                        expenses ? expenses.map((exp, ind) => {
                                                            if (exp.linkingObjects('Vehicles', 'expenses')[0]?.linkingObjects('Models', 'vehicles')[0].model == model) {                                                                
                                                                return (
                                                                    <>
                                                                        <ButtonCardExpense data={exp} />
                                                                    </>
                                                                )
                                                            }
                                                        }) : false
                                                    }
                                                </ScrollView>
                                            </View>
                                        )
                                    })
                                }
                            </Swiper>
                        }

                        {/* BOTÃO ACRESCENTAR DESPESA -> Abre modal velocimetro */}
                        <View style={style.button} >
                            <TouchableOpacity onPress={() => navigation.navigate('StackIncludeExpense')}>
                                <Icon name='plus' size={RFValue(35)} color={DefaultStyles.colors.botao} />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View >
        </>
    )
}

const style = StyleSheet.create({
    espacoCentral: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 1,
        borderTopLeftRadius: RFValue(25),
        width: '100%',
    },
    title: {
        flex: 9,
        backgroundColor: DefaultStyles.colors.tabBar,
        alignItems: 'center',
        justifyContent: 'center',

    },
    cardExpense: {
        height: height * 0.14,
        padding: RFValue(10),
        flexDirection: 'row',
        width: '100%'
    },
    icon: {
        width: width * 0.128,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textExpense: {
        fontSize: RFValue(20),
        color: '#333'
    },
    textButton: {
        textAlign: 'center',
        color: DefaultStyles.colors.tabBar,
        fontWeight: '500'
    },
    textSummary: {
        fontSize: RFValue(22),
        color: DefaultStyles.colors.tabBar,
    },
    button: {
        height: height * 0.082,
        width: height * 0.082,
        backgroundColor: DefaultStyles.colors.tabBar,
        borderRadius: height * 0.082 / 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: RFValue(15),
        right: RFValue(15)
    },
    wrapper: {

    },
    buttonTextRight: {
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(60),
        position: 'absolute',
        right: RFValue(50),
        bottom: RFPercentage(height < 700 ? 25 : 28)
    },
    buttonTextLeft: {
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(60),
        position: 'absolute',
        left: RFValue(50),
        bottom: RFPercentage(height < 700 ? 25 : 28)
    },
    image: {
        flex: 1,
        justifyContent: "center",
        width: width,
        height: RFValue(400),
        marginTop: RFValue(20)
    }
})

export default ViewExpense;