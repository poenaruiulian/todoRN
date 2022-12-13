import {View,Text} from 'react-native-ui-lib';

export default function Spacer({height}){

    return(
        <View style={{height:height}}>
            <Text> </Text>
        </View>
    )

}