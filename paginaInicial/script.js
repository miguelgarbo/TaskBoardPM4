// import axios from 'axios'
//arrumar indexPosition

//função validando null de qualquer input

function validNull(input){

    if(input === ""){

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
const textsBoard = document.querySelector(".board-texts")


inputCheckBoxSwitch.addEventListener("change", function(){


    if(inputCheckBoxSwitch.checked){

        statusBackgroundText.textContent = "Light"
        containerTask.classList.add("light-mode")
        header.classList.add("light-header")
        column.classList.add("light-mode-column")
        textsBoard.classList.add("text-mode-light")


        }else{

            statusBackgroundText.textContent = "Dark"
            containerTask.classList.remove("light-mode")
            header.classList.remove("light-header")
            column.classList.remove("light-mode-column")
            textsBoard.classList.remove("text-mode-light")

        }
})

let currentBoardId = null;

const buttonNewColumn = document.getElementById("btn-new-column")

buttonNewColumn.addEventListener("click", function(){

    //função que está criando uma coluna provisória com o input

    const containerTasks = document.querySelector(".container-tasks");

    //criando coluna
    let newColumn = document.createElement("div");

    newColumn.classList.add("column", "input-column");

    let inputDiv = document.createElement("input")
    inputDiv.id = "input-name-column"
    inputDiv.classList.add("form-control")
    inputDiv.type = "text"
    inputDiv.placeholder = "Nome da Coluna"
    //fim 

    //criando botão de confirmar coluna.

    const buttonConfirm = document.createElement("button")
    buttonConfirm.classList.add("btn", "btn-primary")
    buttonConfirm.id = "btn-confirm-new-column"
    buttonConfirm.type = "button"
    buttonConfirm.textContent = "Criar Coluna"
    //fim do botão de confirmar 

    buttonConfirm.addEventListener("click", function () {

        //adicionando função para o botão de confirmar coluna

        const containerTasks = document.querySelector(".container-tasks")
        const inputNameColumn = document.getElementById("input-name-column").value

        if(validNull(inputNameColumn)){
            return
        } 
    
        //criando a coluna definitiva
        const columnDiv = document.createElement("div");
        columnDiv.classList.add("column");

        const headerColumn = document.createElement("div")
        headerColumn.classList.add("header-column")

        const titleColumn = document.createElement("h5")

        titleColumn.id = "name-task";
        titleColumn.textContent = inputNameColumn;

        //criando botão de editar.
        const itemPencil = document.createElement("i")

        itemPencil.classList.add("bi", "bi-pencil")
        itemPencil.id =  "edit-column"
        itemPencil.onclick = editBoard;
        //fim da coluna 

     if (currentBoardId) {
             postColumns(currentBoardId, inputNameColumn);

        } else {
                console.log("Nenhum board foi selecionado.");
        return
}

        //adicionando titulo e icone de edição na coluna definitiva
        headerColumn.appendChild(titleColumn)
        headerColumn.appendChild(itemPencil)

        //criando botão de novas tasks(cards)
        const buttonNewCard = document.createElement("button")
        buttonNewCard.id = "buttonNewCard"
        buttonNewCard.type = "button"
        buttonNewCard.textContent = "Add Cartão +"
        buttonNewCard.classList.add("btn", "btn-primary")
        //fim

        //adicionando tudo no html
        columnDiv.appendChild(headerColumn)
        columnDiv.appendChild(buttonNewCard)
        containerTasks.insertBefore(columnDiv, buttonNewColumn);
        //fim

        //removendo input da coluna pós confirmar

        const inputNewColumn = document.querySelector(".input-column");

        inputNewColumn.remove()
        //fim


        //função de nova task
    buttonNewCard.addEventListener("click", function(){

        const inputCard = document.createElement("input")

        inputCard.type = "text"
        inputCard.id = "descriptionCard"
        inputCard.classList.add("form-control")
        inputCard.placeholder = "Descrição Do Cartão.."


        const buttonConfirmDescriptionCard = document.createElement("button");

        buttonConfirmDescriptionCard.textContent = "Confirmar Cartão"
        buttonConfirmDescriptionCard.classList.add("btn", "btn-success")
        buttonConfirmDescriptionCard.type = "button"

        columnDiv.insertBefore(buttonConfirmDescriptionCard, buttonNewCard)

        buttonConfirmDescriptionCard.addEventListener("click", function(){

        const descriptionCard = inputCard.value

        if(validNull(descriptionCard)){

            return
        } 

        const cardTask = document.createElement("div")

        cardTask.classList.add("card-task")
        cardTask.textContent = descriptionCard


        columnDiv.insertBefore(cardTask, buttonNewCard)

        //removendo botoes apos o clique de confirmação

        buttonConfirmDescriptionCard.remove()
        inputCard.remove()

        })


        columnDiv.insertBefore(inputCard, buttonNewCard)

    })
    

    });


    //botando na tela
    newColumn.appendChild(inputDiv)
    newColumn.appendChild(buttonConfirm)

    containerTasks.insertBefore(newColumn, buttonNewColumn);



})

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
            displayColumnsFromBoard(board.Id)

        })

        dropdownUL.appendChild(li)
    });

    }catch(erro){
        console.error("Erro No Servidor:", erro)
    }
    
}

