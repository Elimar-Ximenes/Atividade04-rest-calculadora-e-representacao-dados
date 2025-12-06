# Cliente REST em Java

## Como executar

### 1. Acesse o diretório do projeto
cd ClientHTTPSCalculadora

### 2. Compile o código-fonte
javac -d ./bin ./src/*.java

### 3. Execute a aplicação
java -cp ./bin CalculadoraRestClient

---

## Funcionamento da aplicação

Ao executar o comando acima, a interface gráfica da calculadora será aberta.  
Nela, você pode:

- Informar os valores para **Operador 1** e **Operador 2**
- Selecionar a operação desejada
- Clicar em **Calcular**

A lista de operações é carregada dinamicamente da API através da rota:

GET /operations

Quando o usuário pressiona o botão **Calcular**, o cliente envia uma requisição:

POST /operation/{operacao}/{valor1}/{valor2}

O resultado retornado pela API é então exibido na interface da aplicação.

<img width="808" height="208" alt="image" src="https://github.com/user-attachments/assets/f38ecd6d-ab87-485a-ad64-0749da39ab29" />

