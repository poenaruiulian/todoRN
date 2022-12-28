import {View, Text, Drawer, Colors} from 'react-native-ui-lib';
import { ScrollView,TextInput, TouchableOpacity, Alert, Image} from 'react-native'
import {useState} from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Spacer from './Spacer';
import Chip from './Chip';
import EditTabTasks from './EditTabTasks';
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


const Stack = createNativeStackNavigator()

Colors.loadColors({
    delete:'#f54e42',
    done:'#6da352',
    edit:'#6fb2d6'
})


export function Home({navigation}){

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
        list:"None",
        addedDate:GetTodayDate(),
        id:0
    })

    const [taskNumber, setTaskNumber] = useState(0)
    //getting the task number from the asinq storage 
    //this way we avoid using the same id for more tasks
    if(taskNumber == 0){getTaskId("taskID").then((res)=>{setTaskNumber(Number(res))})}

    const [value, setValue] = useState('')

    const [visibility, setVisibility] = useState('none')//visibility of the edit tab component
    const [visibilityCTB, setVisibilityCTB] = useState('flex')//visibility of the completed tasks component

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

            <ScrollView ontentContainerStyle={styles.allTasks}  showsVerticalScrollIndicator={false}>
                {tasks.map((e)=>{
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
                                    {text:'Edit', background:Colors.edit, onPress: ()=>{
                                            setItemToChange({
                                              name:e.name,
                                              id:e.id,
                                            })
                                            setVisibility('flex')
                                            setVisibilityCTB('none')
                                    }}
                                ]}
                                leftItem={{text: 'Done',background:Colors.done, onPress: () => {dealCompletion(e.id,tasks,setTasks)}}}
                            >
                                <View centerV padding-s4 style={styles.task}>
                                    <Text style={styles.taskText}>{e.name}</Text>
                                </View>
                                    
                                    
                            </Drawer>
                            
                            <Spacer height={5}/>
                                
                            <View style={styles.chips}>
                                <Chip name={e.list} color="#6a994e"/>
                                <View><Text> </Text></View>
                                <Chip name={e.planned} color="#bc6c25"/>
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
                    <Image style={{height:40,width:40}} source={require("../images/icons/done.png")}/>
                </TouchableOpacity>
            </View>
        </View>
    )

}

export function CompletedTasks({navigation}){


    const [completedTasks, setCompletedTasks] = useState([])
    //for the same reason as above the code below exists
    if(completedTasks[0]==null){
        getData("completedTasks").then((res)=>{
            if(res[0]!=null){setCompletedTasks(res)}
        })
    }
    
    return (
        <View style={styles.container}>
            <Spacer height={50}/>
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>{navigation.push("Home")}}>
                    <Image style={{height:40, width:40}} source={require("../images/icons/back.png")}/>
                </TouchableOpacity>
                <Text style={{fontSize:24, fontWeight:'bold'}}> Completed tasks</Text>
            </View>
            <Spacer height={50}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                {completedTasks.map((e)=>
                    <View key={e.id}>
                        <Drawer 
                            leftItem={{text:"Undone",background:Colors.done,onPress: ()=> {dealUncomplition(e.id,completedTasks,setCompletedTasks)}}}
                            rightItems={
                                [{text:"Delete", background:Colors.delete, onPress: ()=>{
                                    dealDeletion(e.id,completedTasks,setCompletedTasks,"completedTasks")
                                }}]
                            }
                        >
                            <View centerV padding-s4 style={styles.task}>
                                <Text style={styles.taskText}>{e.name}</Text>
                            </View>
                        </Drawer>

                        <Spacer height={5}/>

                        <View style={styles.chips}>
                            <Chip color={"#6a994e"} name={e.list}/>
                        </View>
                
                        <Spacer height={15}/>
                    </View>
                )}
            </ScrollView>

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

//Both in the Home and CompltedTasks we push in the navigation because of the states. 
//The states are not updating properly and by pushing a new page the states resets.(so the gestures are disabled)
