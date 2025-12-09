# 📁 Clientes da Calculadora

Nesta parte do projeto foram desenvolvidos **dois clientes para consumir a API da calculadora**:

- **ClientHTTPSCalculadora**
Cliente implementado em Java e com interface gráfica.

- **calculadora-html-javascript**
Cliente desenvolvido com HTML, CSS e JavaScript, funcionando diretamente no navegador.

Você também pode acessar a interface web hospedada no GitHub Pages pelo link abaixo:

👉 https://elimar-ximenes.github.io/calculadora-api-atv04-sd/
> **Observação**: No primeiro acesso, a interface web pode demorar alguns segundos para carregar as operações porque a API hospedada no Render entra em modo de hibernação após um período de inatividade.

Imagens das interface dos Clientes:

**Cliente Java**

<img width="795" height="147" alt="cliente calculadora web" src="https://github.com/user-attachments/assets/12f7e309-260c-454f-bd31-0e45e5dcc997" />

**Cliente Web**

<img width="1702" height="930" alt="image" src="https://github.com/user-attachments/assets/3af153bd-ed34-4f5a-80f1-063af4def9d8" />

## Cliente REST em Java

### Como executar

#### 1. Acesse o diretório do projeto
`cd ClientHTTPSCalculadora`

#### 2. Compile o código-fonte
`javac -d ./bin ./src/*.java`

#### 3. Execute a aplicação
`java -cp ./bin CalculadoraRestClient`

---

### Funcionamento da aplicação

Ao executar o comando acima, a interface gráfica da calculadora será aberta.  
Nela, você pode:

- Informar os valores para **Operador 1** e **Operador 2**
- Selecionar a operação desejada
- Clicar em **Calcular**

A lista de operações é carregada dinamicamente da API através da rota:

`GET /operations`

Quando o usuário pressiona o botão **Calcular**, o cliente envia uma requisição:

`POST /operation/{operacao}/{valor1}/{valor2}`

O resultado retornado pela API é então exibido na interface da aplicação.

<img width="808" height="208" alt="image" src="https://github.com/user-attachments/assets/f38ecd6d-ab87-485a-ad64-0749da39ab29" />

Para não estender muito a explicação, o Cliente Web funciona de forma análoga — mudando apenas a forma de implementação em cada tecnologia.
Abaixo segue um exemplo do resultado exibido no navegador:

<img width="1682" height="914" alt="image" src="https://github.com/user-attachments/assets/a72e746f-3f9f-442f-aa21-298be9faf900" />


