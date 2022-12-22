import { Text,View } from "react-native-ui-lib";

export default function Chip({name, color}){

    return(
        <View style={{
            borderColor:color,
            borderRadius:20,
            borderWidth:2,
            padding:5,
            minWidth:50,
            alignItems:'center',
            alignSelf: 'flex-start',
            //padding:5
        }}>
            <Text style={{color:color}}>{name}</Text>
        </View>
    )

}