// import axios from 'axios'

let boardSelected;

const containerTasks = document.querySelector(".container-tasks")

//pegar o id do usuario, dai colocar como parametro no getBoards?
 async function getPersonConfigById(personId) {

   const response = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/PersonConfigById?PersonId=${personId}`)
        
        const dataConfigUser = await response.json()
   
        console.log(dataConfigUser);
        
 }

const person = JSON.parse(localStorage.getItem("userDatas"))

console.log(person.id);

getPersonConfigById(person.id)

//função validando null de qualquer input
function validNull(input){

    if (!input.trim()) {

        alert("Campo de texto Vazio, Por Favor digite algo antes de confirmar");
        return true
    }
    return false
}


//alternando bg mode

const inputCheckBoxSwitch = document.getElementById("background-button")
const statusBackgroundText = document.querySelector("#status-background")

const containerTask = document.querySelector(".background-board")
const header = document.getElementsByTagName("header")[0]
const column = document.querySelector(".column")

inputCheckBoxSwitch.addEventListener("change", function(){

    if(inputCheckBoxSwitch.checked){

        statusBackgroundText.textContent = "Light"
        containerTask.classList.add("light-mode-board")
        column.classList.add("light-mode-column")

        }else{

            statusBackgroundText.textContent = "Dark"
            containerTask.classList.remove("light-mode-board")
            column.classList.remove("light-mode-column")

        }
})



const buttonNewColumn = document.getElementById("btn-new-column")

buttonNewColumn.style.display = "none"

buttonNewColumn.addEventListener("click", createColumn);

function createColumn() {

    const containerTasks = document.querySelector(".container-tasks");

    let newColumn = document.createElement("div");
    
        newColumn.classList.add("column", "input-column");

    let inputDiv = document.createElement("input");

        inputDiv.id = "input-name-column";
        inputDiv.classList.add("form-control");
        inputDiv.type = "text";
        inputDiv.placeholder = "Nome da Coluna";

    const buttonConfirm = document.createElement("button");

        buttonConfirm.classList.add("btn", "btn-primary");
        buttonConfirm.id = "btn-confirm-new-column";
        buttonConfirm.type = "button";
        buttonConfirm.textContent = "Confirmar Coluna";

    buttonConfirm.addEventListener("click", function(){ 

        confirmColumnName(containerTasks, newColumn, inputDiv)
    });

            newColumn.appendChild(inputDiv);
            newColumn.appendChild(buttonConfirm);

    containerTasks.insertBefore(newColumn, buttonNewColumn);
}

function confirmColumnName(containerTasks, newColumn, inputDiv) {

    const inputNameColumn = inputDiv.value;

    if (validNull(inputNameColumn)) {
        return;
    }

    const columnDiv = document.createElement("div");
        columnDiv.classList.add("column");

    const headerColumn = createHeaderColumn(inputNameColumn, columnDiv);

    const buttonNewCard = document.createElement("button");

        buttonNewCard.id = "buttonNewCard";
        buttonNewCard.type = "button";
        buttonNewCard.textContent = "Add Cartão +";
        buttonNewCard.classList.add("btn", "btn-primary");

    buttonNewCard.addEventListener("click", function(){

        createNewCards(columnDiv, buttonNewCard)

    });

    columnDiv.appendChild(headerColumn);
    columnDiv.appendChild(buttonNewCard);

    containerTasks.insertBefore(columnDiv, buttonNewColumn);

    newColumn.remove();
     postColumns(boardSelected, inputNameColumn);

            
}

function createHeaderColumn(inputNameColumn, columnDiv) {

    const headerColumn = document.createElement("div");

        headerColumn.classList.add("header-column");

    const titleColumn = document.createElement("h5");

        titleColumn.classList.add("column-name");
        titleColumn.textContent = inputNameColumn;

    const itemPencil = document.createElement("i");

        itemPencil.classList.add("bi", "bi-pencil");
        itemPencil.id = "edit-column";

    itemPencil.addEventListener("click", function(){
        editBoard(columnDiv)
    });

    headerColumn.appendChild(titleColumn);
    headerColumn.appendChild(itemPencil);

    return headerColumn;
}

function createNewCards(columnDiv, buttonNewCard) {


    const inputCard = document.createElement("input");

        inputCard.type = "text";
        inputCard.id = "descriptionCard";
        inputCard.classList.add("form-control");
        inputCard.placeholder = "Descrição Do Cartão..";

    const buttonConfirmDescriptionCard = document.createElement("button");

        buttonConfirmDescriptionCard.textContent = "Confirmar Cartão";
        buttonConfirmDescriptionCard.classList.add("btn", "btn-success");
        buttonConfirmDescriptionCard.type = "button";

    buttonConfirmDescriptionCard.addEventListener("click", function(){

        confirmCard(columnDiv, buttonNewCard, inputCard, buttonConfirmDescriptionCard)

    });

            columnDiv.insertBefore(inputCard, buttonNewCard);
            columnDiv.insertBefore(buttonConfirmDescriptionCard, buttonNewCard);
}

function confirmCard(columnDiv, buttonNewCard, inputCard, buttonConfirmDescriptionCard) {


    const descriptionCard = inputCard.value;

    if (validNull(descriptionCard)) {
        return;
    }

    const cardTask = document.createElement("div");

        cardTask.classList.add("card-task");
        cardTask.textContent = descriptionCard;

    columnDiv.insertBefore(cardTask, buttonNewCard);

    inputCard.remove();
    buttonConfirmDescriptionCard.remove();

    const columnId = columnDiv.id

    postTasks(columnId, descriptionCard);



}




//pegar dados dos boards e printalos no dropdown

async function getBoardsToDropDown() {

    try{
    const response = await fetch("https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Boards");

    if(!response.ok){

        console.error(`Erro Na Requisição: ${response.statusText}`)

    }

    const boardsData = await response.json()

    console.log(boardsData) //conferindo resposta

    const dropdownUL = document.querySelector(".dropdown-menu")

    boardsData.forEach(board => {

        const li = document.createElement("li");
        const a = document.createElement("a");

        a.classList.add("dropdown-item", "board-item")
        a.value = board.Id
        a.innerText = board.Name;

        li.appendChild(a)
        li.addEventListener("click", (e)=> {
            e.preventDefault()

            loadBoardPicked(board.Id)
            getColumnsByBoardId(board.Id)
            boardSelected = board.Id

        })

        dropdownUL.appendChild(li)
    });

    }catch(erro){
        console.error("Erro No Servidor:", erro)
    }
    
}

async function loadBoardPicked(boardId){

    buttonNewColumn.style.display = "block"

    try{

        const resposta = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Board?BoardId=${boardId}`)

        const dataBoard = await resposta.json()
    
        const nameBoard = document.querySelector(".boardName")
    
        const descriptionBoard = document.querySelector(".boardDescription")
    
        // const backgroundBoard = document.querySelector(".background-board")
    
        nameBoard.innerText = dataBoard.Name

        descriptionBoard.innerText = dataBoard.Description
        // backgroundBoard.style.setProperty("background-color", dataBoard.HexaBackgroundCoor);
        
        console.log("ID DO BOARD:" + " " + boardId)

        
    }catch(erro){

        console.error("Erro ao se Conectar ao Servidor", erro)

    }

}

