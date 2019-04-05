import { Atributo } from './Atributo';
import { Clase } from './Clase';
import { Ejemplo } from './Ejemplo';
import { TablaOcurrencias } from './TablaOcurrencias';

export class ClasificadorTexto{
    public atributos: Atributo[];
    public clases: Clase[];
    public tablasOcurrencias: TablaOcurrencias[];

    constructor(){
        this.atributos = [];
        this.clases = [];
        this.tablasOcurrencias = [];
    }

    public entrenar(ejemplos: Ejemplo[]){        
        let vectorOcurrencias: number[];
        let claseEjemplo: Clase;

        // Crear modelo (obtener clases y atributos)
        this.crearModelo(ejemplos);
        
        // Llenar tablas de ocurrencias para cada clase por cada ejemplo
        for(let ejemplo of ejemplos){
            // A partir de texto creamos el vector de atributos (ocurrrencias)
            vectorOcurrencias = this.crearVectorOcurrencias(ejemplo.texto, this.atributos);

            // Metemos la ocurrencia en la clase que corresponde
            claseEjemplo = this.clases.find(c => ejemplo.clase.nombre == c.nombre);            
            claseEjemplo.tablaOcurrencias.agregarFilaOcurrencias(vectorOcurrencias);
        }

        // Calculamos p(Ck) para cada clase
        for(let clase of this.clases){
            clase.probabilidad = clase.tablaOcurrencias.tabla.length / ejemplos.length;
        }       
        
        console.log("Clases entrenar: ", this.clases);
    }

    public clasificar(texto: string): Clase{
        let vectorOcurrencias: number[];
        let probsXDadoClase: number[] = [];
        let probsClaseDadoX: number[] = [];
        let px = 0;
        let clase: Clase;

        vectorOcurrencias = this.crearVectorOcurrencias(texto, this.atributos);
        this.clases.forEach((clase, i) => {            
            probsXDadoClase[i] = clase.obtenerProbVector(vectorOcurrencias, true, 1, 2);
            px += probsXDadoClase[i] * clase.probabilidad;            
        });

        console.log("probsXDadoClase: ", probsXDadoClase);
        console.log("px", px);

        this.clases.forEach((clase, i) => {
            probsClaseDadoX[i] = (probsXDadoClase[i] * clase.probabilidad) / px;
        });

        clase = this.obtenerClaseMasProbable(probsClaseDadoX);        
        console.log("clase", clase);   
        
        return clase;
    }    

    private obtenerClaseMasProbable(probsClaseDadoX: number[]){
        let probMayor: number;

        probMayor = probsClaseDadoX.reduce((total, num) => Math.max(total, num));
        console.log("Probabilidad mayor: ", probMayor);
        return this.clases[probsClaseDadoX.indexOf(probMayor)];
    }

    private crearVectorOcurrencias(texto: string, atributos: Atributo[]): number[]{        
        let atributosTexto: Atributo[] = [];
        let vectorOcurrencias: number[] = [];
        let posAtributo: number;

        atributosTexto = this.obtenerAtributosDeTexto(texto);
        vectorOcurrencias = new Array(atributos.length).fill(0);                        
        for(let atributo of atributosTexto){
            posAtributo = this.getPosAtributo(atributo);

            // Si es una palabra nueva que no esta registrada en los atributos
            if(posAtributo == -1){
                throw new Error("La palabra " + atributo.nombre + " no pertenece al universo");
            }

            vectorOcurrencias[this.getPosAtributo(atributo)] = 1;
        }

        return vectorOcurrencias;
    }

    private crearModelo(ejemplos: Ejemplo[]){
        for(let ejemplo of ejemplos){
            this.atributos = this.atributos.concat(this.obtenerAtributosDeTexto(ejemplo.texto));
            this.clases.push(ejemplo.clase);
        }

        this.atributos = this.getUnique(this.atributos, "nombre");
        this.clases = this.getUnique(this.clases, "nombre");

        this.clases.forEach(clase => {
            clase.tablaOcurrencias.setAtributos(this.atributos);
        });
    }

    private obtenerAtributosDeTexto(texto: string): Atributo[]{
        return this.getUnique(texto.split(" ").map(p => new Atributo(p)), "nombre");
    }

    private getUnique(arr, comp) {
        const unique = arr
            .map(e => e[comp])
      
            // store the keys of the unique objects
            .map((e, i, final) => final.indexOf(e) === i && i)
      
            // eliminate the dead keys & store unique objects
            .filter(e => arr[e]).map(e => arr[e]);
      
        return unique;
    }

    private getPosAtributo(atributo: Atributo){
        return this.atributos.map(a => a.nombre).indexOf(atributo.nombre);
    }
}