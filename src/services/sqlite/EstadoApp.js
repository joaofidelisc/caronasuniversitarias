import db from './SQLitedatabase';

db.transaction((tx)=>{
    //Descomentar a linha abaixo em caso de testes
    // tx.executeSql("DROP TABLE user;");
    tx.executeSql(
        "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY, cidade TEXT, estado TEXT, nomeDestino TEXT, uidMotorista TEXT, nomeMotorista TEXT, veiculoMotorista TEXT, placaVeiculoMotorista TEXT, motoristaUrl TEXT, numVagas INTEGER, passageiros TEXT);"
    );
    console.log('Tabela `user` criada!');
})

const insertData = (obj) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO user (cidade, estado, nomeDestino, uidMotorista, nomeMotorista, veiculoMotorista, placaVeiculoMotorista, motoristaUrl, numVagas, passageiros, id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
          [obj.cidade, obj.estado, obj.nomeDestino, obj.uidMotorista, obj.nomeMotorista, obj.veiculoMotorista, obj.placaVeiculoMotorista, obj.motoristaUrl, obj.numVagas, obj.passageiros, obj.id],
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
          "UPDATE user SET uidMotorista=?, nomeMotorista=?, veiculoMotorista=?, placaVeiculoMotorista=?, motoristaUrl=?, passageiros=?",
          [obj.uidMotorista, obj.nomeMotorista, obj.veiculoMotorista, obj.placaVeiculoMotorista, obj.motoristaUrl, obj.passageiros],
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

export default {
    insertData,
    updateData,
    findData,
    removeData
};