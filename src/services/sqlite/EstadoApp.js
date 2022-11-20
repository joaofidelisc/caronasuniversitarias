// import { enablePromise } from 'react-native-sqlite-storage';
import db from './SQLitedatabase';

// enablePromise(true);

const createTable = async()=>{
    try{
        db.transaction((tx)=>{
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS infoApp (cidade TEXT, estado TEXT)"
            );
        })
        console.log('tabela criada!');
    }catch(error){
        console.log('erro em createTable');
    }
}

const insertData = async(cidade, estado)=>{
    try{
        (await db).transaction(async (tx)=>{
            await tx.executeSql(
                "INSERT INTO infoApp (cidade, estado) VALUES (?, ?)", [cidade, estado]
            );
        })
    }catch(error){
        console.log('erro em insertData');
    }
}

const getAll = async()=>{
    try{
        (await db).transaction((tx)=>{
            tx.executeSql(
                "SELECT * FROM infoApp",
                [],
                (tx, results)=>{
                    var len = results.rows.length;
                    if (len>0){
                        console.log(results.rows.item(0));
                    }
                }
            )
        })
    }catch(error){
        console.log(error);
    }
}

const getData = async()=>{
    try{
        (await db).transaction((tx)=>{
            tx.executeSql(
                "SELECT cidade, estado FROM infoApp",
                [],
                (tx, results)=>{
                    var len = results.rows.length;
                    if (len>0){
                        var cidade = results.rows.item(0).cidade;
                        var estado = results.rows.item(0).estado;
                        console.log('cidade:', cidade);
                        console.log('estado:', estado);
                        return [results.rows.item(0).cidade, estado];
                        //utilizar hooks aqui (setCidade, setEstado, etc...);
                    }else{
                        console.log('caiu no else do getData!');
                    }
                }
            );
        })
    }catch(error){
        console.log('erro em getData');
    }
}


const updateData = async(cidade, estado)=>{
    try{
        (await db).transaction((tx)=>{
            tx.executeSql(
                "UPDATE infoApp SET cidade=?, estado=?" ,
                [cidade, estado],
                ()=>{ console.log('dados atualizados!') },
                error => { console.log(error) }
            );
        })
    }catch(error){
        console.log('erro em getData');
    }
}

const removeData = async()=>{
    try{
        (await db).transaction((tx)=>{
            tx.executeSql(
                "DELETE FROM infoApp",
                [],
                ()=>{console.log('informacoes apagadas!')},
                error=>{ console.log(error) }
            )
        })
    }catch(error){
        console.log('erro em removeData')
    }
}

export default {
    createTable,
    insertData,
    updateData,
    getData,
    removeData
};