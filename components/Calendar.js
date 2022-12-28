import {View, Text, Drawer, Colors} from 'react-native-ui-lib';
import {Calendar} from 'react-native-calendars';
import { TextInput, TouchableOpacity, ScrollView,Alert,Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import Spacer from './Spacer';
import EditTabTasks from './EditTabTasks';
import { 
    GetDateForCalendar,
    GetTodayDate,
    dealDeletion,
    dealCompletion,
    storeData,
    storeTaskId,
    getData,
    getTaskId } from '../helpers/functions';
import { styles } from '../helpers/styles';

Colors.loadColors({
  delete:'#f54e42',
  done:'#6da352',
  edit:'#6fb2d6'
})

const Stack = createNativeStackNavigator()

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
    <View style={styles.containerCalendar}>
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

        markedDates={{[GetDateForCalendar(date)]:{selected: true, selectedColor: '#0D47A1'},}}

        onDayLongPress={day => {
          navigation.navigate("Selected Date",{date:day})
        }}
      />
        
      <Spacer height={20}/>
        
      <View style={[styles.container,{alignItems:"center"}]}>
        <TouchableOpacity onPress={()=>{navigation.navigate("Selected Date",{date:{
          year:Number(date[0]+date[1]+date[2]+date[3]),
          month:Number(date[5]+date[6]),
          day:Number(date[8]+date[9])
        }})}}>
          <Image style={{height:40,width:40}} source={require("../images/icons/plan_task.png")}/>
        </TouchableOpacity>

        <Spacer height={20}/>
        <ScrollView ontentContainerStyle={styles.allTasks}  showsVerticalScrollIndicator={false}>
          {tasks.map((e)=>{
            if(e.planned == date){
              return (       
                <View key={e.id}>
                  <Drawer
                    style={{borderRadius:10}}
                    rightItems={[
                      {text: 'Delete',background:Colors.delete, onPress:()=> {
                        Alert.alert(
                          "Are you sure you want to delete task:",
                          `${e.name}`,
                          [
                            {
                              text: "No, cancel",
                              onPress: () => console.log("Cancel Pressed"),
                              style: "cancel"
                            },
                            { 
                              text: "Yes, delete", 
                              onPress: () => dealDeletion(e.id,tasks,setTasks,"tasks") ,
                              style:"destructive"
                            }
                          ])
                      }}
                    ]}
                    leftItem={
                      {text: 'Done',background:Colors.done, onPress: () => {
                          dealCompletion(e.id,tasks,setTasks)}
                      }
                    }   
                  >
                    <View centerV padding-s4 style={styles.task}>
                      <Text style={styles.taskText}>{e.name}</Text>
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
    

export function SelectedDate({route,navigation}){

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

  const [visibility, setVisibility] = useState('none')
  const [visibilityCTB, setVisibilityCTB] = useState('flex')

  const [itemToChange, setItemToChange] = useState({
    name:"",
    id:0,
  })


  return(
    <View style={[styles.container,{alignItems:'center'}]}>

      <Spacer height={50} />
      <View style={styles.header}>
          <TouchableOpacity onPress={()=>{navigation.push("Calendar")}}>
            <Image style={{height:40, width:40}} source={require("../images/icons/back.png")}/>
          </TouchableOpacity>
          <Text style={{fontSize:24, fontWeight:'bold'}}>{route.params.date.day}  {route.params.date.month}  {route.params.date.year}</Text>
      </View>
      
      <View style={styles.headerAddTask}>
        <TextInput 
          style={styles.addTask}
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
        <TouchableOpacity 
          onPress={()=>{
            storeData("tasks", [...tasks,newTask] )
            getData("tasks").then((res)=>{setTasks(res)})
            setNewTask({name:"",planned:"",list:"",addedDate:GetTodayDate(),id:0})
            storeTaskId("taskID",taskNumber+1)
            getData("taskID").then((res)=>{setTaskNumber(Number(res))})
            setValue('')
         }}>
           <Image style={{height:30, width:30}} source={require("../images/icons/add_task.png")}/>
      </TouchableOpacity>
      </View>



      <Spacer height={40}/>


      <ScrollView ontentContainerStyle={styles.allTasks}  showsVerticalScrollIndicator={false}>
        {tasks.map((e)=>{
          let date = route.params.date.year+"-"+route.params.date.month+"-"+route.params.date.day
          if(e.planned == date){
            return (
              <View key={e.id}>
                <Drawer
                  style={{borderRadius:10}}
                  rightItems={[
                    {text: 'Delete',background:Colors.delete, onPress:()=> {
                      Alert.alert(
                        "Are you sure you want to delete task:",
                        `${e.name}`,
                        [
                          {
                            text: "No, cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                          },
                          { 
                            text: "Yes, delete", 
                            onPress: () => dealDeletion(e.id,tasks,setTasks,"tasks") ,
                            style:"destructive"
                          }
                        ]
                      )}
                    },
                    {text:'Edit', background:Colors.edit,onPress: ()=>{
                        setItemToChange({
                          name:e.name,
                          id:e.id})

                          setVisibility('flex')
                          setVisibilityCTB('none')
                    }}
                  ]}
                  leftItem={
                    {text: 'Done',background:Colors.done, onPress: () => {
                        dealCompletion(e.id,tasks,setTasks)}
                    }
                  }          
                >
                  <View centerV padding-s4 style={styles.task}>
                    <Text style={styles.taskText}>{e.name}</Text>
                  </View>
                </Drawer>
                <Spacer height={15}/>
              </View>
            )
          }  
        })}
        <Spacer height={50}/>

      </ScrollView>
      <View>
        <EditTabTasks 
          display={visibility} 
          id={itemToChange.id} 
          name={itemToChange.name} 
          setTasks={setTasks} 
          setVisibility={setVisibility}
          setVisibilityCTB={setVisibilityCTB}
        />
      </View>

    
    </View>
  )

}

export default function CalendarNavigation(){

  return(
    <Stack.Navigator>
      <Stack.Screen name="Calendar" component={CalendarScreen} options={{headerShown:false,gestureEnabled: false, }}/>
      <Stack.Screen name="Selected Date" component={SelectedDate} options={{headerShown:false,gestureEnabled: false}}/>
    </Stack.Navigator>
  )

}
