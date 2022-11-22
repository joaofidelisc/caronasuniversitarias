import db from './SQLitedatabase';

db.transaction((tx)=>{
    //Descomentar a linha abaixo em caso de testes
    // tx.executeSql("DROP TABLE user;");
    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, cidade TEXT, estado TEXT, nomeDestino TEXT, uidMotorista TEXT, nomeMotorista TEXT, veiculoMotorista TEXT, placaVeiculoMotorista TEXT, motoristaUrl TEXT);"
    );
    console.log('tabela criada!');
})

const insertData = (obj) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO user (cidade, estado, nomeDestino, uidMotorista, nomeMotorista, veiculoMotorista, placaVeiculoMotorista, motoristaUrl, id) values (?, ?, ?, ?, ?, ?, ?, ?, ?);",
          [obj.cidade, obj.estado, obj.nomeDestino, obj.uidMotorista, obj.nomeMotorista, obj.veiculoMotorista, obj.placaVeiculoMotorista, obj.motoristaUrl, obj.id],
          //-----------------------
          (_, { rowsAffected, insertId }) => {
            if (rowsAffected > 0) resolve(insertId);
            else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
          },
          (_, error) => reject(error) // erro interno em tx.executeSql
        );
      });
    });
  };

  const updateData = (obj, id) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "UPDATE user SET uidMotorista=?, nomeMotorista=?, veiculoMotorista=?, placaVeiculoMotorista=?, motoristaUrl=?",
          [obj.uidMotorista, obj.nomeMotorista, obj.veiculoMotorista, obj.placaVeiculoMotorista, obj.motoristaUrl],
          //-----------------------
          (_, { rowsAffected }) => {
            if (rowsAffected > 0) resolve(rowsAffected);
            else reject("Error updating obj: id=" + id); // nenhum registro alterado
          },
          (_, error) => reject(error) // erro interno em tx.executeSql
        );
      });
    });
  };

  const findData = (id) => {
    return new Promise((resolve, reject) => {
      console.log('linha x findData');
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM user WHERE id=?;",
          [id],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows.item(0));     
            else reject("Obj not found: id=" + id); // nenhum registro encontrado
          },
          (_, error) => reject(error) // erro interno em tx.executeSql
        );
      });
    });
  };

  const removeData = (id) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "DELETE FROM user WHERE id=?;",
          [id],
          //-----------------------
          (_, { rowsAffected }) => {
            resolve(rowsAffected);
          },
          (_, error) => reject(error) // erro interno em tx.executeSql
        );
      });
    });
  };

//   const getAll = () => {
//     return new Promise((resolve, reject) => {
//       db.transaction((tx) => {
//         //comando SQL modificável
//         tx.executeSql(
//           "SELECT cidade, estado, id FROM user;",
//           [],
//           //-----------------------
//           (_, { rows }) => resolve(rows._array),
//           (_, error) => reject(error) // erro interno em tx.executeSql
//         );
//       });
//     });
//   };

// const getAll2 = async()=>{
//     try{
//         (await db).transaction((tx)=>{
//             tx.executeSql(
//                 "SELECT cidade, estado, id FROM user",
//                 [],
//                 (tx, results)=>{
//                     var len = results.rows.length;
//                     if (len>0){
//                         var cidade = results.rows.item(0).cidade;
//                         var estado = results.rows.item(0).estado;
//                         var id = results.rows.item(0).id;
//                         console.log('cidade:', cidade);
//                         console.log('estado:', estado);
//                         console.log('id:', id);
//                         return [results.rows.item(0).cidade, estado];
//                         //utilizar hooks aqui (setCidade, setEstado, etc...);
//                     }else{
//                         console.log('caiu no else do getData!');
//                     }
//                 }
//             );
//         })
//     }catch(error){
//         console.log('erro em getData');
//     }
// }

// const getAll = async()=>{
//     try{
//         (await db).transaction((tx)=>{
//             tx.executeSql(
//                 "SELECT * FROM user",
//                 [],
//                 (tx, results)=>{
//                     var len = results.rows.length;
//                     if (len>0){
//                         console.log(results.rows.item(0));
//                     }
//                 }
//             )
//         })
//     }catch(error){
//         console.log(error);
//     }
// }

// // const getData = () => {
// //     return new Promise((resolve, reject) => {
// //       db.transaction((tx) => {
// //         //comando SQL modificável
// //         tx.executeSql(
// //           "SELECT * FROM user;",
// //           [],
// //           //-----------------------
// //           (_, { rows }) => resolve(rows._array),
// //           (_, error) => reject(error) // erro interno em tx.executeSql
// //         );
// //       });
// //     });
// //   };




// const removeData = async()=>{
//     try{
//         (await db).transaction((tx)=>{
//             tx.executeSql(
//                 "DELETE FROM user",
//                 [],
//                 ()=>{console.log('informacoes apagadas!')},
//                 error=>{ console.log(error) }
//             )
//         })
//     }catch(error){
//         console.log('erro em removeData')
//     }
// }

export default {
    insertData,
    updateData,
    findData,
    removeData
    // getAll,
    // getAll2
};