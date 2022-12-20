import { Text,View } from "react-native-ui-lib";

export default function Chip({name}){

    return(
        <View style={{
            borderColor:'green',
            borderRadius:20,
            borderWidth:2,
            padding:5,
            minWidth:50,
            alignItems:'center',
            alignSelf: 'flex-start'
        }}>
            <Text style={{color:'green'}}>{name}</Text>
        </View>
    )

}