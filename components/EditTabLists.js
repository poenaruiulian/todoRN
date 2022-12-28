import ColorPalette from 'react-native-color-palette'
import { Text,TouchableOpacity,View,Image  } from 'react-native'

import { useState } from 'react'

import { styles } from '../helpers/styles'
import { getData,storeData } from '../helpers/functions'

import Spacer from './Spacer'

export default function EditTabLists({display, id, setLists, setVisibility, name}){

    const [color, setColor] = useState('transparent')
    
    return (
      <View  style={[styles.edit,{display:display,height:"30%",backgroundColor:"transparent"}]}>
        <Text style={{
          fontSize:24,
          marginTop:5
        }}>{name}</Text>
        <View>
        <Spacer height={20}/>
        <ColorPalette
            scaleToWindow={true}
            titleStyles={{display:'none'}}
            onChange={color => {
              
              setColor(color)
  
              getData("lists").then((res)=>{
  
                for(let i = 0; i<res.length; i++){
                  if(res[i].id == id){
                    res[i].color = color
                  }
                }
  
                storeData("lists", res)
                setLists([])
              })
              
            }}
            
            value={color}
            colors={['transparent','white', '#f27059', '#f7b267', '#6a994e', '#3a6ea5', '#a06cd5']}
            icon ={
              <Text>✔</Text>
            }
        />
        </View>
        <Spacer height={20}/>
        <TouchableOpacity  onPress={()=>{
          setVisibility('none')
          setColor("transparent")
          }}>
          <Image style={{height:40,width:40}} source={require("../images/icons/edit.png")}/>
        </TouchableOpacity>
      </View>
    )
  }