import { Router } from 'express';
import { auth } from '../helpers/service';
import cm from '../controllers/controllersManga';
import { upload } from '../helpers/service';

class Rutasmanga{

    router: Router;

    constructor() {

        this.router = Router();
        this.routes();

    }
   
    routes() {
        
        this.router.post('/manga', upload.single('image'), cm.crearManga);

        this.router.get('/manga', auth, cm.obtenerMangas);

        this.router.get('/manga/:id', auth, cm.obtenerManga);

        this.router.put('/manga', auth, upload.single('image'), cm.actualizarManga)

    }
 
}

const rutam = new Rutasmanga();

export default rutam.router