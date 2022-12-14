import {View, Text,Drawer,Colors} from 'react-native-ui-lib';
import {ScrollView,TextInput,StyleSheet, TouchableOpacity} from 'react-native'
import {useState} from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Spacer from './Spacer';

const Stack = createNativeStackNavigator()

Colors.loadColors({
    delete:'#f54e42',
    done:'#6da352',
    edit:'#6fb2d6'
})

function GetTodayDate(){
    const day = new Date().getDate()
    const month = new Date().getMonth()+1
    const year = new Date().getFullYear()

    const date = {day,month,year}
    return date
}

function dealDeletion(id,tasks,setTasks){
    
    let tasksC = []
    for(let i=0;i<tasks.length;i++){
        if(id != tasks[i].id){
            tasksC=[...tasksC,tasks[i]]
        }
    }
    storeData("tasks",tasksC)
    getData("tasks").then((res)=>{setTasks(res)})
}

function dealCompletion(id,tasks,setTasks,completedTasks,setCompletedTasks){
    let complTsk = {}
    for(let i=0;i<tasks.length;i++){
        if(id == tasks[i].id){
            complTsk=tasks[i]
            break
        }
    }
    console.log(complTsk)
    complTsk.addedDate = GetTodayDate()
    //setCompletedTasks([...completedTask,complTsk])
    storeData("completedTasks", [...completedTasks,complTsk])
    getData("completedTasks").then((res)=>{setCompletedTasks(res)})

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
  
const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      alert(e)
    }
  }

export function Home({navigation,route}){

    const [tasks, setTasks] = useState([])
   //getData("tasks").then((res)=>{setTasks(res)})
    if(tasks[0]==null){getData("tasks").then((res)=>{setTasks(res)})}
    const [completedTasks, setCompletedTasks] = useState([])
    if(completedTasks[0]==null){getData("completedTasks").then((res)=>{setCompletedTasks(res)})}
    const [newTask, setNewTask] = useState({
        name:"",
        planned:"",
        list:"",
        addedDate:GetTodayDate(),
        id:0
    })
    const [taskNumber, setTaskNumber] = useState(0)

    const [value, setValue] = useState('')

    
    return (
        <View style={styles.container}>
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
                                    planned:"",
                                    list:"",
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
                        setTaskNumber(taskNumber+1)
                        setValue('')
                    }}><Text>Add</Text></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.allTasks}>

                {tasks.map((e)=>{
                        
                        return (
                            
                            <View>
                                <Drawer
                                    rightItems={[
                                        {text: 'Delete',background:Colors.delete, onPress:()=> {
                                            dealDeletion(e.id,tasks,setTasks)
                                            //navigation.navigate("Home",{tasks})
                                            }
                                        },
                                        {text:'Edit', background:Colors.edit}
                                    ]}
                                    leftItem={
                                        {text: 'Done',background:Colors.done, onPress: () => {
                                            dealCompletion(e.id,tasks,setTasks,completedTasks,setCompletedTasks)
                                            //navigation.navigate("Home",{tasks})
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
                })}

            </ScrollView>
            <View style={styles.completedTasks}>
                <TouchableOpacity onPress={()=>{
                    navigation.navigate("Tasks completed",{completedTasks:completedTasks})
                
                    }
                }>
                    <Text>Completed tasks</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

export function CompletedTasks({route}){


    //completedTask
    console.log(route.params.completedTasks)
    return (
        <View style={styles.container}>
            {route.params.completedTasks.map((e)=>
                <View>
                    <Drawer leftItem={{text:"Undone",background:Colors.done,onPress: ()=> console.log("Undone")}}>
                        <View centerV padding-s4 bg-white style={{height: 60,width:300}}>
                            <Text text70>{e.name}</Text>
                        </View>
                    </Drawer>
            
                    <Spacer height={15}/>
                </View>
            )}
        </View>
    )
}

export default function HomeNavigation(){

    return(
        <Stack.Navigator navigationOptions={{gestureEnabled: false}}>
            <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
            <Stack.Screen name="Tasks completed" component={CompletedTasks} options={{headerShown:false}}/>
        </Stack.Navigator>
    )

}

const styles = StyleSheet.create({

    container:{
        flex:1,
        alignItems:'center',
        marginTop:50,
    },

    headerAddTask:{
        width:'100%',
        flexDirection:"row",
        justifyContent:'space-evenly'
    },

    completedTasks:{
        width:'100%',
        alignItems:'right',
        padding:10
    },

    allTasks:{
        flex:1,
        alignItems:'center',
        marginTop:50,
        width:'100%'
    },

    addTask:{
        width:"70%",
        borderBottomWidth:2,

    }

})
