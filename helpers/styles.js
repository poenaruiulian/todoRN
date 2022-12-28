import { StyleSheet } from "react-native"

const styles = StyleSheet.create({

    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:"#BBDEFB"
    },

    containerCalendar:{
        flex:1,
        width:"100%",
        backgroundColor:"#BBDEFB"
    },

    completedTasks:{
        width:'100%',
        alignItems:'right',
        padding:10,
        height:60, 
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
        marginTop:50,
        justifyContent:'space-evenly'
    },

    addTask:{
        width:"70%",
        borderBottomWidth:2,

    }, 

    chips:{
        flexDirection:'row',
        gap:10
    },

    chip:{
        borderRadius:20,
        borderWidth:2,
        padding:5,
        minWidth:50,
        alignItems:'center',
        alignSelf: 'flex-start',
    },

    header:{
        flexDirection:"row",
        width:'100%',
        justifyContent:"center",
        alignItems:'center'
    },
    
    headerAddList:{
        width:'100%',
        flexDirection:"row",
        justifyContent:'space-evenly',
        marginTop:50,
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

    list:{
        height:60,
        width:300,
        borderRadius:10,
        alignItems:"center"
    },

    listText:{
        fontSize:18,
        fontWeight:"500"
    },

    edit:{
        borderTopWidth:3,
        borderColor:'black',
        height:"30%",
        width:"100%",
        alignItems:'center',
        backgroundColor:"#cae9ff",
        borderTopStartRadius:5,
        borderTopEndRadius:5,
        
    },

    editBody:{
        alignItems:'center',
    },

    renameTask:{
        width:300,
        height:30,
        borderBottomWidth:2,
        borderRadius:5,
        padding:10,
        borderBottomColor:"#1565C0",
        backgroundColor:"#90CAF9"
    },

    dropdown:{
        borderRadius:10,
        backgroundColor:"#90CAF9"
    },

    drpView:{
        flexDirection:"row",
        alignItems:"center"
    },
    
    dataPicker:{ 
        width: "50%", 
        height:"50%", 
        backgroundColor:"#cae9ff",
    },
    
    calendar:{
        width:"90%",
        alignSelf:"center",
        marginTop:50,
        borderRadius:10
    },

    task:{
        height:60,
        width:300,
        backgroundColor:"#a2d2ff",
        borderRadius:10,
        borderBottomWidth:2.5,
        borderRightWidth:2.5,
        borderColor:"#014f86",
        alignItems:"center"
    },

    taskText:{
        fontSize:18,
        fontWeight:"500"
    }

})

export {styles}