getBoardsToDropDown()

//fim

function editBoard(columnDiv){
    
    columnDiv.classList.add("edit-column-style")
    
    const nameColumnBefore = columnDiv.querySelector(".column-name");
    const inputEditNameColumn = document.createElement("input")

        inputEditNameColumn.classList.add("form-control")
        inputEditNameColumn.id = "input-edit-name"
        inputEditNameColumn.value = nameColumnBefore.textContent


    const trashIcon = document.createElement("i")

            trashIcon.classList.add("bi", "bi-trash")

            columnDiv.appendChild(trashIcon)

                trashIcon.addEventListener("click", function(){

                deleteColumn(columnDiv.id).then(() => {


                        columnDiv.remove();

                    alert("Coluna deletada com sucesso!");

                })
                .catch((erro) => {
                    
                    console.error("Erro ao deletar a coluna:", erro);
                    alert("Falha ao deletar a coluna.");
                });


                
                 })                


    nameColumnBefore.textContent = ""

            nameColumnBefore.appendChild(inputEditNameColumn)


    inputEditNameColumn.addEventListener("keydown", function(e){

        if (e.key === "Enter") { 
            column.classList.remove("edit-column-style")

            const newNameColumn = inputEditNameColumn.value


            if(validNull(newNameColumn)){
                return
            }
      
            nameColumnBefore.textContent = newNameColumn;
            inputEditNameColumn.remove()
        }
    })
}

function helloUser(){

    const boardName = document.querySelector(".boardName")

   const dataUser =  JSON.parse(localStorage.getItem("userDatas"))

   console.log(dataUser);

   boardName.innerHTML = `Olá, ${dataUser.name.split(" ")[0]}`

}

