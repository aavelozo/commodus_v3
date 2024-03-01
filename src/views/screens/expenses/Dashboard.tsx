import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Text, View, StyleSheet, FlatList, Dimensions, TouchableWithoutFeedback, ActivityIndicator, ScrollView, Modal } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Velo from '../../assets/iconSvg/velo.svg'
import Oil from '../../assets/iconSvg/oil.svg'
import Fuel from '../../assets/iconSvg/fuel.svg'
import Seguro from '../../assets/iconSvg/seguro.svg'
import Chave from '../../assets/iconSvg/chaveinglesa.svg'
import Outros from '../../assets/iconSvg/outros.svg'
import Pneu from '../../assets/iconSvg/pneu.svg'
import Aparencia from '../../assets/iconSvg/car-wash.svg'
import Media from '../../assets/iconSvg/media.svg'
import Swiper from 'react-native-swiper'
import Header from '../../components/Header'
import { VictoryLine, VictoryChart, VictoryTheme, VictoryPie, VictoryLabel, VictoryAxis, VictoryBar } from "victory-native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import TitleView from '../../components/TitleView'
import moment from 'moment'
import 'moment/locale/pt-br'
import { useRealm } from '@realm/react'
import { DefaultStyles } from '../../DefaultStyles'
const { height, width } = Dimensions.get('window')

