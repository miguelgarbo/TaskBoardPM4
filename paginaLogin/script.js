const btnAcessWithEmail = document.getElementById("btnAcess");
const textErrorDiv = document.querySelector("#textError")

function showButtonLoading (buttonParameter, responseBool){

    buttonParameter.disabled = responseBool;
    buttonParameter.textContent = responseBool ? "Carregando......" : "Acessar";

 }

function showMessage(message){

    textErrorDiv.style.display = "block"
    textErrorDiv.textContent = message

}


btnAcessWithEmail.addEventListener("click", function(e){

    e.preventDefault();

    const emailUser = document.querySelector("#emailUser").value.trim()

    if(emailUser === ""){

        showMessage("O campo está vazio, Informe um email.")
    return;

    }
    
    getPersonByEmail(emailUser)

})

async function getPersonByEmail(emailInput) {

    showButtonLoading(btnAcessWithEmail,false);

    try{

        const resposta = await fetch(`https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard/GetPersonByEmail?Email=${emailInput}`)


        if(!resposta.ok){

            const errorData = await resposta.json()
            console.error(`Erro na requisição: ${resposta.statusText}`)

            if(resposta.status === 422){

                showMessage(errorData.Errors[0])

            }else{

                showMessage("Ocorreu Um Erro Inesperado, Tente De novo")
            }

        }else{

            const userData = await resposta.json()

            const dataUserToSave = {

                id: userData.Id, 
                email: userData.Email,
                name: userData.Name

                  }
  
                 localStorage.setItem("userDatas", JSON.stringify(dataUserToSave))
                 console.log(dataUserToSave)

        
            showMessage("Email Valido !")
            window.location.href = "/paginaInicial/index.html";

              

        }
        
    }catch(error){

        //erro do servidor

        console.error("Erro ao buscar dados:", error)

    }


}


function helloUser(){


    const welcomeDiv = document.querySelector(".welcome-text")

    const dataUser = JSON.parse(localStorage.getItem("userDatas"))

    if(dataUser){
        welcomeDiv.innerText = `Bem Vindo ${dataUser.name.split(' ')[0]}`
    }

}

helloUser()

function valueEmailLogin(){

    const dataUser = JSON.parse(localStorage.getItem("userDatas"))

    const emailUser = document.querySelector("#emailUser")

    emailUser.value = dataUser.email


}


