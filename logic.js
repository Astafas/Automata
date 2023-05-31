class transition{

    constructor(target,Symbol){
        this.target = target;
        this.Symbol = Symbol;
    }

}

class State{
    transition = [];

    constructor(nom){
        this.nom = nom;
    }

}

var Alphabet = [];
var States = [];
var estadoFinal;
var ruta = [];
var initOp = true;
var estAct;

$(document).ready(function(){
    const elem = new State("q0");
    States.push(elem);
    RewriteTable();
    LLenaEstadoFinal();
});

function AddSymbol(){

    const elem = $("#NewSymbol").val();

    const res = Alphabet.includes(elem);
    if(!res){
        Alphabet.push(elem);
        printTable();
    }else{
        alert("Simbolo existente");
    }

    $("#NewSymbol").val("");
}

function printTable(){
    var AlphabetTemp = "";
    $("#alphabetSymbols").text("");

    AlphabetTemp = "Σ = {";

    for(i=0;i<Alphabet.length;i++){

        AlphabetTemp += "'" + Alphabet[i] + "'";

        if(i+1<Alphabet.length)
            AlphabetTemp += ","
    }

    AlphabetTemp += "}";
    $("#alphabetSymbols").text(AlphabetTemp);

    RewriteTable();

}

function AddState(){
    var Name = "q" + (States.length);
    const nState = new State(Name);
    States.push(nState);
    RewriteTable();
    LLenaEstadoFinal();
}

function AddTransition(i,target,Symbol){
    var tar = $("#" + target).val();

    if(tar == '#'){
        for(j=0;j<States[i].transition.length;j++){
            if(States[i].transition[j].Symbol == Symbol){
                States[i].transition.splice(j,1);
            }
        }
        return null;
    }

    var nState = States.find(state => state.nom == tar);
    var tr = new transition(nState,Symbol);
    var sState = null;
    
    for(j=0;j<States[i].transition.length;j++){
        if(States[i].transition[j].Symbol == Symbol){
            sState = j;
            break;
        }
    }
    if(sState == null){
        if(tar != "#"){
            States[i].transition.push(tr);
        }
    }
    else{
        States[i].transition[sState].target = nState;
        var param = States[i].transition[sState];
    }
}

function cambiaEstado(){
    estadoFinal = $("#fEstadoFinal").val();
}

function LLenaEstadoFinal(){
    var estadosDisp = "";
    estadosDisp += "<option value=''></option>";
    States.forEach(elementState => {
        estadosDisp += "<option value='" + elementState.nom + "'";
        if(elementState.nom == estadoFinal)
                estadosDisp += " selected=\"selected\"";
        estadosDisp += ">" + elementState.nom + "</option>";
    });
    $("#fEstadoFinal").empty();
    $("#fEstadoFinal").append(estadosDisp);
}

function RewriteTable(){
    
    var estadosDisp = "";
    var i = 0;

    $("#aut_table").empty();
    var titulo = "<tbody><tr>" + "<td>Estado</td>";
    Alphabet.forEach(element => {
        titulo += "<td>" + element + "</td>";
    });
    titulo += "</tr>";
    $("#aut_table").append(titulo);
    States.forEach(elementState => {
        var elem = "<tr>";
        var id_option;
        var elem_nom = elementState.nom;
        elem += "<td>" + elementState.nom + "</td>"
        Alphabet.forEach(element => {
            estadosDisp = "";
            elem += "<td>";
            id_option = 'option_id_' + elem_nom + "_" + element;
            estadosDisp += " <select class='select-tran form-control' onchange='AddTransition(" + i + ",\"" + id_option + "\",\"" + element + "\")' id='" + id_option + "'>";
            var selOpt;

            selOpt =  elementState.transition.find(elemento => elemento.Symbol == element);

            estadosDisp += "<option value='#'>#</option>";
            States.forEach(elementState => {
                estadosDisp += "<option value='" + elementState.nom + "'";
                if(selOpt)
                    if(selOpt.target.nom == elementState.nom)
                        estadosDisp += " selected=\"selected\"";
                estadosDisp += ">" + elementState.nom + "</option>";
            });
        
            estadosDisp += "</select>";
            elem += estadosDisp;
            elem += "</td>";
        });
        elem += "</tr>";
        $("#aut_table").append(elem);
        i++;
    });
    
}

function NextIteration(estAct,actChar){
    var find = false;
    for(i=0;i<estAct.transition.length;i++){
        if(estAct.transition[i].Symbol == actChar){
            estAct = estAct.transition[i].target;
            find = true;
            break;
        }
    }
    if(find){
        return(estAct);
    }
    else{
        alert("No existe un camino valido");
        return null;
    }
}

function buscaDict(nval){
    for(i = 0; i<Alphabet.length;i++){
        if(Alphabet[i] == nval){
            return true;
        }
    }
    return false;
}

function recorreAutomata(){

    estAct = States[0];
    var strEval = $("#str_eval").val();
    var resp = null;
    var cont = 0;
    ruta = [];
    ruta.push(estAct.nom);
    var ruta_res = estAct.nom + "->";
    $("#strRes").text("");

    while(cont < strEval.length && estAct.transition.length > 0){
        var actChar = strEval.charAt(cont);
        if(!buscaDict(actChar)){
            alert("Simbolo invalido");
            return null;
        }
        estAct = NextIteration(estAct,actChar);
        if(estAct)
            ruta.push(estAct.nom);
        else{
            break;
        }
        cont++;
    }
    
    var resp = "";
    for(i=0;i<ruta.length;i++){
        resp += ruta[i];
        if(i<ruta.length-1)
            resp += "->";
    }

    initOp = true;
    if(estAct){
        if(estAct.nom == estadoFinal && cont == strEval.length){
            $("#strRes").text(resp);
            alert("La cadena cumple con el resultado");
        }
        else{
            $("#strRes").text(resp);
            alert("La cadena no cumple con las reglas");
        }
    }
    else{
        $("#strRes").text(resp);
    }
    

}

