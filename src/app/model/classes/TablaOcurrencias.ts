import { Atributo } from './Atributo';

export class TablaOcurrencias{
    public header: Atributo[];
    public tabla: number[][];

    constructor(){
        this.tabla = [];
    }

    public setAtributos(atributos: Atributo[]){
        this.header = atributos;
    }

    public agregarFilaOcurrencias(ocurrencias: number[]){
        this.tabla.push(ocurrencias);
    }

    public getPosAtributo(atributo: Atributo){
        return this.header.map(a => a.nombre).indexOf(atributo.nombre);
    }
}