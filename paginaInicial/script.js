// import axios from 'axios'

//  COISAS PARA FAZER AINDA 

//usar o put para atualizar o nome de task

let themeSelected;
let boardSelected;

const containerTasks = document.querySelector(".container-tasks")

const inputCheckBoxSwitch = document.getElementById("background-button")
const statusBackgroundText = document.querySelector("#status-background")

const containerTask = document.querySelector(".background-board")
const header = document.getElementsByTagName("header")[0]
const column = document.querySelector(".column")

const divBoardSection = document.querySelector(".boards-functions")

var userId = JSON.parse(localStorage.getItem("userDatas")).id


// var handWave = `<picture>
//   <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.webp" type="image/webp">
//   <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.gif" alt="👋" width="32" height="32">
// </picture>`

// var emojiSmile = `<picture>
//   <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f601/512.webp" type="image/webp">
//   <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f601/512.gif" alt="😁" width="32" height="32">
// </picture>`


const buttonBoard = document.querySelector("#btnCreateBoard")



async function putBoardNameDescription(idBoard, newNameBoard, newDescriptionBoard){

    const dataNewBoard = {
        
            "Id": idBoard,
            "Name": newNameBoard,
            "Description": newDescriptionBoard,
            "IsActive": true,
            "CreatedBy": userId,
}


    try{

        const response = await fetch("https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Board",
            {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dataNewBoard)
            }
        )

        
    }catch(erro){

        throw new Error(`Erro ao Atulizar Board ${erro}`);
       
    }

}


async function putNameColumn(columnId, boardId, newNameColumn) {

    try{

        const dataPutColumn ={

            Id: columnId ,
            BoardId: boardId,
            Name: newNameColumn,
            IsActive: true,
        }
    
        const response = await fetch("https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Column",
            {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(dataPutColumn)
    
            }
        )
    }catch(erro){

        throw `Erro ao Atualizar Coluna: ${erro}`

    }

   
    
}

buttonBoard.addEventListener("click", function(){

        const inputNameBoard = document.createElement("input")

            inputNameBoard.type = "text"
            inputNameBoard.classList.add("form-control", "form-board")
            inputNameBoard.placeholder = "Nome do Quadro"
            inputNameBoard.title = "Clique na Tecla Enter para Confirmar o Nome do Quadro"

        const inputDescriptionBoard = document.createElement("input")

            inputDescriptionBoard.type = "text"
            inputDescriptionBoard.classList.add("form-control", "form-board")
            inputDescriptionBoard.placeholder = "Descrição do Quadro"
            inputDescriptionBoard.title = "Clique na Tecla Enter para Confirmar a Descrição de Quadro"

        
        divBoardSection.appendChild(inputNameBoard)

        inputNameBoard.addEventListener("keydown", function(e){


            if(e.key === "Enter"){

                const nameBoardValue = inputNameBoard.value
                
            if(validNull(nameBoardValue)){

                return
            }

            if(nameBoardValue.length < 10){

                showStatusText(`O Nome do Quadro Deve Conter Mais de 10 Caracteres, Tente Novamente`)
                return                

            }

                inputNameBoard.value = nameBoardValue

                divBoardSection.appendChild(inputDescriptionBoard)

                inputDescriptionBoard.addEventListener("keydown", function(e){



                    if(e.key === "Enter"){

                        const descriptionBoardValue = inputDescriptionBoard.value

                        if(validNull(descriptionBoardValue)){

                            return
                        }

    
                        inputDescriptionBoard.value = descriptionBoardValue

                        postBoard(nameBoardValue, descriptionBoardValue)

                        setTimeout(()=>{

                            inputNameBoard.remove()
                            inputDescriptionBoard.remove()

                        }, 1000)

                        setTimeout(() => {

                            window.location.reload()
                            
                        }, 2000);

                        showStatusText(`Quadro '${nameBoardValue}' de Descrição '${descriptionBoardValue}', Criado Com Sucesso  `, true)

                    }
                })

                
            }
        });

        


})

async function postBoard(nameBoard, descriptionBoard){

    try{

        const dataBoard = {

            "Name": nameBoard,
            "Description": descriptionBoard,
            "IsActive": true,
            "CreatedBy": userId,
        }
    
    
    const response = await fetch("https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Board",
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(dataBoard)
    
        }
    )

    if(!response.ok){

        console.error(`Erro ao Fazer Post De Board`)

        if(response === 422){

            showStatusText(`O Nome do Quadro Deve Conter Mais de 10 Caracteres, Tente Novamente`)
            return

        }    

    }

    const idNewBoard = await response.json()
    console.log(`Novo Board de Id: ${idNewBoard}`);
    

    }catch(erro){

        throw `Erro ao Postar Board: ${erro}`
    }

}


function showStatusText(textStatus,trueOrFalse){

    let divStatus = document.querySelector(".status-function-text")

    if(!!trueOrFalse){

        divStatus.classList.remove("error")
        divStatus.classList.add("success")
        divStatus.innerHTML = textStatus
    
         setTimeout(function() {
            divStatus.innerHTML = ""}, 4000); 
    
    }else{

        divStatus.classList.remove("sucess")
        divStatus.classList.add("error")
        divStatus.innerHTML = textStatus
    
         setTimeout(function() {
            divStatus.innerHTML = ""}, 4000); 

    }

    }