helloUser()


async function deleteColumn(columnId) {

    try{

        const response = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Column?ColumnId=${columnId}`,
            {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );


    }catch(erro){

        console.error("Erro De Delete ", erro)

    }

    
    
}


function logout(){

    localStorage.removeItem("userDatas")
    window.location.href = "/paginaLogin/index.html"

}

let indexPosition = 1

async function postColumns(boardId,nameColumn) {

    const url = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Column"

    try{

        const dataColumn = {

            BoardId: boardId,
            Name: nameColumn,
            IsActive: true,
            CreatedBy: 6, 

            }
         
        const response =  await fetch(url,
            {
            method: "POST",
             headers: {"Content-Type": "application/json"},
             body: JSON.stringify(dataColumn)

              })

    if(!response.ok){

        console.log(`Erro De Post ${response.statusText}`);

        if(response.status === 400){

            console.log("Erro do cliente")

        }
    }

    const respostaDataColumn = await response.json()

    console.log("Coluna Criada com Sucesso, ID DA COLUNA: ", respostaDataColumn)



    }catch(erro){

        console.error("Erro de Servidor", erro)
    }

}


async function postTasks(columnId, titleTask){

    const dataTask = {

        ColumnId: columnId,
        Title: titleTask,
        Description: "",
        IsActive: true,
        CreatedBy: 6
}


    const response = await fetch("https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Task",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dataTask)
        }

    )

    const idTask = await response.json()

    console.log(idTask);

}

async function getColumnsByBoardId(boardId) {

    const APIurl = `https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ColumnByBoardId?BoardId=${boardId}`;

    try {
        const response = await fetch(APIurl);

        if (!response.ok) {
            console.error(`Erro na requisição: ${response.statusText}`);
        }

        const dataColumns = await response.json();

        console.log(dataColumns) //array das Columns
        
        printColumns(dataColumns); // Exibe as colunas antes das tasks  

        //iterarando o array de columns para acessar cada um
        dataColumns.forEach((column) => {

            console.log(column.Id)

            //o then aqui ta tratando o return da promise getTasksByColumnId
            getTasksByColumnId(column.Id).then((arrayTasks) => {

                console.log(arrayTasks) 

                    printTasks(column.Id, arrayTasks)

                })
        });

    } catch (error) {

        console.error("Erro ao obter colunas:", error);
    }
}


async function getTasksByColumnId(columnId) {

    const url = `https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/TasksByColumnId?ColumnId=${columnId}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Erro na requisição: ${response.statusText}`);
        }

        const arrayTasks = await response.json();

        return arrayTasks;

    } catch (error) {
        console.error(`Erro ao pegar tasks`, error);
    }
}

function printColumns(columns) {

    containerTasks.innerHTML = "";

    columns.forEach((column) => {

        const columnDiv = document.createElement("div")
            columnDiv.classList.add("column")
            columnDiv.id = column.Id

        const headerColumn = document.createElement("div")

            headerColumn.classList.add("header-column")

        const titleColumn = document.createElement("h5")

            titleColumn.textContent = column.Name
            titleColumn.classList.add("column-name")


        const itemPencil = document.createElement("i")

            itemPencil.classList.add("bi", "bi-pencil")
            itemPencil.id = "edit-column"
            itemPencil.addEventListener("click", function() {
                editBoard(columnDiv);
            });
            
        const buttonNewCard = document.createElement("button")

            buttonNewCard.id = "buttonNewCard"
            buttonNewCard.type = "button"
            buttonNewCard.textContent = "Add Cartão +"
            buttonNewCard.classList.add("btn", "btn-primary")

            buttonNewCard.addEventListener("click", function(){

                createNewCards(columnDiv, buttonNewCard)
        
            });

                headerColumn.appendChild(titleColumn)
                headerColumn.appendChild(itemPencil)

                columnDiv.appendChild(headerColumn)
                columnDiv.appendChild(buttonNewCard)


            containerTasks.appendChild(columnDiv);
    });

    containerTasks.appendChild(buttonNewColumn);

}


function printTasks(columnId, arrayTasks) {

    const columnDiv = document.getElementById(`${columnId}`);

    const buttonNewCard = columnDiv.querySelector("#buttonNewCard");
    
    arrayTasks.forEach((task) => {

        const tasksStruct = document.createElement("div");

        tasksStruct.classList.add("card-task");
        tasksStruct.id = task.Id
        
        tasksStruct.textContent = task.Title;
        columnDiv.insertBefore(tasksStruct, buttonNewCard);

    });
}


