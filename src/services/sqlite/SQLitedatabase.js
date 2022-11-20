import { enablePromise, openDatabase, SQLiteDatabase } from "react-native-sqlite-storage";

const db = openDatabase({name:'EstadoAplicacao.db', location: 'default'});

export default db;