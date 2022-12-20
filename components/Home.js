import {View, Text, Drawer, Colors} from 'react-native-ui-lib';
import { ScrollView,TextInput,StyleSheet, TouchableOpacity} from 'react-native'
import {useState} from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Spacer from './Spacer';
import Chip from './Chip';

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


function dealDeletion(id,values,setValues,key){
    
    let valuesC = []
    for(let i=0;i<values.length;i++){
        if(id != values[i].id){
            valuesC=[...valuesC,values[i]]
        }
    }
    storeData(key,valuesC)
    getData(key).then((res)=>{setValues(res)})
    console.log(values)
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
function dealUncomplition(id, completedTasks, setCompletedTasks){
    let unComplTsk = {}
    for(let i=0;i<completedTasks.length;i++){
        if(id == completedTasks[i].id){
            unComplTsk=completedTasks[i]
            break
        }
    }

    getData("tasks").then((res)=>{
        storeData("tasks", [...res, unComplTsk])
    })

    let completedTasksC = []
    for(let i=0;i<completedTasks.length;i++){
        if(id != completedTasks[i].id){
            completedTasksC=[...completedTasksC,completedTasks[i]]
        }
    }
    storeData("completedTasks", completedTasksC)
    getData("completedTasks").then((res)=>{setCompletedTasks(res)})
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


export function Home({navigation}){

    const [tasks, setTasks] = useState([])
        getData("tasks").then((res)=>{
            console.log(res,"\n",tasks)
            if(res[0]!=null && tasks[0]==null){setTasks(res)}
            else if(res.length!=tasks.length){setTasks(res)}
            console.log(res)
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
                                    list:"None",
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
            <ScrollView ontentContainerStyle={styles.allTasks}  showsVerticalScrollIndicator={false}>

                {tasks.map((e)=>{
                        
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
                                <Spacer height={5}/>
                                <View style={styles.chips}>
                                    <Chip name={e.list}/>
                                </View>

                                <Spacer height={15}/>
                            </View>
                        )
                })}

               <Spacer height={50}/>

            </ScrollView>
            <View style={styles.completedTasks}>
                <TouchableOpacity onPress={()=>{
                    navigation.push("Tasks completed")
                    }
                }>
                    <Text>Completed tasks</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

export function CompletedTasks({navigation}){


    const [completedTasks, setCompletedTasks] = useState([])
    if(completedTasks[0]==null){
        getData("completedTasks").then((res)=>{
            if(res[0]!=null){setCompletedTasks(res)}
        })
    }
    
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {completedTasks.map((e)=>
                    <View key={e.id}>
                        <Drawer leftItem={
                                    {text:"Undone",background:Colors.done,onPress: ()=> {
                                        dealUncomplition(e.id,completedTasks,setCompletedTasks)
                                    }}
                                }
                                rightItems={
                                    [{text:"Delete", background:Colors.delete, onPress: ()=>{
                                        dealDeletion(e.id,completedTasks,setCompletedTasks,"completedTasks")
                                    }}]
                                }
                        >
                            <View centerV padding-s4 bg-white style={{height: 60,width:300}}>
                                <Text text70>{e.name}</Text>
                            </View>
                        </Drawer>

                        <Spacer height={5}/>
                        <View style={styles.chips}>
                            <Chip name={e.list}/>
                        </View>
                
                        <Spacer height={15}/>
                    </View>
                )}
            </ScrollView>
            <View style={styles.completedTasks}>
                <TouchableOpacity onPress={()=>{navigation.push("Home")}}>
                    <Text>Home</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default function HomeNavigation(){

    return(
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={{headerShown:false,gestureEnabled: false}}/>
            <Stack.Screen name="Tasks completed" component={CompletedTasks} options={{headerShown:false,gestureEnabled: false}}/>
        </Stack.Navigator>
    )

}

const styles = StyleSheet.create({

    container:{
        flex:1,
        alignItems:'center',
        marginTop:50,
    },

    completedTasks:{
        width:'100%',
        alignItems:'right',
        padding:10,
        height:50, 
        alignItems:'center'
    },

    allTasks:{
        flex:1,
        alignItems:'center',
        marginTop:50,
        width:'100%'
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