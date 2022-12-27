import {View, Text, Drawer, Colors} from 'react-native-ui-lib';
import { ScrollView,TextInput, TouchableOpacity} from 'react-native'
import {useState} from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Spacer from './Spacer';
import Chip from './Chip';

import {
    storeData, 
    storeTaskId, 
    getData, 
    getTaskId, 
    GetTodayDate,
    dealCompletion, 
    dealDeletion, 
    dealUncomplition} from "../helpers/functions"
import { styles } from '../helpers/styles';
import EditTabTasks from './EditTabTasks';

const Stack = createNativeStackNavigator()

Colors.loadColors({
    delete:'#f54e42',
    done:'#6da352',
    edit:'#6fb2d6'
})


export function Home({navigation}){

    const [tasks, setTasks] = useState([])
        getData("tasks").then((res)=>{
            if(res[0]!=null && tasks[0]==null){setTasks(res)}
            else if(res.length!=tasks.length){setTasks(res)}
        })
    

    const [newTask, setNewTask] = useState({
        name:"",
        planned:"None",
        list:"None",
        addedDate:GetTodayDate(),
        id:0
    })

    const [taskNumber, setTaskNumber] = useState(0)
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
                                        {text:'Edit', background:Colors.edit, onPress: ()=>{
                                          
                                            setItemToChange({
                                              name:e.name,
                                              id:e.id,
                                            })
  
                                            setVisibility('flex')
                                            setVisibilityCTB('none')
                                        }}
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
                                    <Chip name={e.list} color="green"/>
                                    <View><Text> </Text></View>
                                    <Chip name={e.planned} color="#144bb3"/>
                                </View>

                                <Spacer height={15}/>
                            </View>
                        )
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
            <View style={[styles.completedTasks, {display:visibilityCTB}]}>
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