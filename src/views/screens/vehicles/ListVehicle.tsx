import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions, FlatList, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import Empty from '../../assets/iconSvg/empty.svg'
import { DefaultStyles } from '../../DefaultStyles';
import Vehicles from '../../../database/models/Vehicles';
import { useRealm } from '@realm/react';
import Header from '../../components/Header';
import CardRegisteredVehicle from '../../components/CardRegisteredVehicle';
import TitleView from '../../components/TitleView';
import EditVehicleController from '../../../controllers/EditVehicleController';
import { RFValue } from 'react-native-responsive-fontsize'
const { height } = Dimensions.get('window')

function ListVehicle(props: React.PropsWithChildren): JSX.Element {
    const realm = useRealm();
    const navigator = useNavigation()
    //const { state, dispatch } = useContext(CarsContext) 

    /**
     * alterado de mock para database
     * @author Alencar
     * @date 2022-09-22
     */
    const [items, setItems] = useState(((props.route || {}).params || {}).vehicle || props.vehicle || realm.objects('Vehicles') || []);

    //carregamento dos dados do banco
    useEffect(() => {
        const user = realm.objects('Users').filtered('logged == true')
        navigator.addListener('focus', () => { //para recarregar sempre que a tela receber o foco
            // setItems(realm.objects('Vehicles'));
            setItems(user[0].vehicles);
        });
    }, []);

    // função com o componente do card de vehicle cadastrados. Usado no Flatlist
    function getCars({ item, index, separators }) {
        return <CardRegisteredVehicle screen='ViewVehicle' vehicle={item} />
    }

    return (
        <>
            <Header />
            <View style={style.title}>
                <TitleView title='Veículos' />
                <View style={style.espacoCentral}>
                    <View style={{ flex: 1, alignItems: 'center', paddingTop: RFValue(30) }}>
                        {/* Lista com os veículos cadastrados */}
                        {
                            items.length > 0 ?
                                <FlatList
                                    // keyExtractor={ => car.id.toString()}
                                    data={items}
                                    renderItem={getCars}
                                    showsVerticalScrollIndicator={false}
                                />
                                : <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: RFValue(30) }}>
                                    {/* <Empty width={RFValue(150)} height={RFValue(150)} fill={DefaultStyles.colors.tabBar} /> */}
                                    <Text style={style.info}>Não há veículo cadastrado. </Text>
                                    <Text style={style.info}>Clique em adicionar e cadastre seu primeiro veículo.</Text>
                                </View>
                        }
                    </View>

                    {/* BOTÃO ACRESCENTAR NOVO VEICULO */}
                    <View style={style.buttonNewCar} >
                        <TouchableOpacity
                            onPress={() => {
                                EditVehicleController.editingVehicle = null; //limpa o veiculo em edicao, se existir;
                                navigator.navigate('EditVehicle');
                            }}>
                            <Icon name='plus' size={RFValue(35)} color={DefaultStyles.colors.botao} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
    buttonNewCar: {
        height: height > 700 ? RFValue(height * 0.082) : RFValue(height * 0.099),
        width: height > 700 ? RFValue(height * 0.082) : RFValue(height * 0.099),
        backgroundColor: DefaultStyles.colors.tabBar,
        // borderColor: DefaultStyles.colors.tabBar,
        // borderWidth: 5,
        borderRadius: height > 700 ? RFValue(height * 0.082 / 2) : RFValue(height * 0.099 / 2),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: RFValue(15),
        right: RFValue(15)
    },
    title: {
        flex: 9,
        backgroundColor: DefaultStyles.colors.tabBar,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        fontFamily: 'verdana',
        fontSize: RFValue(16),
        textAlign: 'center',
        color: '#000'
    }
});

export default ListVehicle;


