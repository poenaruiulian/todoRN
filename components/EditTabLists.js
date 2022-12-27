import ColorPalette from 'react-native-color-palette'
import { Text,TouchableOpacity,View  } from 'react-native'

import { useState } from 'react'

import { styles } from '../helpers/styles'
import { getData,storeData } from '../helpers/functions'

import Spacer from './Spacer'

export default function EditTabLists({display, id, setLists, setVisibility, name}){

    const [color, setColor] = useState('transparent')
    
    return (
      <View  style={[styles.edit,{display:display}]}>
        <Text style={{
          fontSize:24,
          marginTop:5
        }}>{name}</Text>
        <View>
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
            colors={['transparent','white', '#f04422', '#f0b222', '#3ea363', '#3e79a3', '#7c3ea3']}
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
          <Text>Done</Text>
        </TouchableOpacity>
      </View>
    )
  }