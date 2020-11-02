async function buscarCep(event) {
    // o target do event é o elemento que está disparando o evento, ou seja, o input
    let input = event.target.value; // 17500-100
    let cep = input.match(/\d+/g).join(''); // 17500100

    let res = await fetch("https://viacep.com.br/ws/" + cep + "/json");
    if (res.status == 200) {
        let endereco = await res.json();

        let cidade = document.querySelector("form input[name=cidade]");
        cidade.value = endereco.localidade;

        let bairro = document.querySelector("form input[name=bairro]");
        bairro.value = endereco.bairro;

        let uf = document.querySelector("form input[name=uf]");
        uf.value = endereco.uf;

        let logradouro = document.querySelector("form input[name=logradouro]");
        logradouro.value = endereco.logradouro;

        let numero = document.querySelector("form input[name=numero]");
        
        arr = [cidade, bairro, uf,logradouro];

        const foco = ''
        for(var i = 0; i < arr.length;i++){
            if(arr[i].value == ""){
                foco = arr[i];
                break                
            }
        }

        if (foco == ""){
            numero.focus();
        }else{
            foco.focus();
        }
    }
}

async function registrar(event) {
    event.preventDefault();
    let form = event.target;

    let jsonBody = formDataToJson(form);
    console.log(jsonBody);

    let jsonString = JSON.stringify(jsonBody);

    let res = await sendRequest("/api/usuario", {
        method: "POST",
        body: jsonString,
        headers: {
            "Content-Type": "application/json"
        }
    });

    const log = document.querySelector('div.log');

    if (res.status == 200) {
        alert("Cadastrado com sucesso! Vá para a pagina de login");
    } else if(res.status == 422){
        const erros = await res.json();
        const arrErros = []
        erros.errors.forEach(erro => {
            arrErros.push(erro.field);
        });
        const state = document.querySelector('div.state');
        const pErr = document.createElement('p');

        pErr.innerText = "*Preencha os campos: ";

        arrErros.forEach(function(campo,i){
            if(i == arrErros.length - 1){
                pErr.innerText += ` ${campo}.`;
            }else{
                pErr.innerText += ` ${campo},`;
            }
            
        })

        state.appendChild(pErr);
    }
}