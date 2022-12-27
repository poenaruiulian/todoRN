import { StyleSheet } from "react-native"

const styles = StyleSheet.create({

    container:{
        flex:1,
        alignItems:'center',
        marginTop:50,
    },

    containerCalendar:{
        flex:1,
        marginTop:50,
        width:"100%"
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

    }, 

    chips:{
        flexDirection:'row',
        gap:10
    },

    header:{
        flexDirection:"row",
        justifyContent:'space-evenly',
        width:'60%'
    },
    
    headerAddList:{
        width:'100%',
        flexDirection:"row",
        justifyContent:'space-evenly'
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

    edit:{
        borderTopWidth:3,
        borderColor:'black',
        height:"30%",
        alignItems:'center',
    },

    editBody:{
        alignItems:'center'
    },
    
    calendar:{
        width:"90%",
        alignSelf:"center",
    },

})

export {styles}