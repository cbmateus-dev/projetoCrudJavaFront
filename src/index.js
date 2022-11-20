$(document).ready(function () {
    xhttp = new XMLHttpRequest();
    var listaProdutos;
    var api = 'https://cbmateus-dev.herokuapp.com/api/produtos/';

    //Botão Listar 
    $("#listarButton").on('click', function () {
        listar()
    })
    //Botão Adicionar Produto
    $("#addButton").on('click', function () {
        $("#buttonsGroup").show()
    })
    //Botão Gravar Produto
    $("#saveButton").on('click', function () {
        $("#buttonsGroup").hide()
        gravar()
    })
    //Botão Cancelar add Produto
    $("#cancelButton").on('click', function () {
        $("#buttonsGroup").hide()
    })
    //Regras que só pode digitar número
    $("#VALORPRODUTO").on("keypress", function () {
        onlynumber();
    });

    $(document).on("keypress", "[name^='VALORPRODUTOTBL']", function () {
        onlynumber();
    });
    //Botão Deletar Produto
    $(document).on('click', "button[name='deleteButton']", function () {
        var idLinha = $(this).parents('tr').attr('id')
        deletar(idLinha)
    })
    //Botão Editar Produto
    $(document).on('click', "button[name='editButton']", function () {
        var $element = $(this)
        $element.parents('tr').find('td:not(:last-child)').find('input').show()
        $element.parents('tr').find('td:last-child').find('button[name="saveButtonLinha"]').show()
        $element.parents('tr').find('td:last-child').find('button[name="editButton"]').hide()
    })
    //Botão Salvar Produto
    $(document).on('click', "button[name='saveButtonLinha']", function () {
        var $element = $(this)
        var idLinha = $element.parents('tr').attr('id')
        editar(idLinha)
    })
    //Função Metodo GET listar Produtos
    function listar() {
        xhttp = new XMLHttpRequest();
        $("#lista tr").remove()
        xhttp.open("GET", api);
        xhttp.send();
        xhttp.onload = function () {
            listaProdutos = this.responseText;
            listaProdutos = JSON.parse(listaProdutos);

            produtos = "";

            for (const u of listaProdutos) {
                produtos += `<tr id="${u.id}">
                <td> ${u.nome}
                <input type="text" class="form-control" placeholder="Nome Produto" name="NOMEPRODUTOTBL" 
                id="NOMEPRODUTOTBL${u.id}" style="display:none;" value="${u.nome}"></td>

                <td>${u.descricao}
                <input type="text" class="form-control" placeholder="Descrição Produto" name="DESCPRODUTOTBL"
                id="DESCPRODUTOTBL${u.id}" style="display:none;" value="${u.descricao}"></td>

                <td>${u.valor}<input type="text" class="form-control" placeholder="R$" name="VALORPRODUTOTBL"
                id="VALORPRODUTOTBL${u.id}" style="display:none;" value="${u.valor}"></td>

                <td class="form-group"><button type="button" class="btn btn-danger" name="deleteButton">Deletar</button>
                <button type="button" class="btn btn-warning" name="editButton">Editar</button>
                
                <button type="button" class="btn btn-success" name="saveButtonLinha" style="display:none;">Salvar</button>
                
                </td></tr>`
            }
            $('#lista').append(produtos);
        }
    }
    //Função Metodo POST Adicionar Produtos
    function gravar() {
        
        var produto = {}
        produto.nome = $("#NOMEPRODUTO").val()
        produto.descricao = $("#DESCPRODUTO").val()
        produto.valor = $("#VALORPRODUTO").val()

        xhttp.open("POST", api);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(produto));
        xhttp.onload = function () {
            listar();
        }
        $("#NOMEPRODUTO").val('')
        $("#DESCPRODUTO").val('')
        $("#VALORPRODUTO").val('')

    }
    //Função metodo PUT Editar Produtos
    function editar(id) {
        var produto = {}
        produto.id = id
        produto.nome = $("#NOMEPRODUTOTBL" + id).val()
        produto.descricao = $("#DESCPRODUTOTBL" + id).val()
        produto.valor = $("#VALORPRODUTOTBL" + id).val()

        xhttp.open("PUT", api);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(produto));
        xhttp.onload = function () {
            listar();
        }
    }
    //Função metodo DELETE deletar produtos
    function deletar(id) {
        xhttp.open("DELETE", api + id);
        xhttp.send();
        xhttp.onload = function () {
            alert(this.responseText);
            listar();
        }
    }
    //Função Regex Digitar somente números e Pontos
    function onlynumber(evt) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /^[\.0-9]*$/;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }
    listar()

})