//função validando null de qualquer input
function validNull(input){

    if (!input.trim()) {

        showStatusText("Campo de texto Vazio, Por Favor digite algo antes de confirmar", false)
        return true
    }
    return false
}



window.onload = ()=>{

    getPersonIdConfig(userId)

}

//2 é dark mode 
//1 é light mode

async function patchThemeId(PersonId, themeSelected) {

    const userThemeId =  {

        "ThemeId": themeSelected
    }

    const response = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ConfigPersonTheme?PersonId=${PersonId}`,

        {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userThemeId)

        }
    )
    
}


async function getPersonIdConfig(PersonId) {

    try{
        const response = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/PersonConfigById?PersonId=${PersonId}`)

        const personData = await response.json()

        const themeDefault = personData.DefaultThemeId;

        saveBackGroundMode(themeDefault)

    }catch(erro){

        throw `Erro ao Pegar Person ID ${erro}`
    }    
}

function saveBackGroundMode(oneOrTwo){

    if(oneOrTwo === 1){
        inputCheckBoxSwitch.checked = true;


        statusBackgroundText.textContent = "Light"
        containerTask.classList.add("light-mode-board")
        column.classList.add("light-mode-column")


    }else{
    
        inputCheckBoxSwitch.checked = false;

        statusBackgroundText.textContent = "Dark"
        containerTask.classList.remove("light-mode-board")
        column.classList.remove("light-mode-column")


    }


}

