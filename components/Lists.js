import {View, Text, Drawer, Colors} from 'react-native-ui-lib';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {useState} from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ColorPalette from 'react-native-color-palette'

import Spacer from './Spacer';

Colors.loadColors({
  delete:'#f54e42',
  done:'#6da352',
  edit:'#6fb2d6',
  open:"#fcc44c"
})

const Stack = createNativeStackNavigator()

function GetTodayDate(){
  const day = new Date().getDate()
  const month = new Date().getMonth()+1
  const year = new Date().getFullYear()

  const date = {day,month,year}
  return date
}

const storeData = async (key,value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    alert(e)
  }
}
const storeListId = async(key,value) =>{
  try{
      await AsyncStorage.setItem(key, String(value))
  } catch (e) {
      alert(e)
  }
}
const storeTaskId = async(key,value) =>{
  try{
      await AsyncStorage.setItem(key, String(value))
  } catch (e) {
      alert(e)
  }
}
const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch(e) {
    alert(e)
  }
}
const getListId = async (key) =>{
  try{
      const value = await AsyncStorage.getItem(key)
      return value!=null ? value : 0 
  } catch(e) {
      alert(e)
  }
}
const getTaskId = async (key) =>{
  try{
      const value = await AsyncStorage.getItem(key)
      return value!=null ? value : 0 
  } catch(e) {
      alert(e)
  }
}

const ColorPicker = ({display, id, setLists, setVisibility, name}) => {
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
      <Spacer height={10}/>
      <TouchableOpacity  onPress={()=>{
        setVisibility('none')
        setColor("transparent")
        }}>
        <Text>Done</Text>
      </TouchableOpacity>
    </View>
  )
}


function dealDeletion(id,values,setValues,key){
    
  let valuesC = []
  for(let i=0;i<values.length;i++){
      if(id != values[i].id){
          valuesC=[...valuesC,values[i]]
      }
  }
  storeData(key,valuesC)
  getData(key).then((res)=>{setValues(res)})
}
function dealCompletion(id,tasks,setTasks){
    
  let complTsk = {}
  for(let i=0;i<tasks.length;i++){
      if(id == tasks[i].id){
          complTsk=tasks[i]
          break
      }
  }
  
  complTsk.addedDate = GetTodayDate()
  getData("completedTasks").then((res)=>{
      storeData("completedTasks", [...res,complTsk])
  })
  
  let tasksC = []
  for(let i=0;i<tasks.length;i++){
      if(id != tasks[i].id){
          tasksC=[...tasksC,tasks[i]]
      }
  }
  storeData("tasks",tasksC)
  getData("tasks").then((res)=>{setTasks(res)})
}
function dealListDeletion(id,lists,setLists,key){
  let listName = ""
  for(let i=0;i<lists.length;i++){
    if(lists[i].id == id){
      listName = lists[i].name
      break
    }
  }

  getData("tasks").then((res)=>{
    let tasksC = []
    for(let i = 0;i<res.length;i++){
      if(res[i].list != listName){
        tasksC=[...tasksC,res[i]]
      }
    }
    storeData("tasks",tasksC)
  })

  let valuesC = []
  for(let i=0;i<lists.length;i++){
      if(id != lists[i].id){
          valuesC=[...valuesC,lists[i]]
      }
  }
  storeData(key,valuesC)
  getData(key).then((res)=>{setLists(res)})
}


export function SpecificList({route,navigation}){

  const [tasks, setTasks] = useState([])
    if(tasks[0]==null){
        getData("tasks").then((res)=>{
            if(res[0]!=null||tasks!=res){setTasks(res)}
        })
    }

    const [newTask, setNewTask] = useState({
        name:"",
        planned:"None",
        list:"",
        addedDate:GetTodayDate(),
        id:0
    })

    const [taskNumber, setTaskNumber] = useState(0)
    if(taskNumber == 0){getTaskId("taskID").then((res)=>{setTaskNumber(Number(res))})}

    const [value, setValue] = useState('')

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={()=>{navigation.navigate("Lists")}}>
            <Text style={{fontSize:24}}>Back</Text>
          </TouchableOpacity>
          <Text style={{fontSize:24, color:route.params.color}}>{route.params.name}</Text>
      </View>
      <Spacer height={40}/>
      <View style={styles.headerAddTask}>
                    <TextInput style={styles.addTask}
                        placeholder="Add task"
                        value={value}
                        onChangeText={
                            text =>
                            {
                                setValue(text)
                                setNewTask({
                                    name:text,
                                    planned:"None",
                                    list:route.params.name,
                                    addedDate:newTask.addedDate,
                                    id:taskNumber+1
                                })
                            } 
                        }
                    />
                    <TouchableOpacity onPress={()=>{
                        
                        storeData("tasks", [...tasks,newTask] )
                        getData("tasks").then((res)=>{setTasks(res)})
                        //setTasks([...tasks,newTask])
                        setNewTask({name:"",planned:"",list:"",addedDate:GetTodayDate(),id:0})
                        storeTaskId("taskID",taskNumber+1)
                        getData("taskID").then((res)=>{setTaskNumber(Number(res))})
                        setValue('')
                    }}><Text>Add</Text></TouchableOpacity>
      </View>
      <Spacer height={40}/>
      <ScrollView contentContainerStyle={styles.allTasks} showsVerticalScrollIndicator={false}>

        {tasks.map((e)=>{
                
                if(e.list == route.params.name){
                  return (
                      
                      <View key={e.id}>
                          <Drawer
                              rightItems={[
                                  {text: 'Delete',background:Colors.delete, onPress:()=> {
                                      dealDeletion(e.id,tasks,setTasks,"tasks")
                                      }
                                  },
                                  {text:'Edit', background:Colors.edit}
                              ]}
                              leftItem={
                                  {text: 'Done',background:Colors.done, onPress: () => {
                                      dealCompletion(e.id,tasks,setTasks)
                                      }
                                  }
                              }
                              
                          >
                              <View centerV padding-s4 bg-white style={{height: 60,width:300}}>
                                  <Text text70>{e.name}</Text>
                              </View>
                              
                          </Drawer>

                          <Spacer height={15}/>
                      </View>
                  )
                }
        })}

      </ScrollView>
    </View>
  )
}

