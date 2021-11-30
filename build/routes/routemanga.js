"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const service_1 = require("../helpers/service");
const controllersManga_1 = __importDefault(require("../controllers/controllersManga"));
const service_2 = require("../helpers/service");
class Rutasmanga {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.post('/manga', service_2.upload.single('image'), controllersManga_1.default.crearManga);
        this.router.get('/manga', service_1.auth, controllersManga_1.default.obtenerMangas);
        this.router.get('/manga/:id', service_1.auth, controllersManga_1.default.obtenerManga);
        this.router.put('/manga', service_1.auth, service_2.upload.single('image'), controllersManga_1.default.actualizarManga);
    }
}
const rutam = new Rutasmanga();
exports.default = rutam.router;
