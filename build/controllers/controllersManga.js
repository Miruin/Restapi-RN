"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mssql_1 = __importDefault(require("mssql"));
const config_1 = __importDefault(require("../config/config"));
const connection_1 = require("../database/connection");
class Controllersmanga {
    constructor() {
    }
    crearManga(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let { generomanga, namemanga, descripcionmanga, estadomanga } = req.body;
            let urlarchivo = "https://restapi-mr.herokuapp.com/manga/" + namemanga + "/" + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename);
            try {
                const pool = yield (0, connection_1.getcon)();
                if (!namemanga || !generomanga || !estadomanga || !req.file) {
                    pool.close();
                    return res.status(400).send({ msg: 'No se han llenado los campos' });
                }
                else {
                    if (!descripcionmanga)
                        descripcionmanga = 'No hay una Sinopsis';
                    const result = yield (0, connection_1.getdatosmanga)(pool, namemanga);
                    if (result.recordset[0]) {
                        pool.close();
                        return res.status(400).send({ msg: 'Este manga ya existe' });
                    }
                    else {
                        yield pool.request()
                            .input('namemanga', mssql_1.default.VarChar, namemanga)
                            .input('generomanga', mssql_1.default.VarChar, generomanga)
                            .input('estadomanga', mssql_1.default.VarChar, estadomanga)
                            .input('descripcionmanga', mssql_1.default.VarChar, descripcionmanga)
                            .input('imgurlmanga', mssql_1.default.VarChar, urlarchivo)
                            .query(String(config_1.default.q7));
                        const result = yield (0, connection_1.getdatosmanga)(pool, namemanga);
                        if (result.recordset[0]) {
                            /*let id = result.recordset[0].id_manga;
                        
                            await pool.request()
                            .input('idmanga', sql.Int, id)
                            .input('nick', sql.VarChar, req.user)
                            .query(String(config.q9));*/
                            pool.close();
                            return res.status(200).send({ msg: 'Se ha registrado el manga satisfactoriamente' });
                        }
                        else {
                            pool.close();
                            return res.status(500).send({ msg: 'Error en el servidor no se ha registrado el manga' });
                        }
                    }
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ msg: 'Error en el servidor al registrar un manga' });
            }
        });
    }
    obtenerMangas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, connection_1.getcon)();
                const result = yield pool.request().query(String(config_1.default.q10));
                if (result.recordset[0]) {
                    pool.close();
                    return res.status(200).send(result.recordset);
                }
                else {
                    pool.close();
                    return res.status(404).send({ msg: 'No se encuentra nignun dato' });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ msg: 'Error en el servidor al obtener informacion de los mangas' });
            }
        });
    }
    obtenerManga(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = req.params.id;
            try {
                const pool = yield (0, connection_1.getcon)();
                const result = yield pool.request()
                    .input('idmanga', id)
                    .query(String(config_1.default.q13));
                if (!result.recordset[0]) {
                    pool.close();
                    return res.status(500).send({ msg: "Este manga no esta registrado" });
                }
                pool.close();
                return res.status(200).send(result.recordset[0]);
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ msg: 'Error en el servidor al obtener informacion de un manga' });
            }
        });
    }
    actualizarManga(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let { namemanga, generomanga, estadomanga, descripcionmanga } = req.body;
            try {
                const pool = yield (0, connection_1.getcon)();
                const result = yield (0, connection_1.getdatosmanga)(pool, namemanga);
                let { id_manga, genero_manga, estado_manga, descripcion_manga } = result.recordset[0];
                if (result.recordset[0]) {
                    if (req.file) {
                        fs_1.default.readdir('libreria/manga/' + namemanga, (error, files) => {
                            if (error) {
                                console.error(error);
                                pool.close();
                                return res.status(500).send({ msg: 'error' });
                            }
                            fs_1.default.unlink('libreria/manga/' + namemanga + '/' + files[0], (error) => {
                                if (error) {
                                    console.error(error);
                                    pool.close();
                                    return res.status(500).send({ msg: 'error' });
                                }
                            });
                        });
                        let urlarchivo = "https://restapi-mr.herokuapp.com/manga/" + namemanga + "/" + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename);
                        if (!descripcionmanga)
                            descripcionmanga = 'No hay una Sinopsis';
                        yield pool.request()
                            .input('idmanga', id_manga)
                            .input('generomanga', mssql_1.default.VarChar, generomanga)
                            .input('estadomanga', mssql_1.default.VarChar, estadomanga)
                            .input('descripcionmanga', mssql_1.default.VarChar, descripcionmanga)
                            .input('imgurlmanga', mssql_1.default.VarChar, urlarchivo)
                            .query(String(config_1.default.q12));
                        pool.close;
                        return res.status(200).send({ msg: 'Se ha actualizado satisfactoriamente' });
                    }
                    else {
                        if (!generomanga || !estadomanga)
                            return res.status(400).send({ msg: 'Porfavor llenar los valores correctamente' });
                        if (generomanga == genero_manga && estadomanga == estado_manga &&
                            descripcionmanga == descripcion_manga) {
                            pool.close();
                            return res.status(400).send({ msg: 'No se ha cambiado ningun valor' });
                        }
                        if (!descripcionmanga)
                            descripcionmanga = 'No hay una Sinopsis';
                        yield pool.request()
                            .input('descripcionmanga', mssql_1.default.VarChar, descripcionmanga)
                            .input('estadomanga', mssql_1.default.VarChar, estadomanga)
                            .input('generomanga', mssql_1.default.VarChar, generomanga)
                            .input('idmanga', id_manga)
                            .query(String(config_1.default.q11));
                        pool.close;
                        return res.status(200).send({ msg: 'Se ha actualizado satisfactoriamente' });
                    }
                }
                else {
                    pool.close();
                    return res.status(400).send({ msg: 'no se encuentra ese manga' });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).send({ msg: 'Ha ocurrido un error en el servidor' });
            }
        });
    }
}
const cm = new Controllersmanga();
exports.default = cm;