export function Lists({navigation}) {

  const [lists, setLists] = useState([])
  if(lists[0]==null){
    getData("lists").then((res)=>{
        if(res[0]!=null || lists!=res){setLists(res)}
    })
}

  const [listNumber, setListNumber] = useState(0)
  if(listNumber == 0){getListId("listID").then((res)=>{setListNumber(Number(res))})}

  const [newList , setNewList] = useState({
    name:"",
    id:0,
    color:'white',
  })

  const [value, setValue] = useState("")

  const [visibility, setVisibility] = useState('none')
  const [itemToChange, setItemToChange] = useState({
    name:"",
    id:0,
  })

    return (
      <View style={styles.container}>
          <View style={styles.headerAddList}>
                    <TextInput style={styles.addList}
                        placeholder="Make a new list"
                        value={value}
                        onChangeText={(text)=>{
                          setValue(text)
                          setNewList({
                            name:text,
                            id:listNumber+1,
                            color:'white'
                          })
                        }}
                    />
                    <TouchableOpacity onPress={()=>{
                        
                        storeData("lists", [...lists,newList] )
                        getData("lists").then((res)=>{setLists(res)})
                        setNewList({name:"", id:0})
                        storeListId("listID",listNumber+1)
                        getData("listID").then((res)=>{setListNumber(Number(res))})
                        setValue('')
                    }}><Text>Add</Text></TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.allLists} showsVerticalScrollIndicator={false}>

                {lists.map((e)=>{
                  
                        
                        return (
                            
                            <View key={e.id}>
                                <Drawer
                                    rightItems={[
                                      {text: 'Delete',background:Colors.delete, onPress:()=> {
                                        dealListDeletion(e.id,lists,setLists,"lists")
                                        }
                                    },
                                        {text:'Edit', background:Colors.edit, onPress: ()=>{
                                          
                                          setItemToChange({
                                            name:e.name,
                                            id:e.id,
                                          })

                                          setVisibility('flex')
                                        }}
                                    ]}
                                    leftItem={
                                        {text: 'Open',background:Colors.open, onPress: ()=>{
                                          navigation.navigate("Specific List",{
                                            name:e.name,
                                            color:e.color
                                          })
                                        }}
                                    }
                                    
                                >
                                    <View centerV padding-s4 style={{height: 60,width:300, backgroundColor:e.color}}>
                                        <Text text70>{e.name}</Text>
                                    </View>
                                    
                                    
                                </Drawer>
                                
                                <Spacer height={15}/>
                            </View>
                        )
                })}

            <Spacer height={100}/>
          </ScrollView>

          <View>
              <ColorPicker display={visibility} id={itemToChange.id} name={itemToChange.name} setLists={setLists} setVisibility={setVisibility}/>
          </View>
      </View>
    );
  }

export default function ListsNavigation(){
  return (
    <Stack.Navigator>
      <Stack.Screen name="Lists" component={Lists} options={{headerShown:false,gestureEnabled: false}}/>
      <Stack.Screen name="Specific List" component={SpecificList} options={{headerShown:false,gestureEnabled: false}}/>
    </Stack.Navigator>
  )
}

  
const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    marginTop:50,
  },

  header:{
    flexDirection:"row",
    justifyContent:'space-evenly',
    width:'60%'
  },

  headerAddList:{
    width:'100%',
    flexDirection:"row",
    justifyContent:'space-evenly'
  },

  addList:{
    width:"70%",
    borderBottomWidth:2,
  },

  allLists:{
    //flex:1,
    alignItems:'center',
    marginTop:50,
    width:'100%'
  },

  edit:{
    borderTopWidth:3,
    borderColor:'black',
    height:"30%",
    alignItems:'center',
  },

  headerAddTask:{
    width:'100%',
    flexDirection:"row",
    justifyContent:'space-evenly'
  },

  addTask:{
      width:"70%",
      borderBottomWidth:2,

  }
})

