import { Text,TouchableOpacity,View,TextInput,Image  } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { DatePicker } from 'react-native-wheel-pick'

import { useState } from 'react'

import { styles } from '../helpers/styles'
import { getData,storeData } from '../helpers/functions'

import Spacer from './Spacer'

export default function EditTabTasks({display, id, setTasks, setVisibility, name, setVisibilityCTB}){

    const [newName, setNewName] = useState("")
    const [newList, setNewList] = useState("")
    const [newDate, setNewDate] = useState("")

    const [edited, setEdited] = useState(false)
    const [value, setValue] = useState("")

    const [lists, setLists] = useState([])
    if(lists[0]==null){
      getData("lists").then((res)=>{
          
          if(res[0]!=null || lists!=res){
            let listsName = ["None"]
            for(let i=0;i<res.length;i++){
              listsName=[...listsName,res[i].name]
            }
            setLists(listsName)
          }
      })
    }
    
    return (
      <View  style={[styles.edit,{display:display,height:'75%'}]}>
        <Spacer height={10}/>
        <Text style={{
          fontSize:24,
          marginTop:5,
          fontWeight:'bold'
        }}>{name}</Text>

        <Spacer height={30}/>
        
        <View style={styles.editBody}>
            <View style={{width:"100%"}}>
                <TextInput
                    style={styles.renameTask}
                    placeholder='Rename task'
                    value={value}
                    onChangeText={text=>{
                        setValue(text)
                        setNewName(text)
                    }}
                />
            </View>
            <Spacer height={10} />
            <View style={styles.drpView}>
              <Text style={{fontSize:20}}>Select list:  </Text>
              <SelectDropdown
                  buttonStyle={styles.dropdown}
                  data={lists}
                          
                  defaultValue={lists[0]}

                  onSelect={(selectedItem) => {
                      setNewList(selectedItem)

                  }}
              />
            </View>
            <Spacer height={10} />
            <Text style={{fontSize:20}}>Select a date:</Text>
            <Spacer height={5} />
            <DatePicker
                style={styles.dataPicker} 
                onDateChange={date => {

                    let anotherDate = new Date(date)

                    let day = String(anotherDate.getDate())
                    let month = String(anotherDate.getMonth()+1)
                    let year = String(anotherDate.getFullYear())


                    if(parseInt(month/10)==0){month="0"+month}
                    if(parseInt(day/10)==0){day="0"+day}

                    const newdate = year+"-"+month+"-"+day
                    
                    setEdited(true)
                    setNewDate(newdate)
                    


                }}
            />

        </View>
        <Spacer height={20}/>
        <TouchableOpacity onPress={()=>{

        getData("tasks").then((res)=>{
            for(let i=0;i<res.length;i++){
                if(res[i].id == id){
                    if(newName!=""){res[i].name=newName}
                    if(newList!=""){res[i].list=newList}
                    if(edited){
                        res[i].planned=newDate
                        setEdited(false)
                    }
                }
            }
            storeData("tasks",res)
            setTasks([])
        })

          setVisibility('none')
          setVisibilityCTB('flex')
          setNewDate("")
          setNewList("")
          setNewName("")
          setValue("")
          }}>
          <Image style={{height:40,width:40}} source={require("../images/icons/edit.png")}/>
        </TouchableOpacity>

        <Spacer height={20}/>
      </View>
    )
  }