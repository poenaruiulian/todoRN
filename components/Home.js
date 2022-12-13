import {View, Text,Drawer,Colors} from 'react-native-ui-lib';
import {ScrollView,TextInput,StyleSheet, TouchableOpacity} from 'react-native'
import {useState} from 'react'

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
    setTasks(tasksC)
}

function dealCompletion(id,tasks,setTasks,completedTask,setCompletedTasks){
    let complTsk = {}
    for(let i=0;i<tasks.length;i++){
        if(id == tasks[i].id){
            complTsk=tasks[i]
            break
        }
    }
    console.log(complTsk)
    complTsk.addedDate = GetTodayDate()
    setCompletedTasks([...completedTask,complTsk])

    let tasksC = []
    for(let i=0;i<tasks.length;i++){
        if(id != tasks[i].id){
            tasksC=[...tasksC,tasks[i]]
        }
    }
    setTasks(tasksC)
}


export function Home({navigation,route}){

    const [tasks, setTasks] = useState(route.params?route.params.tasks:[])
    const [completedTask, setCompletedTasks] = useState([])
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
                        setTasks([...tasks,newTask])
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
                                            navigation.navigate("Home",{tasks})
                                            }
                                        },
                                        {text:'Edit', background:Colors.edit}
                                    ]}
                                    leftItem={
                                        {text: 'Done',background:Colors.done, onPress: () => {
                                            dealCompletion(e.id,tasks,setTasks,completedTask,setCompletedTasks)
                                            navigation.navigate("Home",{tasks})
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
                <TouchableOpacity onPress={()=>navigation.navigate("Tasks completed",{completedTask:completedTask})}>
                    <Text>Completed tasks</Text>
                </TouchableOpacity>
            </View>
        </View>
    )

}

export function CompletedTasks({route,navigation}){


    //completedTask
    console.log(route.params.completedTask)
    return (
        <View style={styles.container}>
            {route.params.completedTask.map((e)=>
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
