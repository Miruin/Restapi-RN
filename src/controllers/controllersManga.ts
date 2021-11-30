import { Request, Response} from 'express';
import fs from 'fs';
import sql from 'mssql';
import config from "../config/config";
import { getcon, getdatosmanga } from '../database/connection';

class Controllersmanga {

    constructor() {
        
    }

    async crearManga(req: Request, res: Response): Promise<any> {

        let { generomanga, namemanga, descripcionmanga, estadomanga } = req.body;
        let urlarchivo = "https://restapi-mr.herokuapp.com/manga/"+namemanga+"/"+req.file?.filename; 
        
        try {
            
            const pool = await getcon();

            if (!namemanga || !generomanga || !estadomanga || !req.file) {

                pool.close();    
                return res.status(400).send({ msg: 'No se han llenado los campos'});
                
            } else {

                if (!descripcionmanga) descripcionmanga = 'No hay una Sinopsis';

                const result = await getdatosmanga(pool, namemanga);

                if (result.recordset[0]) {

                    pool.close();
                    return res.status(400).send({msg: 'Este manga ya existe'});
                    
                } else {

                    await pool.request()
                    .input('namemanga', sql.VarChar, namemanga)
                    .input('generomanga', sql.VarChar, generomanga)
                    .input('estadomanga', sql.VarChar, estadomanga)
                    .input('descripcionmanga', sql.VarChar, descripcionmanga)
                    .input('imgurlmanga', sql.VarChar, urlarchivo)
                    .query(String(config.q7));
                
                    const result = await getdatosmanga(pool, namemanga);

                    if (result.recordset[0]) {

                        /*let id = result.recordset[0].id_manga; 
                    
                        await pool.request()
                        .input('idmanga', sql.Int, id)
                        .input('nick', sql.VarChar, req.user)
                        .query(String(config.q9));*/

                        pool.close();
                        return res.status(200).send({msg: 'Se ha registrado el manga satisfactoriamente'});
                                 
                    } else {

                        pool.close();
                        return res.status(500).send({msg: 'Error en el servidor no se ha registrado el manga'});

                    }
                    
                }  

            }

        } catch (error) {

            console.error(error);
            return res.status(500).send({msg: 'Error en el servidor al registrar un manga'});
            
        } 

    }

    async obtenerMangas (req: Request, res: Response): Promise<any> {

        try {

            const pool = await getcon();
            
            const result = await pool.request().query(String(config.q10));

            if (result.recordset[0]) {

                pool.close();
                return res.status(200).send(result.recordset);
                
            } else {

                pool.close();
                return res.status(404).send({msg: 'No se encuentra nignun dato'});
                
            }
            
        } catch (error) {

            console.error(error);
            return res.status(500).send({msg: 'Error en el servidor al obtener informacion de los mangas'});
            
        }
        
    }

    async obtenerManga(req: Request, res: Response): Promise<any>{
        
        let id = req.params.id; 

        try {

            const pool = await getcon();

            const result = await pool.request()
            .input('idmanga', id)
            .query(String(config.q13));

            if(!result.recordset[0]){

                pool.close();
                return res.status(500).send({msg:"Este manga no esta registrado"});
                
            }

            pool.close();
            return res.status(200).send(result.recordset[0]);
            
        } catch (error) {
            
            console.error(error);
            return res.status(500).send({msg: 'Error en el servidor al obtener informacion de un manga'});
            
        }

    }

    async actualizarManga(req: Request, res: Response): Promise<any>{

        let { namemanga, generomanga, estadomanga, descripcionmanga } = req.body;

        try {

            const pool = await getcon();

            const result = await getdatosmanga(pool, namemanga);

            let { id_manga, genero_manga, estado_manga, descripcion_manga  } = result.recordset[0];
            
            if (result.recordset[0]) {

                if (req.file) {
                    

                    fs.readdir('libreria/manga/'+namemanga,(error, files) =>{

                        if (error) {
        
                            console.error(error);
                            pool.close();
                            return res.status(500).send({msg: 'error'});
                                                
                        }
                        

                        fs.unlink('libreria/manga/'+namemanga+'/'+files[0],(error) => {

                            if (error) {

                                console.error(error);
                                pool.close();
                                return res.status(500).send({msg: 'error'});

                            }

                        }); 
            
                    });

                    let urlarchivo = "https://restapi-mr.herokuapp.com/manga/"+namemanga+"/"+req.file?.filename;

                    if (!descripcionmanga) descripcionmanga = 'No hay una Sinopsis';

                    await pool.request()
                    .input('idmanga',  id_manga)
                    .input('generomanga', sql.VarChar, generomanga)
                    .input('estadomanga', sql.VarChar, estadomanga)
                    .input('descripcionmanga', sql.VarChar, descripcionmanga)
                    .input('imgurlmanga', sql.VarChar, urlarchivo)
                    .query(String(config.q12));

                    pool.close;
                    return res.status(200).send({msg: 'Se ha actualizado satisfactoriamente'});
                    
                } else {

                    if (!generomanga || !estadomanga) 
                    return res.status(400).send({msg: 'Porfavor llenar los valores correctamente'});

                    if (generomanga == genero_manga && estadomanga == estado_manga && 
                    descripcionmanga == descripcion_manga){
        
                        pool.close();
                        return res.status(400).send({msg: 'No se ha cambiado ningun valor'});
        
                    }
                            
                    if (!descripcionmanga) descripcionmanga = 'No hay una Sinopsis';
        
                    await pool.request()
                    .input('descripcionmanga', sql.VarChar, descripcionmanga)
                    .input('estadomanga', sql.VarChar, estadomanga)
                    .input('generomanga', sql.VarChar, generomanga)
                    .input('idmanga', id_manga)
                    .query(String(config.q11));
        
                    pool.close;
                    return res.status(200).send({msg: 'Se ha actualizado satisfactoriamente'});
                    
                }
                
            } else {
                
                pool.close();
                return res.status(400).send({msg: 'no se encuentra ese manga'});

            }
            
        } catch (error) {

            console.error(error);
            return res.status(500).send({msg: 'Ha ocurrido un error en el servidor'});

        }
        
    }

}


const cm = new Controllersmanga();

export default cm;