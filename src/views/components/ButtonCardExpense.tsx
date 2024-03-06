import React from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Fuel from '../assets/iconSvg/fuel.svg'
import Oil from '../assets/iconSvg/oil.svg'
import Doc from '../assets/iconSvg/seguro.svg'
import Wash from '../assets/iconSvg/car-wash.svg'
import Mec from '../assets/iconSvg/chaveinglesa.svg'
import { useNavigation } from '@react-navigation/native'
import { RFValue } from "react-native-responsive-fontsize";
import { DefaultStyles } from '../DefaultStyles'
import Utils from '../../controllers/Utils'
import moment from 'moment'
import 'moment/locale/pt-br'

function ButtonCardExpense(props): JSX.Element {
    const item = props.data
    const navigation = useNavigation()

    return (
        <TouchableWithoutFeedback onPress={() => {
            switch ((item || {}).type || "") {
                case 'FUEL':
                    navigation.navigate('FuelExpense', { despesa: item });
                    break;
                case 'OIL':
                    navigation.navigate('OilExpense', { despesa: item });
                    break;
                case 'DOCUMENT':
                    navigation.navigate('DocumentationExpense', { despesa: item });
                    break;
                case 'APPEARANCE':
                    navigation.navigate('AppearanceExpense', { despesa: item });
                    break;
                case 'MECHANIC':
                    navigation.navigate('MechanicExpense', { despesa: item });
                    break;
                default:
                    Utils.showError("tipo de despesa nao esperada: " + (item || {}).type);
            }

        }}>
            <View>
                <View style={[style.cardExpense]}>
                    <View style={style.icon}>
                        {item.type == 'FUEL' &&
                            <Fuel width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                        {item.type == 'OIL' &&
                            <Oil width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                        {item.type == 'DOCUMENT' &&
                            <Doc width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                         {item.type == 'APPEARANCE' &&
                            <Wash width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                         {item.type == 'MECHANIC' &&
                            <Mec width={RFValue(40)} height={RFValue(40)} fill={DefaultStyles.colors.tabBar} />
                        }
                    </View>
                    <View style={{ justifyContent: 'center', paddingLeft: RFValue(10), width: '55%' }}>
                        <Text style={style.textExpense}>{item.othersdatas.codOil || item.othersdatas.fuel || item.othersdatas.documentName
                        || item.othersdatas.regularWashing || item.othersdatas.completeWashing || item.othersdatas.service}</Text>
                        <Text style={style.textExpense}>{item.establishment}</Text>
                        <Text style={style.textExpense}>{item.linkingObjects('Vehicles', 'expenses')[0]?.linkingObjects('Models', 'vehicles')[0].model}</Text>
                    </View>
                    <View style={{ justifyContent: 'space-between', alignItems: 'flex-end', width: '30%', paddingVertical: 5 }}>
                        <Text style={style.textExpense}> {moment(item.data).format("DD/MM/YY")}</Text>
                        <Icon name="angle-right" size={30} color={DefaultStyles.colors.tabBar} />
                        <Text style={style.textExpense}>R${Number(item.totalValue).toFixed(2)}</Text>
                    </View>
                </View>
                <View style={{ borderWidth: 1, borderColor: '#ccc' }} />
            </View>
        </TouchableWithoutFeedback>
    )
}

const style = StyleSheet.create({
    cardExpense: {
        height: Dimensions.get('window').height * 0.11,
        paddingHorizontal: RFValue(10),
        flexDirection: 'row',
        width: '100%'
    },
    icon: {
        width: Dimensions.get('window').width * 0.13,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textExpense: {
        fontSize: RFValue(16),
        color: '#333'
    },
});

export default ButtonCardExpense;