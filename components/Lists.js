import {View, Text, Drawer, Colors} from 'react-native-ui-lib';
import { TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import {useState} from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Spacer from './Spacer';
import EditTabLists from './EditTabLists';
import EditTabTasks from './EditTabTasks';
import { 
  storeData,
  storeListId,
  storeTaskId,
  getData,
  getListId, 
  getTaskId,
  GetTodayDate, 
  dealDeletion,
  dealCompletion,
  dealListDeletion} from '../helpers/functions';
import { styles } from '../helpers/styles';


Colors.loadColors({
  delete:'#f54e42',
  done:'#6da352',
  edit:'#6fb2d6',
  open:"#fb8500"
})

const Stack = createNativeStackNavigator()

export function SpecificList({route,navigation}){

  const [tasks, setTasks] = useState([])
  getData("tasks").then((res)=>{
    //if there are no tasks and in the asinq storage are some tasks than it should change the state
    if(res[0]!=null && tasks[0]==null){setTasks(res)}
    //or when in the asinq storage was a modification made
    else if(res.length!=tasks.length){setTasks(res)}
    //can't change state without these condition because of the asinq function runing in the background
    //it's overloading the app
  })

  const [newTask, setNewTask] = useState({
      name:"",
      planned:"None",
      list:"",
      addedDate:GetTodayDate(),
      id:0
    })

  const [taskNumber, setTaskNumber] = useState(0)
  //getting the task number from the asinq storage 
  //this way we avoid using the same id for more tasks
  if(taskNumber == 0){getTaskId("taskID").then((res)=>{setTaskNumber(Number(res))})}

  const [value, setValue] = useState('')

  const [visibility, setVisibility] = useState('none')
  const [visibilityCTB, setVisibilityCTB] = useState('flex')

  const [itemToChange, setItemToChange] = useState({
    name:"",
    id:0,
  })

  return (
    <View style={styles.container}>
      <Spacer height={50}/>
      <View style={styles.header}>
          <TouchableOpacity onPress={()=>{navigation.navigate("Lists")}}>
            <Image style={{height:40, width:40}} source={require("../images/icons/back.png")}/>
          </TouchableOpacity>
          <Text style={{fontSize:24, color:route.params.color, fontWeight:"bold"}}>{route.params.name}</Text>
      </View>
      <View style={styles.headerAddTask}>
        <TextInput 
          style={styles.addTask}
          placeholder="Add task"
          value={value}
          onChangeText={text =>{
            setValue(text)
            setNewTask({
              name:text,
              planned:"None",
              list:route.params.name,
              addedDate:newTask.addedDate,
              id:taskNumber+1})
            }}
        />
        <TouchableOpacity onPress={()=>{
          storeData("tasks", [...tasks,newTask] )
          getData("tasks").then((res)=>{setTasks(res)})
          //we store the item in the asinq storage and than we update the state of the tasks
          setNewTask({name:"",planned:"",list:"",addedDate:GetTodayDate(),id:0})
          storeTaskId("taskID",taskNumber+1)
          getData("taskID").then((res)=>{setTaskNumber(Number(res))})
          //same story as above for the id
          setValue('')
        }}>
          <Image style={{height:30, width:30}} source={require("../images/icons/add_task.png")}/>
        </TouchableOpacity>
      </View>

      <Spacer height={40}/>
      
      <ScrollView contentContainerStyle={styles.allTasks} showsVerticalScrollIndicator={false}>
        {tasks.map((e)=>{
          if(e.list == route.params.name){
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
                    }},
                    {text:'Edit', background:Colors.edit,onPress: ()=>{
                        setItemToChange({
                          name:e.name,
                          id:e.id,
                        })

                        setVisibility('flex')
                        setVisibilityCTB('none')
                    }}
                  ]}
                  leftItem={{text:'Done',background:Colors.done, onPress: () => {
                              dealCompletion(e.id,tasks,setTasks)}}}
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
        <TextInput 
          style={styles.addList}
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
          }}>
            <Image style={{height:30, width:30}} source={require("../images/icons/add_list.png")}/>
          </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.allLists} showsVerticalScrollIndicator={false}>
        {lists.map((e)=>{
            return ( 
              <View key={e.id}>
                <Drawer
                  style={{borderRadius:10}}
                  rightItems={[
                      {text: 'Delete',background:Colors.delete, onPress:()=> {
                        Alert.alert(
                          "Are you sure you want to delete list:",
                          `${e.name}`,
                          [
                            {
                              text: "No, cancel",
                              onPress: () => console.log("Cancel Pressed"),
                              style: "cancel"
                            },
                            { 
                              text: "Yes, delete", 
                              onPress: () => dealListDeletion(e.id,lists,setLists,"lists") ,
                              style:"destructive"
                            }
                          ]
                        )
                      }},
                      {text:'Edit', background:Colors.edit, onPress: ()=>{
                          setItemToChange({
                            name:e.name,
                            id:e.id})

                          setVisibility('flex')
                      }}
                  ]}
                  leftItem={
                    {text: 'Open',background:Colors.open, onPress: ()=>{
                        navigation.navigate("Specific List",{name:e.name,color:e.color})
                    }}
                  }
                >
                  <View centerV padding-s4 style={[styles.list,{backgroundColor:e.color}]}>
                    <Text style={styles.listText}>{e.name}</Text>
                  </View>
                </Drawer>
                                
                <Spacer height={15}/>
              </View>
            )
        })}

        <Spacer height={100}/>
      </ScrollView>

      <View>
        <EditTabLists display={visibility} id={itemToChange.id} name={itemToChange.name} setLists={setLists} setVisibility={setVisibility}/>
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

