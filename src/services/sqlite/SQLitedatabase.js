import { openDatabase } from "react-native-sqlite-storage";

const db = openDatabase({name:'EstadoAplicacao.db'});

export default db;