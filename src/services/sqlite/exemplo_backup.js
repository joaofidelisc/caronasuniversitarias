import db from "./SQLiteDatabse";

/**
 * INICIALIZAÇÃO DA TABELA
 * - Executa sempre, mas só cria a tabela caso não exista (primeira execução)
 */
db.transaction((tx) => {
  //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  tx.executeSql("DROP TABLE infoApp;");
  //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>

  tx.executeSql(
    "CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY AUTOINCREMENT, brand TEXT, model TEXT, hp INT);"
  );
});

/**
 * CRIAÇÃO DE UM NOVO REGISTRO
 * - Recebe um objeto;
 * - Retorna uma Promise:
 *  - O resultado da Promise é o ID do registro (criado por AUTOINCREMENT)
 *  - Pode retornar erro (reject) caso exista erro no SQL ou nos parâmetros.
 */
const create = (obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "INSERT INTO cars (brand, model, hp) values (?, ?, ?);",
        [obj.brand, obj.model, obj.hp],
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

/**
 * ATUALIZA UM REGISTRO JÁ EXISTENTE
 * - Recebe o ID do registro e um OBJETO com valores atualizados;
 * - Retorna uma Promise:
 *  - O resultado da Promise é a quantidade de registros atualizados;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
const update = (id, obj) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "UPDATE cars SET brand=?, model=?, hp=? WHERE id=?;",
        [obj.brand, obj.model, obj.hp, id],
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

/**
 * BUSCA UM REGISTRO POR MEIO DO ID
 * - Recebe o ID do registro;
 * - Retorna uma Promise:
 *  - O resultado da Promise é o objeto (caso exista);
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
const find = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM cars WHERE id=?;",
        [id],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array[0]);
          else reject("Obj not found: id=" + id); // nenhum registro encontrado
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

/**
 * BUSCA UM REGISTRO POR MEIO DA MARCA (brand)
 * - Recebe a marca do carro;
 * - Retorna uma Promise:
 *  - O resultado da Promise é um array com os objetos encontrados;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
 *  - Pode retornar um array vazio caso nenhum objeto seja encontrado.
 */
const findByBrand = (brand) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM cars WHERE brand LIKE ?;",
        [brand],
        //-----------------------
        (_, { rows }) => {
          if (rows.length > 0) resolve(rows._array);
          else reject("Obj not found: brand=" + brand); // nenhum registro encontrado
        },
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

/**
 * BUSCA TODOS OS REGISTROS DE UMA DETERMINADA TABELA
 * - Não recebe parâmetros;
 * - Retorna uma Promise:
 *  - O resultado da Promise é uma lista (Array) de objetos;
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL;
 *  - Pode retornar um array vazio caso não existam registros.
 */
const all = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "SELECT * FROM cars;",
        [],
        //-----------------------
        (_, { rows }) => resolve(rows._array),
        (_, error) => reject(error) // erro interno em tx.executeSql
      );
    });
  });
};

/**
 * REMOVE UM REGISTRO POR MEIO DO ID
 * - Recebe o ID do registro;
 * - Retorna uma Promise:
 *  - O resultado da Promise a quantidade de registros removidos (zero indica que nada foi removido);
 *  - Pode retornar erro (reject) caso o ID não exista ou então caso ocorra erro no SQL.
 */
const remove = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      //comando SQL modificável
      tx.executeSql(
        "DELETE FROM cars WHERE id=?;",
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

export default {
  create,
  update,
  find,
  findByBrand,
  all,
  remove,
};

//----------------------------------------------

// import React from 'react';
// import { StyleSheet, Text, View, } from 'react-native';

// import Car from './src/services/sqlite/Car'

// /**
//  * Example Car Object: {
//  *  id: (auto generated in sqlite), 
//  *  brand: 'citroen',
//  *  model: 'ds3 performance',
//  *  hp: 208
//  * } 
//  */
// const printCar = (car) => {
//   console.log(`id:${car.id}, brand:${car.brand}, model:${car.model}, hp:${car.hp}`)
// }

// export default function App() {

//   //forced error catch
//   Car.find( -1 ) 
//     .then( car => printCar(car) )
//     .catch( err => console.log(err) )

//   //create
//   Car.create( {brand:'vw', model:'brasilia', hp:65} )
//     .then( id => console.log('Car created with id: '+ id) )
//     .catch( err => console.log(err) )

//   Car.create( {brand:'vw', model:'fusca', hp:34} )
//     .then( id => console.log('Car created with id: '+ id) )
//     .catch( err => console.log(err) )

//   Car.create( {brand:'ford', model:'corcel', hp:70} )
//     .then( id => console.log('Car created with id: '+ id) )
//     .catch( err => console.log(err) )

//   //find id=1
//   Car.find( 1 ) 
//     .then( car => printCar(car) )
//     .catch( err => console.log(err) )

//   //find brand=vw
//   Car.findByBrand( 'vw' ) 
//     .then( cars => console.log(cars) )
//     .catch( err => console.log(err) )

//   //update
//   Car.update( 1, {brand:'gm', model:'corsa', hp:70} )
//     .then( updated => console.log('Cars updated: '+ updated) )
//     .catch( err => console.log(err) )
  
//   //all
//   Car.all()
//     .then( 
//       cars => cars.forEach( c => printCar(c) )
//     )

//   //delete
//   Car.remove(1)
//     .then( updated => console.log('Cars removed: '+ updated) )
//     .catch( err => console.log(err) )
  
//   Car.remove(2)
//     .then( updated => console.log('Cars removed: '+ updated) )
//     .catch( err => console.log(err) )

//   Car.remove(3)
//     .then( updated => console.log('Cars removed: '+ updated) )
//     .catch( err => console.log(err) )

//   //forced empty array (all=[])
//   Car.all()
//     .then( 
//       cars => console.log(cars)
//     )

//   return (
//     <View style={styles.container}>
//       <Text>(Check Console)</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center', 
//     justifyContent: 'center', 
//   },
// });