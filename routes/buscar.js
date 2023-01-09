import { Router } from "express";
import { buscar } from "../controles/buscar.js";

const routerBus = Router();

// Vamos a usar generalmente los get para las busquedes guiandonos por los path
// tenemos que usar la  coleccion y el termino de busqueda

routerBus.get("/:coleccion/:termino", buscar)




export { routerBus }