inputCheckBoxSwitch.addEventListener("change", function(){

    if(inputCheckBoxSwitch.checked){

        patchThemeId(userId,1)

        statusBackgroundText.textContent = "Light"
        containerTask.classList.add("light-mode-board")
        column.classList.add("light-mode-column")

        }else{

            patchThemeId(userId,2)

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

    buttonConfirm.addEventListener("click", ()=>{ 

        confirmColumnName(containerTasks, newColumn, inputDiv)
    });

            newColumn.appendChild(inputDiv);
            newColumn.appendChild(buttonConfirm);

            containerTasks.appendChild(newColumn)

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
        editColumn(columnDiv)
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

    showStatusText(`Tarefa '${descriptionCard}' Criada Com Sucesso`, true)
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

        const nameBoard = document.querySelector(".boardName")
        const descriptionBoard = document.querySelector(".boardDescription")
        const boardTexts = document.getElementsByClassName("board-texts")[0]

        const buttonExcludeBoard = document.createElement("button")

            buttonExcludeBoard.textContent = "Deletar Quadro"
            buttonExcludeBoard.type = "button"
            buttonExcludeBoard.classList.add("btn", "btn-danger")

            buttonExcludeBoard.addEventListener("click", function(){

                showStatusText(`Quadro '${nameBoard.textContent}' Excluido Com Sucesso`, false)
                
                deleteBoard(boardId)

                setTimeout(()=>{

                    window.location.reload()
                },3000)
            })

    
        nameBoard.addEventListener("dblclick", function(){


            nameBoard.classList.add("edit-board")
            descriptionBoard.classList.add("edit-board")

            const inputNewNameBoard = document.createElement("input")

                inputNewNameBoard.type = "text"
                inputNewNameBoard.classList.add("form-control", "form-new")
                inputNewNameBoard.value = nameBoard.textContent
                inputNewNameBoard.placeholder = "Informe o Novo Nome Do Quadro"
                inputNewNameBoard.title = "Informe o Novo Nome Do Quadro"

                    nameBoard.appendChild(inputNewNameBoard)

            const inputNewDescription = document.createElement("input")

                inputNewDescription.type = "text"
                inputNewDescription.classList.add("form-control", "form-new")
                inputNewDescription.value = descriptionBoard.textContent
                inputNewDescription.placeholder = "Informe a Nova Descrição Do Quadro"
                inputNewDescription.title = "Informe a Nova Descrição Do Quadro"

                inputNewDescription.disabled = true

                    descriptionBoard.appendChild(inputNewDescription)

                    boardTexts.appendChild(buttonExcludeBoard)

            inputNewNameBoard.addEventListener("keydown", function(e){

            if(e.key === "Enter"){

                nameBoard.classList.remove("edit-board")

                inputNewDescription.disabled = false

                const newNameBoard = inputNewNameBoard.value 

                nameBoard.textContent = newNameBoard

                inputNewDescription.addEventListener("keydown", function(e){

                    if(e.key === "Enter"){

                         descriptionBoard.classList.remove("edit-board")

                        const newDescription = inputNewDescription.value

                        descriptionBoard.textContent = newDescription

                        showStatusText(`Quadro Atualizado Com Sucesso`, true)
                        putBoardNameDescription(boardSelected, newNameBoard, newDescription)

                    }

        })
       };
    })
 })



    try{

        const resposta = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Board?BoardId=${boardId}`)
        const dataBoard = await resposta.json()
    
            nameBoard.innerText = dataBoard.Name
            descriptionBoard.innerText = dataBoard.Description
        
        console.log("ID DO BOARD:" + " " + boardId)
        
    }catch(erro){

        console.error("Erro ao se Conectar ao Servidor", erro)
        showStatusText(`Erro ao se Conectar ao Servidor`,false)


    }

}

getBoardsToDropDown()

//fim


function editColumn(columnDiv) {


    columnDiv.classList.add("edit-column-style")

    const cardTasks = columnDiv.querySelectorAll(".card-task")

    const trashIconForColumn = document.createElement("i")
    trashIconForColumn.classList.add("bi", "bi-trash")


    cardTasks.forEach(cardTask => {
        const iconTrashForTask = document.createElement("i")

            iconTrashForTask.classList.add("bi", "bi-trash")

        iconTrashForTask.addEventListener("click", function () {

            deleteTaskByID(cardTask.id).then(() => {

                trashIconForColumn.remove()
                document.querySelectorAll(".bi-trash").forEach(trashIcon => trashIcon.remove());

                columnDiv.classList.remove("edit-column-style")
                cardTask.remove()
                showStatusText(`Tarefa '${cardTask.textContent}' Deletada com sucesso`, false)
                 
            });
        });


        cardTask.appendChild(iconTrashForTask); 

    });

    const nameColumnBefore = columnDiv.querySelector(".column-name");
    const inputEditNameColumn = document.createElement("input");

    inputEditNameColumn.classList.add("form-control")
    inputEditNameColumn.id = "input-edit-name"
    inputEditNameColumn.value = nameColumnBefore.textContent

    inputEditNameColumn.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            columnDiv.classList.remove("edit-column-style");

            const newNameColumn = inputEditNameColumn.value;

            if (validNull(newNameColumn)) {
                return;
            }

            nameColumnBefore.textContent = newNameColumn;
            inputEditNameColumn.remove()
            trashIconForColumn.remove()
            document.querySelectorAll(".bi-trash").forEach(trashIcon => trashIcon.remove());


            showStatusText(`Coluna Atualizada com Sucesso`, true)
            putNameColumn(columnDiv.id, boardSelected, newNameColumn)
        }
    })

    nameColumnBefore.textContent = ""
    nameColumnBefore.appendChild(inputEditNameColumn)

    trashIconForColumn.addEventListener("click", function () {

        deleteColumn(columnDiv.id).then(() => {
            columnDiv.remove();
            showStatusText("Coluna Deletada com sucesso", false)

        }).catch((erro) => {
            console.error("Erro ao deletar a coluna:", erro)
            showStatusText("Falha ao Deletar coluna", false)
        });
    });

        trashIconForColumn.remove()
    columnDiv.appendChild(trashIconForColumn);
}



function helloUser(){

    const boardName = document.querySelector(".boardName")

   const dataUser =  JSON.parse(localStorage.getItem("userDatas"))

   console.log(dataUser);

   boardName.innerHTML = `Olá, ${dataUser.name.split(" ")[0]}`

}

helloUser()

async function deleteBoard(BoardId) {


    try{

        const response = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Board?BoardId=${BoardId}`,
            {
                method: "DELETE",
                headers: {"Content-Type":"application/json"}
            }
        )



    }catch(erro){

        throw `Erro ao Deletar Board: ${erro}`
    }
    
}


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


async function deleteTaskByID(TaskId) {

    try{

        const response = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Task?TaskId=${TaskId}`,{

            method: "DELETE", 
            headers: { "Content-Type": "application/json"},
        }

        )

        const dataTask = await response.json()

    }catch(erro){

        console.error(`Vish Caiu no reject : ${erro}`);   
    }
    
}


function logout(){

    localStorage.removeItem("userDatas")
    window.location.href = "/paginaLogin/index.html"

}


async function postColumns(boardId,nameColumn) {


    const url = "https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Column"

    try{

        const dataColumn = {

            BoardId: boardId,
            Name: nameColumn,
            IsActive: true,

            }
         
        const response =  await fetch(url,
            {
            method: "POST",
             headers: {"Content-Type": "application/json"},
             body: JSON.stringify(dataColumn)

              })

    if(!response.ok){

        console.log(`Erro De Post ${response.statusText}`);

        if(response.status === 422){

            console.log("Não foi possivel encontrar o quadro informado")
            return

        }
    }

    const respostaDataColumn = await response.json()

    
    console.log("Coluna Criada com Sucesso, ID DA COLUNA: ", respostaDataColumn)

    showStatusText(`Coluna '${nameColumn}' Criada com Sucesso :)`,true)


    }catch(erro){

        console.error("Erro de Servidor", erro)
        showStatusText(`Erro De Servidor`,false)

    }

}


async function postTasks(columnId, titleTask){

    const dataTask = {

        ColumnId: columnId,
        Title: titleTask,
        Description: "",
        IsActive: true,
        CreatedBy: userId
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

    const ascendingColumns = columns.sort((a, b) => a.Id - b.Id);

    ascendingColumns.forEach((column) => {

        console.log(ascendingColumns)

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
                editColumn(columnDiv);
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