function Dashboard(props): JSX.Element {
    // const [expenses, setExpenses] = useState([])
    // const [cars, setCars] = useState(0)
    // const [modelCars, setModelCars] = useState(0)
    const [expensesByCars, setExpensesByCar] = useState([])
    const [expensesByMonth, setExpensesByMonth] = useState([])
    const [expensesByMonthBefore, setExpensesByMonthBefore] = useState([])
    const [expensesByMonthWithDate, setExpensesByMonthWithDate] = useState([])
    const [showLoading, setShowLoading] = useState(true)
    const [months, setMonths] = useState([])
    // const showLoading = useRef(false)
    const [changeOil, setChangeOil] = useState([])
    const indexDateFlatlist = useRef(0)
    // const dataAtual = moment(new Date()).format("MM/YY")
    const [date, setDate] = useState(moment(new Date()).format("MM/YY"))
    const realm = useRealm();


    const anoatual = moment(new Date()).format("YY")

    // ["#04FFF0", "#F4FF00","#007C76","#FC6B1C", "#FF0404", "#04FF2C", "#DC04FF"]

    const dados = [{ text: 'jan/23', id: '01/23' }, { text: 'fev/23', id: '02/23' }, { text: 'mar/23', id: '03/23' }, { text: 'abr/23', id: '04/23' }, { text: 'mai/23', id: '05/23' }, { text: 'jun/23', id: '06/23' }, { text: 'jul/23', id: '07/23' }, { text: 'ago/23', id: '08/23' }, { text: 'set/23', id: '09/23' }, { text: 'out/23', id: '10/23' }, { text: 'nov/23', id: '11/23' }, { text: 'dez/23', id: '12/23' }, { text: 'jan/24', id: '01/24' }, { text: 'fev/24', id: '02/24' }]


    const mesesAbreviados = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    

    const montaMeses = (anoInicio, quantidadeAnos, mesesAbreviados) => {
        var meses = []
        var anoAtual = anoInicio
        for (var i = Number(anoInicio); i <= Number(anoInicio) + quantidadeAnos; i++) {

            if (i > anoInicio) anoAtual = Number(anoAtual) + 1
            for (var ind = 0; ind < mesesAbreviados.length; ind++) {
                var numeroMes = ind + 1
                if (ind == 0) {
                    meses.push({ text: `${mesesAbreviados[ind]}/${anoAtual}`, id: `0${numeroMes}/${anoAtual}` })
                } else {
                    meses.push({ text: `${mesesAbreviados[ind]}/${anoAtual}`, id: `${ind < 9 ? '0' + (ind + 1) : (ind + 1)}/${anoAtual}` })
                }
            }
        }       
        setMonths(meses)
    }

    const getExpensesThisUser = async () => {
        var desp = []
        const user = await realm.objects('Users').filtered('logged == true')
        // console.log(user[0].vehicles[0].expenses)
        user[0].vehicles.forEach(vehicle => {
            vehicle.expenses.forEach(expenses => {
                desp.push(expenses)
            });

        });
        return desp
    }



    useEffect(() => {

        console.log('começo useEffect')
        setShowLoading(true)
        async function getExpenses() {


            const desp = await getExpensesThisUser()
            var arrdespesasmes = []
            var arrdespesasmesanterior = []
            var arrdespesasdatacompleta = []
            var proximatroca = []
            montaMeses(2022, 5, mesesAbreviados)
            desp.map((d, ind) => {
                if (d.othersdatas.reminderKM != null) {
                    proximatroca.push(d.othersdatas.reminderKM)
                }

                var dateslice = `${date.slice(0, 2)}/01/${date.slice(3, 5)}`
                var datepreviousmonth = moment(dateslice).subtract(1, 'months').format('DD/MM/YYYY')
                var dateformat = datepreviousmonth.slice(3, 6) + datepreviousmonth.slice(8, 10) //pegando apenas mes e ano do mes anterior (formato americano)
                if (date == moment(d.date).format("MM/YY")) {
                    arrdespesasdatacompleta.push({
                        data: moment(d.date).format("DD/MM/YY"),
                        totalValue: d.totalValue,
                        model: `${d.linkingObjects('Vehicles', 'expenses')[0]?.linkingObjects('Models', 'vehicles')[0].model}`
                    })
                    arrdespesasmes.push({
                        data: moment(d.date).format("MM/YY"),
                        type: d.type,
                        totalValue: d.totalValue,
                        model: `${d.linkingObjects('Vehicles', 'expenses')[0]?.linkingObjects('Models', 'vehicles')[0].model}`
                    })
                }
                if (dateformat == moment(d.date).format("MM/YY")) {
                    arrdespesasmesanterior.push({
                        data: moment(d.date).format("MM/YY"),
                        type: d.type,
                        totalValue: d.totalValue,
                        model: `${d.linkingObjects('Vehicles', 'expenses')[0]?.linkingObjects('Models', 'vehicles')[0].model}`
                    })
                }
            })
            setChangeOil(proximatroca)
            setExpensesByMonthWithDate(arrdespesasdatacompleta)
            setExpensesByMonth(arrdespesasmes)
            setExpensesByMonthBefore(arrdespesasmesanterior)

        }
        getExpenses()
        setTimeout(() => {
            setShowLoading(false)
        }, 300)
        console.log(showLoading)

        console.log('fim useEffect')


    }, [date])


    useFocusEffect(useCallback(() => {
        indexDateFlatlist.current = dados.map(dado => dado.id).indexOf(date)

        async function getExpenses() {

            setExpensesByCar('')
            // const desp = realm.objects('Expenses')
            const desp = await getExpensesThisUser()
            const user = realm.objects('Users').filtered('logged == true')
            const carros = user[0].vehicles
            const arrModelCars = carros.map(c => `${c.linkingObjects('Models', 'vehicles')[0].model}`)
            var arr = []
            try {
                var vt = 0
                for (let index = 0; index < arrModelCars.length; index++) {
                    var arrExpensesByCar = []
                    var objCar = {}
                    desp?.map((d, ind) => {
                        if (arrModelCars[index] == d.linkingObjects('Vehicles', 'expenses')[0]?.linkingObjects('Models', 'vehicles')[0].model) arrExpensesByCar.push(d)
                    })
                    objCar.model = arrModelCars[index] //nome model
                    objCar.despesas = arrExpensesByCar
                    objCar.carro = carros[index] //objeto carro
                    arr.push(objCar)
                }
                setExpensesByCar(arr)

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
                {/* barra de rolagem no topo, onde mostra as datas */}
                <View style={{ flex: 1, width: '100%' }}>

                    <FlatList
                        horizontal={true}
                        data={dados}
                        keyExtractor={item => item.id}
                        initialScrollIndex={indexDateFlatlist.current - 1}
                        onScrollToIndexFailed={info => {
                            const wait = new Promise(resolve => setTimeout(resolve, 500));
                            wait.then(() => {
                                //   flatList.current?.scrollToIndex({ index: info.index, animated: true });
                            });
                        }}
                        renderItem={({ item }) => {
                            const actualDate = { borderBottomWidth: 2, borderColor: '#fff' }
                            return (
                                <View style={{ width: width * 0.4, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableWithoutFeedback onPress={() => {
                                        setShowLoading(true)
                                        setDate(item.id)
                                    }}>
                                        <Text style={[date == item.id ? actualDate : false, { color: '#fff' }]}>{item.text}</Text>
                                    </TouchableWithoutFeedback>
                                </View>
                            )
                        }}
                    />
                </View>
                <Modal
                    animationType="none"
                    transparent={true}
                    visible={showLoading}
                // onRequestClose={() => {
                //     setShowLoading(!showLoading);
                // }}
                >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color={DefaultStyles.colors.tabBar} />
                    </View>
                </Modal>

                <View style={style.espacoCentral}>


                    <View style={{ flex: 1, paddingTop: RFValue(20) }}>



                        <Swiper containerStyle={style.wrapper} loop={true} showsButtons={true} nextButton={<Text style={style.buttonTextRight}>›</Text>}
                            prevButton={<Text style={style.buttonTextLeft}>‹</Text>} >
                            {/* mostra a visualizaçao por carro */}
                            {expensesByCars ?

                                expensesByCars.map((car, ind) => {


                                    var datames01 = moment(new Date()).format('MM/YYYY')
                                    var datames02 = moment(new Date()).subtract(1, 'months').format('MM/YYYY')
                                    var datames03 = moment(new Date()).subtract(2, 'months').format('MM/YYYY')
                                    var datames04 = moment(new Date()).subtract(3, 'months').format('MM/YYYY')
                                    var datames05 = moment(new Date()).subtract(4, 'months').format('MM/YYYY')
                                    var datames06 = moment(new Date()).subtract(5, 'months').format('MM/YYYY')
                                    var datames07 = moment(new Date()).subtract(6, 'months').format('MM/YYYY')
                                    var datames08 = moment(new Date()).subtract(7, 'months').format('MM/YYYY')
                                    var datames09 = moment(new Date()).subtract(8, 'months').format('MM/YYYY')
                                    var datames10 = moment(new Date()).subtract(9, 'months').format('MM/YYYY')
                                    var datames11 = moment(new Date()).subtract(10, 'months').format('MM/YYYY')
                                    var datames12 = moment(new Date()).subtract(11, 'months').format('MM/YYYY')

                                    var mes01 = 0
                                    var mes02 = 0
                                    var mes03 = 0
                                    var mes04 = 0
                                    var mes05 = 0
                                    var mes06 = 0
                                    var mes07 = 0
                                    var mes08 = 0
                                    var mes09 = 0
                                    var mes10 = 0
                                    var mes11 = 0
                                    var mes12 = 0

                                    car.despesas.map(desp => {
                                        var dateDesp = moment(desp.data).format('MM/YYYY')


                                        if (datames01 == dateDesp) {
                                            mes01 += desp.totalValue
                                        } else if (datames02 == dateDesp) {
                                            mes02 += desp.totalValue
                                        } else if (datames03 == dateDesp) {
                                            mes03 += desp.totalValue
                                        } else if (datames04 == dateDesp) {
                                            mes04 += desp.totalValue
                                        } else if (datames05 == dateDesp) {
                                            mes05 += desp.totalValue
                                        } else if (datames06 == dateDesp) {
                                            mes06 += desp.totalValue
                                        } else if (datames07 == dateDesp) {
                                            mes07 += desp.totalValue
                                        } else if (datames08 == dateDesp) {
                                            mes08 += desp.totalValue
                                        } else if (datames09 == dateDesp) {
                                            mes09 += desp.totalValue
                                        } else if (datames10 == dateDesp) {
                                            mes10 += desp.totalValue
                                        } else if (datames11 == dateDesp) {
                                            mes11 += desp.totalValue
                                        } else if (datames12 == dateDesp) {
                                            mes12 += desp.totalValue
                                        }
                                    })
                                    var gastosano = [{ x: datames01, y: mes01 }, { x: datames02, y: mes02 }, { x: datames03, y: mes03 }, { x: datames04, y: mes04 },
                                    { x: datames05, y: mes05 }, { x: datames06, y: mes06 }, { x: datames07, y: mes07 }, { x: datames08, y: mes08 },
                                    { x: datames09, y: mes09 }, { x: datames10, y: mes10 }, { x: datames11, y: mes11 }, { x: datames12, y: mes12 },]
                                    var arrDespesas = []
                                    var arrDespesasFluxoNew = []
                                    var gastodomes = 0
                                    var gastodomesanterior = 0
                                    var gastoCombustivel = 0
                                    var gastoOleo = 0
                                    var gastoDocumentos = 0
                                    var gastoMecanica = 0
                                    var gastoBorracharia = 0
                                    var gastoAparencia = 0
                                    var gastoOutros = 0

                                    expensesByMonthBefore.map(exp => {
                                        if (exp.model == car.model) {
                                            gastodomesanterior += exp.totalValue
                                        }
                                    })

                                    expensesByMonth.map((exp, ind) => {
                                        if (exp.model == car.model) {
                                            if (exp.type == 'FUEL') {
                                                gastoCombustivel += exp.totalValue
                                            } else if (exp.type == 'OIL') {
                                                gastoOleo += exp.totalValue
                                            } else if (exp.type == 'MECHANIC') {
                                                gastoMecanica += exp.totalValue
                                            } else if (exp.type == 'DOCUMENT') {
                                                gastoDocumentos += exp.totalValue
                                            } else if (exp.type == 'RUBBER') {
                                                gastoBorracharia += exp.totalValue
                                            } else if (exp.type == 'APPEARENCE') {
                                                gastoAparencia += exp.totalValue
                                            } else if (exp.type == 'OTHERS') {
                                                gastoOutros += exp.totalValue
                                            } else {
                                                console.log('erro')
                                            }
                                            gastodomes += exp.totalValue
                                        }
                                    })
                                    var totalizador01 = 0
                                    var totalizador05 = 0
                                    var totalizador10 = 0
                                    var totalizador15 = 0
                                    var totalizador20 = 0
                                    var totalizador25 = 0
                                    var totalizador31 = 0
                                    expensesByMonthWithDate.map((exp, ind) => {
                                        if (exp.model == car.model) {
                                            var dateFormated = exp.data.slice(0, 2)
                                            if (Number(dateFormated) <= 1) {
                                                totalizador01 += exp.totalValue
                                            } else if (Number(dateFormated) <= 5) {
                                                totalizador05 += exp.totalValue
                                            } else if (Number(dateFormated) <= 10) {
                                                totalizador10 += exp.totalValue
                                            } else if (Number(dateFormated) <= 15) {
                                                totalizador15 += exp.totalValue
                                            } else if (Number(dateFormated) <= 20) {
                                                totalizador20 += exp.totalValue
                                            } else if (Number(dateFormated) <= 25) {
                                                totalizador25 += exp.totalValue
                                            } else if (Number(dateFormated) <= 31) {
                                                totalizador31 += exp.totalValue
                                            }
                                        }
                                    })
                                    arrDespesasFluxoNew.push({
                                        x: `01/${date.slice(0, 2)}`, y: totalizador01
                                    }, {
                                        x: `05/${date.slice(0, 2)}`, y: totalizador05 + totalizador01
                                    }, {
                                        x: `10/${date.slice(0, 2)}`, y: totalizador10 + totalizador05 + totalizador01
                                    }, {
                                        x: `15/${date.slice(0, 2)}`, y: totalizador15 + totalizador10 + totalizador05 + totalizador01
                                    }, {
                                        x: `20/${date.slice(0, 2)}`, y: totalizador20 + totalizador15 + totalizador10 + totalizador05 + totalizador01
                                    }, {
                                        x: `25/${date.slice(0, 2)}`, y: totalizador25 + totalizador20 + totalizador15 + totalizador10 + totalizador05 + totalizador01
                                    }, {
                                        x: `31/${date.slice(0, 2)}`, y: totalizador31 + totalizador25 + totalizador20 + totalizador15 + totalizador10 + totalizador05 + totalizador01
                                    })




                                    // arrDespesas.push({ x: 'Combustível', y: gastoCombustivel, color: "#04FF2C" }, { x: 'Óleo', y: gastoOleo, color: "#FF0404" }, { x: 'Documento', y: gastoDocumentos, color: "#F4FF00" }, { x: 'Mecânica', y: gastoMecanica, color: "#DC04FF" }, { x: 'Aparência', y: gastoAparencia, color: "#04FFF0" }, { x: 'Outros', y: gastoOutros, color: "#007C76" }, { x: 'Borracharia', y: gastoBorracharia, color: "#0f2054" })
                                    arrDespesas.push({ x: 'Combustível', y: gastoCombustivel, color: "#FFA3A5" }, { x: 'Óleo', y: gastoOleo, color: "#B8DBF2" }, { x: 'Documento', y: gastoDocumentos, color: "#9BC995" }, { x: 'Mecânica', y: gastoMecanica, color: "#FFD38E" }, { x: 'Aparência', y: gastoAparencia, color: "#D0A9F5" }, { x: 'Outros', y: gastoOutros, color: "#e9f143" }, { x: 'Borracharia', y: gastoBorracharia, color: "#F8B6D3" })

                                    return (

                                        <View key={car.model}>
                                            < View style={{ alignSelf: 'center', borderBottomWidth: 0.5, borderBottomColor: DefaultStyles.colors.tabBar, height: height * 0.06, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={style.textSummary}>{car.model}</Text>
                                                <Text style={[style.textSummary, { fontSize: RFValue(16), paddingBottom: RFValue(5) }]}>Gastos do mês: R${gastodomes.toFixed(2)}</Text>

                                            </View>
                                            <ScrollView>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: RFValue(10), }}>
                                                    <Velo width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                                                    <Text style={{ fontWeight: 'bold', fontSize: RFValue(17), marginLeft: RFValue(5), color: DefaultStyles.colors.tabBar, }}>Odômetro: </Text>
                                                    <Text style={{ fontSize: RFValue(17), color: DefaultStyles.colors.tabBar, }}>{car.carro.km}</Text>
                                                </View>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', }}>
                                                    <Media width={RFValue(25)} height={RFValue(45)} fill={DefaultStyles.colors.tabBar} />
                                                    <Text style={{ fontWeight: 'bold', fontSize: RFValue(17), marginLeft: RFValue(5), color: DefaultStyles.colors.tabBar, }}>Média: </Text>
                                                    <Text style={{ fontSize: RFValue(17), color: DefaultStyles.colors.tabBar, }}>10km / litro</Text>
                                                </View>
                                                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', }}>
                                                    <Oil width={RFValue(21)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                                                    <Text style={{ fontWeight: 'bold', fontSize: RFValue(17), marginLeft: RFValue(5), color: DefaultStyles.colors.tabBar, }}>Próx. troca de óleo: </Text>
                                                    <Text style={{ fontSize: RFValue(17), color: DefaultStyles.colors.tabBar, }}>{changeOil == undefined || changeOil == null || Number(changeOil) <= 0 ? '--' : changeOil[0]}km</Text>
                                                </View>

                                                {/* grafico rosca n°1 - comparativo de gastos*/}
                                                {gastodomes > 0 || gastodomesanterior > 0 ?
                                                    <View style={{ borderTopWidth: 1, borderBottomWidth: 1, marginTop: RFValue(10), alignItems: "center" }}>
                                                        {/* <Text style={{ alignSelf: 'flex-start', fontSize: RFValue(14), color: DefaultStyles.colors.tabBar, }}>Comparativo dos gastos</Text> */}
                                                        <Text style={style.titleGraph}>Comparativo dos gastos</Text>

                                                        <View style={{ flexDirection: 'row', marginTop: RFValue(10) }}>
                                                            <View style={{ paddingTop: RFValue(20), alignItems: 'center' }}>
                                                                <Text style={{ fontSize: RFValue(14), color: DefaultStyles.colors.tabBar, }}>mês anterior: </Text>
                                                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(15), color: DefaultStyles.colors.tabBar, }}>R${gastodomesanterior.toFixed(2)}</Text>
                                                            </View>
                                                            <View style={{ alignItems: 'center' }}>
                                                                <VictoryPie
                                                                    innerRadius={70}

                                                                    cornerRadius={({ datum }) => 3}
                                                                    height={180}
                                                                    width={200}
                                                                    startAngle={-90}
                                                                    endAngle={90}
                                                                    labels={({ datum }) => { }}
                                                                    colorScale={["#007C76", "#CD1515"]}
                                                                    data={[
                                                                        { x: "anterior", y: gastodomesanterior },
                                                                        { x: "atual", y: gastodomes },
                                                                    ]}

                                                                //  
                                                                />
                                                                {gastodomesanterior > gastodomes ?
                                                                    <View style={{ position: 'absolute', top: RFValue(80), alignItems: 'center' }}>
                                                                        <Text style={{ fontSize: RFValue(16), color: DefaultStyles.colors.tabBar, }}>Redução de gastos</Text>
                                                                        <Text style={{ fontWeight: 'bold', fontSize: RFValue(17), color: DefaultStyles.colors.tabBar, }}>{(100 - ((gastodomes / gastodomesanterior) * 100)).toFixed(2)}%</Text>

                                                                    </View> :
                                                                    <View style={{ position: 'absolute', top: RFValue(100), alignItems: 'center' }}>
                                                                        <Text style={{ fontSize: RFValue(16), color: DefaultStyles.colors.tabBar, }}>Aumento de gastos</Text>
                                                                        {
                                                                            gastodomesanterior == 0 ?
                                                                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(17), color: DefaultStyles.colors.tabBar, }}>--</Text>
                                                                                :
                                                                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(17), color: DefaultStyles.colors.tabBar, }}>{(((gastodomes - gastodomesanterior) / gastodomesanterior) * 100).toFixed(2)}%</Text>
                                                                        }


                                                                    </View>}
                                                            </View>
                                                            <View style={{ paddingTop: RFValue(20), alignItems: 'center' }}>
                                                                <Text style={{ fontSize: RFValue(14), color: DefaultStyles.colors.tabBar, }}>mês atual: </Text>
                                                                <Text style={{ fontWeight: 'bold', fontSize: RFValue(15), color: DefaultStyles.colors.tabBar, }}>R${gastodomes.toFixed(2)}</Text>
                                                            </View>
                                                        </View >



                                                    </View>
                                                    : false
                                                }


                                                {/* grafico de linha n°2 - fluxo de caixa*/}
                                                {
                                                    gastodomes > 0 ?
                                                        <View style={{ borderBottomWidth: 1, marginTop: RFValue(10), alignItems: "center" }}>
                                                            <Text style={style.titleGraph}>Fluxo de caixa</Text>

                                                            <VictoryChart
                                                                theme={VictoryTheme.material}
                                                                minDomain={{ y: 0 }}
                                                            >
                                                                <VictoryLine
                                                                    style={{
                                                                        data: { stroke: "#c43a31", strokeWidth: 2 }
                                                                    }}
                                                                    animate={{
                                                                        duration: 1000,
                                                                        onLoad: { duration: 1000 }
                                                                    }}

                                                                    interpolation={"linear"}
                                                                    x={arrDespesasFluxoNew.x}
                                                                    y={arrDespesasFluxoNew.y}
                                                                    data={arrDespesasFluxoNew}
                                                                />

                                                                <VictoryAxis
                                                                    dependentAxis
                                                                    tickFormat={(x) => `${x}`}
                                                                />
                                                                <VictoryAxis
                                                                    // tickFormat={total.name}
                                                                    tickLabelComponent={<VictoryLabel angle={-30} textAnchor="end" style={{ fontSize: 8 }} />}
                                                                />

                                                            </VictoryChart>
                                                        </View>
                                                        : false
                                                }


                                                {/* grafico de pizza n°3 - porcentagem dos gastos */}
                                                {
                                                    gastodomes > 0 ?
                                                        <View style={{ borderBottomWidth: 1, marginTop: RFValue(10), alignItems: "flex-start" }}>
                                                            <Text style={style.titleGraph}>Porcentagem dos gastos</Text>


                                                            <VictoryPie
                                                                innerRadius={60}
                                                                height={350}
                                                                colorScale={arrDespesas.map(({ color }) => color)}
                                                                data={arrDespesas}
                                                                animate={{
                                                                    duration: 2000
                                                                }}

                                                                // padding={{ left: 10, top: 50 }}
                                                                // containerComponent={<VictoryContainer responsive={true} width={200}
                                                                //     style={{ alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'flex-end' }} />}
                                                                labelRadius={({ innerRadius }) => innerRadius + RFValue(25)}
                                                                labels={({ datum }) => {
                                                                    if (datum.y > 0) {
                                                                        return `${(datum.y / gastodomes * 100).toFixed(0)}%`
                                                                    } else {
                                                                        return
                                                                    }
                                                                }}
                                                                cornerRadius={({ datum }) => 5}
                                                            />
                                                            {
                                                                arrDespesas.length > 0 ?
                                                                    arrDespesas.map((data) => {
                                                                        var Icon = ''
                                                                        if (data.x == 'Borracharia') {
                                                                            Icon = <Pneu width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                                                                        } else if (data.x == 'Combustível') {
                                                                            Icon = <Fuel width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                                                                        } else if (data.x == 'Mecânica') {
                                                                            Icon = <Chave width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                                                                        } else if (data.x == 'Óleo') {
                                                                            Icon = <Oil width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                                                                        } else if (data.x == 'Documento') {
                                                                            Icon = <Seguro width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                                                                        } else if (data.x == 'Outros') {
                                                                            Icon = <Outros width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                                                                        } else if (data.x == 'Aparência') {
                                                                            Icon = <Aparencia width={RFValue(25)} height={RFValue(25)} fill={DefaultStyles.colors.tabBar} />
                                                                        }
                                                                        return (
                                                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: RFValue(20), marginBottom: RFValue(10) }}>
                                                                                {Icon}
                                                                                <View style={{ borderWidth: 1, height: RFValue(12), width: RFValue(12), backgroundColor: data.color, marginHorizontal: RFValue(10) }}></View>
                                                                                <Text style={[style.textButton, style.textLegend]}>{data.x}: R${data.y.toFixed(2)}  </Text>
                                                                            </View>
                                                                        )
                                                                    })
                                                                    : false
                                                            }

                                                        </View>
                                                        : false}

                                                {/* grafico de barra  n°4 - gasto dos ultimos 365dias */}
                                                <View style={{ borderBottomWidth: 1, marginTop: RFValue(10), alignItems: "flex-start" }}>
                                                    <Text style={style.titleGraph}>Gastos dos últimos 365 dias</Text>

                                                    <VictoryChart
                                                        theme={VictoryTheme.material}
                                                        domainPadding={10}
                                                    >
                                                        <VictoryBar
                                                            style={{ data: { fill: "#00494A" } }}
                                                            data={gastosano.reverse()}
                                                            alignment="middle"
                                                            sortOrder="descending"

                                                        />
                                                        <VictoryAxis
                                                            tickFormat={gastosano.x}
                                                            tickLabelComponent={<VictoryLabel angle={-30} textAnchor="end" style={{ fontSize: RFValue(9) }} />}
                                                        />
                                                        <VictoryAxis
                                                            dependentAxis
                                                            tickFormat={(x) => (`${x}`)}
                                                        />
                                                    </VictoryChart>


                                                </View>
                                                <View style={{ height: 100 }}></View>
                                            </ScrollView>
                                        </View>
                                    )
                                })
                                : false
                            }
                        </Swiper>



                    </View>
                </View >
            </View >
        </>

    )
}

const style = StyleSheet.create({
    espacoCentral: {
        backgroundColor: DefaultStyles.colors.fundo,
        flex: 15,
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
    textLegend: {
        fontSize: RFValue(17)
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
    titleGraph: {
        alignSelf: 'flex-start',
        marginTop: RFValue(5),
        fontSize: RFValue(14),
        marginLeft: RFValue(10),
        color: DefaultStyles.colors.tabBar,
    },
    buttonTextRight: {
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(60),
        position: 'absolute',
        right: RFValue(50),
        bottom: RFPercentage(height < 700 ? 30 : 32)
    },
    buttonTextLeft: {
        color: DefaultStyles.colors.tabBar,
        fontSize: RFValue(60),
        position: 'absolute',
        left: RFValue(50),
        bottom: RFPercentage(height < 700 ? 30 : 32)
    },
    image: {
        flex: 1,
        justifyContent: "center",
        width: width,
        height: RFValue(400),
        marginTop: RFValue(20)
    }
});

export default Dashboard;