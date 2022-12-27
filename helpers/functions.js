import AsyncStorage from '@react-native-async-storage/async-storage';
import {CalendarUtils} from 'react-native-calendars';

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
const storeListId = async(key,value) =>{
    try{
        await AsyncStorage.setItem(key, String(value))
    } catch (e) {
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

export {
    storeData, 
    storeTaskId,
    storeListId, 
    getData, 
    getTaskId,
    getListId, 
    GetTodayDate,
    GetDateForCalendar, 
    dealCompletion, 
    dealDeletion, 
    dealUncomplition,
    dealListDeletion

}