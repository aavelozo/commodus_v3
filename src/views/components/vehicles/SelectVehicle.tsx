import React, { useEffect, useState } from 'react'
import { Dimensions, View } from 'react-native';
import { RFValue } from "react-native-responsive-fontsize";
import { TextInput } from 'react-native-paper';
import { DefaultProps } from '../../DefaultProps';
import { DefaultStyles } from '../../DefaultStyles';
import { useRealm } from '@realm/react';
import SelectDropdown from 'react-native-select-dropdown';
import { Mixed } from 'realm';
import Vehicles from '../../../database/models/Vehicles';

interface SelectVehicleProps {    
    setSelected : (selected:Vehicles) => void,
    ref ? : React.RefObject<HTMLElement>,
    selected ? : Vehicles,
    list ? : Realm.List<Vehicles>
}

//SELECT VEICULO
function SelectVehicle(props : SelectVehicleProps) : JSX.Element {
    const realm = useRealm();
    const [list,setList] = useState(props?.list || null);

    useEffect(()=>{
        const user = realm.objects('Users').filtered('logged == true')
        console.log(user[0].vehicles)
        if (list == null) {
            setList(user[0].vehicles);
        }
    });

        
        
    return (        
        <View style={{ height:DefaultStyles.dimensions.height.formElement, marginBottom: RFValue(10) }}>
            <TextInput
                {...DefaultProps.textInput}
                style={DefaultStyles.textInputWithDropdown}
                label='Veiculo'
                keyboardType='default'
                showSoftInputOnFocus={false}                    
                value={props?.selected ? " " : null} 
            /> 
            
            <SelectDropdown
                {...DefaultProps.selectDropdownWithTextInput}                      
                data={list}
                ref={props?.ref}
                onSelect={(selectedItem, index) => props.setSelected(selectedItem)}
                buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem.linkingObjects('Models','vehicles')[0].model + ' - ' + selectedItem.plate;
                }}
                rowTextForSelection={(item, index) => {
                    return item.linkingObjects('Models','vehicles')[0].model + ' - ' + item.plate;
                }}
                defaultButtonText={(props?.selected) 
                    ? props.selected.linkingObjects('Models','vehicles')[0].model + ' - ' + props.selected.plate
                    : ' '} 
            />
        </View>
    );
};

export default SelectVehicle;