async function loadBoardPicked(boardId){

    const resposta = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/Board?BoardId=${boardId}`)

    const dataBoard = await resposta.json()

    const nameBoard = document.querySelector("#boardName")

    const descriptionBoard = document.querySelector("#boardDescription")

    const backgroundBoard = document.querySelector(".background-board")

    nameBoard.innerText = dataBoard.Name
    descriptionBoard.innerText = dataBoard.Description
    backgroundBoard.style.setProperty("background-color", dataBoard.HexaBackgroundCoor);

    currentBoardId = boardId;

    console.log("ID DO BOARD:" + " " + boardId);
}

getBoardsToDropDown()

//fim

function editBoard(){

    column.classList.add("edit-column-style")
    
    const nameColumnBeforeValue = document.querySelector("#name-task").textContent;
    const nameColumnBefore = document.querySelector("#name-task");

    const inputEditNameColumn = document.createElement("input")

    inputEditNameColumn.classList.add("form-control")
    inputEditNameColumn.id = "input-edit-name"
    inputEditNameColumn.value = nameColumnBeforeValue

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

   const dataUser =  JSON.parse(localStorage.getItem("userDatas"))

   console.log(dataUser)

   const nameDiv = document.querySelector("#nameUser")

   nameDiv.innerHTML = `Olá, ${dataUser.name.split(" ")[0]}`

}

helloUser()

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
            Position: indexPosition,
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

    indexPosition++

    }catch(erro){

        console.error("Erro de Servidor", erro)
    }

}




async function displayColumnsFromBoard(boardId){

    const url =  `https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/ColumnByBoardId?BoardId=${boardId}`;
    
    try{

         const response = await fetch(url)

         if(!response.ok){

        console.error(`Erro: ${response.statusText}`);

    }

    const listColumnsFromBoard = await response.json()

    console.log(listColumnsFromBoard);

    const containerTasks = document.querySelector(".container-tasks");


    listColumnsFromBoard.forEach(dataBoard =>{

        

        const columnDiv = document.createElement("div");
        columnDiv.classList.add("column");

         const headerColumn = document.createElement("div")
         headerColumn.classList.add("header-column")

         const titleColumn = document.createElement("h5")

         titleColumn.id = "name-task";
         titleColumn.textContent = dataBoard.Name; //add nome da api


         // criando botão de editar.
        const itemPencil = document.createElement("i")

        itemPencil.classList.add("bi", "bi-pencil")
        itemPencil.id =  "edit-column"
        itemPencil.onclick = editBoard;

         const buttonNewCard = document.createElement("button")
         buttonNewCard.id = "buttonNewCard"
         buttonNewCard.type = "button"
         buttonNewCard.textContent = "Add Cartão +"
         buttonNewCard.classList.add("btn", "btn-primary")

        headerColumn.appendChild(titleColumn)
        headerColumn.appendChild(itemPencil)
        //fim da coluna 

        columnDiv.appendChild(headerColumn)
        columnDiv.appendChild(buttonNewCard)
    
        containerTasks.insertBefore(columnDiv, buttonNewColumn)

    })    

    }catch(erro){

        console.error("Erro Catch: ",erro)
    }
    

}
