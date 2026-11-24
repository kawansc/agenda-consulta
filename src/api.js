// Camada de acesso aos dados. Hoje usa o banco local do navegador (src/db).
// Para usar um servidor de verdade no futuro, é só trocar a implementação aqui.
import database, { getToken, setToken } from "./db/database";

export { getToken, setToken };
export default database;
