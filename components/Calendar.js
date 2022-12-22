import {View, Text, Drawer, Colors} from 'react-native-ui-lib';
import {Calendar, CalendarUtils} from 'react-native-calendars';
import { StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDropdown from 'react-native-select-dropdown'

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useState } from 'react';

import Spacer from './Spacer';

Colors.loadColors({
  delete:'#f54e42',
  done:'#6da352',
  edit:'#6fb2d6'
})

const Stack = createNativeStackNavigator()

function GetTodayDate(){
  const day = new Date().getDate()
  const month = new Date().getMonth()+1
  const year = new Date().getFullYear()

  const date = {day,month,year}
  return date
}

function GetDateForCalendar(date){
  const newDate = new Date(date)
  return CalendarUtils.getCalendarDateString(newDate)
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


const storeData = async (key,value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
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
const getTaskId = async (key) =>{
  try{
      const value = await AsyncStorage.getItem(key)
      return value!=null ? value : 0 
  } catch(e) {
      alert(e)
  }
}




export function CalendarScreen({navigation}) {

  const [tasks, setTasks] = useState([])
  getData("tasks").then((res)=>{
      if(res[0]!=null && tasks[0]==null){setTasks(res)}
      else if(res.length!=tasks.length){setTasks(res)}
  })

  const [taskNumber, setTaskNumber] = useState(0)
  if(taskNumber == 0){getTaskId("taskID").then((res)=>{setTaskNumber(Number(res))})}

  const today = GetTodayDate().year+"-"+GetTodayDate().month+"-"+GetTodayDate().day
  const [date, setDate]= useState(today)

  

    return (
      <View style={styles.container}>
        <Calendar 
          style={styles.calendar}

          onDayPress={dayDate => {
            let year = dayDate.year
            let month = dayDate.month
            let day = dayDate.day
            if(parseInt(month/10)==0){month="0"+month}
            if(parseInt(day/10)==0){day="0"+day}
            setDate(year+"-"+month+"-"+day)
          }}

          markedDates={{
            [GetDateForCalendar(date)]:{selected: true, selectedColor: 'blue'},
          }}

          onDayLongPress={day => {
            navigation.navigate("Selected Date",{date:day})
          }}
        />

        <View style={[styles.container,{alignItems:"center"}]}>

        <TouchableOpacity onPress={()=>{navigation.navigate("Selected Date",{date:{
          year:Number(date[0]+date[1]+date[2]+date[3]),
          month:Number(date[5]+date[6]),
          day:Number(date[8]+date[9])
        }})}}>
          <Text style={{fontSize:18, fontWeight:"bold"}}>See planned tasks</Text>
        </TouchableOpacity>

        <Spacer height={10}/>
          <ScrollView ontentContainerStyle={styles.allTasks}  showsVerticalScrollIndicator={false}>

            {tasks.map((e)=>{
                  if(e.planned == date){
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

            <Spacer height={50}/>

          </ScrollView>
        </View>

      </View>
    );
}
export function SelectedDate({route}){

  const [tasks, setTasks] = useState([])
  getData("tasks").then((res)=>{
      if(res[0]!=null && tasks[0]==null){setTasks(res)}
      else if(res.length!=tasks.length){setTasks(res)}
  })

  const [newTask, setNewTask] = useState({
    name:"",
    planned:"",
    list:"None",
    addedDate:GetTodayDate(),
    id:0
  })

  const [taskNumber, setTaskNumber] = useState(0)
  if(taskNumber == 0){getTaskId("taskID").then((res)=>{setTaskNumber(Number(res))})}

  const [value, setValue] = useState('')

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


  return(
    <View style={[styles.container,{alignItems:'center'}]}>
      <Text style={{fontSize:24, fontWeight:'bold'}}>{route.params.date.day}  {route.params.date.month}  {route.params.date.year}</Text>
      
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
                                    planned:route.params.date.year+"-"+route.params.date.month+"-"+route.params.date.day,
                                    list:"None",
                                    addedDate:newTask.addedDate,
                                    id:taskNumber+1
                                })
                            } 
                        }
                    />

                    <SelectDropdown
                      data={lists}
                    
                      defaultValue={lists[0]}

                      onSelect={(selectedItem) => {
                        setNewTask({
                            name:newTask.name,
                            planned:newTask.planned,
                            list:selectedItem,
                            addedDate:newTask.addedDate,
                            id:newTask.id
                        })
                      }}

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


      <ScrollView ontentContainerStyle={styles.allTasks}  showsVerticalScrollIndicator={false}>

          {tasks.map((e)=>{
                let date = route.params.date.year+"-"+route.params.date.month+"-"+route.params.date.day
                if(e.planned == date){
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

          <Spacer height={50}/>

      </ScrollView>

    
    </View>
  )

}

export default function CalendarNavigation(){

  return(
    <Stack.Navigator>
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{headerShown:false,gestureEnabled: false}}/>
      <Stack.Screen name="Selected Date" component={SelectedDate} options={{headerShown:false}}/>
    </Stack.Navigator>
  )

}


const styles = StyleSheet.create({

  container:{
    flex:1,
    marginTop:50,
    width:"100%"
  },

  calendar:{
    width:"90%",
    alignSelf:"center",
  },

  headerAddTask:{
    width:'100%',
    //flexDirection:"row",
    alignItems:"center"
  },

  addTask:{
    width:"70%",
    borderBottomWidth:2,
  },

  allTasks:{
    flex:1,
    alignItems:'center',
    marginTop:50,
    width:'100%'
  },


})
  