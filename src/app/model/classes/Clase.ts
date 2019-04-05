import { Atributo } from './Atributo';
import { TablaOcurrencias } from './TablaOcurrencias';

export class Clase{
    public nombre: string;
    public tablaOcurrencias: TablaOcurrencias;
    public probabilidad: number;

    constructor(nombre: string){
        this.nombre = nombre;
        this.tablaOcurrencias = new TablaOcurrencias();
    }

    public obtenerProbVector(vectorOcurrencias: number[], laplace?: boolean, alpha?: number, n?: number): number{
        let sumaAtributo;
        let vectorProbabilidades: number[] = [];

        for(let i = 0; i < vectorOcurrencias.length; i++){
            sumaAtributo = 0;
            for(let j = 0; j < this.tablaOcurrencias.tabla.length; j++){
                sumaAtributo += this.tablaOcurrencias.tabla[j][i] == vectorOcurrencias[i] ? 1 : 0;
            }

            if(laplace){
                vectorProbabilidades[i] = sumaAtributo + alpha / this.tablaOcurrencias.tabla.length + (alpha * n);
            }else{
                vectorProbabilidades[i] = sumaAtributo / this.tablaOcurrencias.tabla.length;
            }            
        }

        return vectorProbabilidades.reduce((total, valor) => total*valor);
    }

    public probAtributo(atributo: Atributo, valor: Number){
        let posAtributo = this.tablaOcurrencias.getPosAtributo(atributo);
        let suma: number = 0;

        for(let i = 0; i < this.tablaOcurrencias.tabla.length; i++){
            suma += this.tablaOcurrencias.tabla[i][posAtributo] == valor ? 1 : 0;
        }

        return suma / this.tablaOcurrencias.tabla.length;
    }
}