import { Text,View } from "react-native-ui-lib";

import { styles } from "../helpers/styles";

export default function Chip({name, color}){

    return(
        <View style={[styles.chip,{borderColor:color,}]}>
            <Text style={{color:color}}>{name}</Text>
        </View>
    )

}