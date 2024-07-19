
<div align=center>
  <img src="./public/images/270x270.png" />
</div>

## ***:computer: Documentação***

### ***Configurações Iniciais***

- Primeiro, você precisa ter o <kbd>[Node.js](https://nodejs.org) (LTS version)</kbd> instalado na sua máquina. 

Se você estiver utilizando o **Linux**, você pode optar por instalar o **Node** através do gerênciador de versões <kbd>[nvm](https://github.com/nvm-sh/nvm)</kbd> para facilitar o processo de mudança da versão do **Node**, quando for necessário.

Você pode optar também por utilizar o **yarn** no lugar do **npm**. Você pode instalar clicando nesse link <kbd>[Yarn](https://yarnpkg.com/en/docs/install#windows-stable)</kbd>, ou através do <kbd>[nvm](https://github.com/nvm-sh/nvm)</kbd>.

***Baixando Projeto***

#### - ***Instalação Projeto Designado***

```sh
# Clonando repositório designado para o projeto.

$ git clone {link do projeto}

# Instalando dependência no projeto.

$ npm install 
ou
$ yarn

# Executando a aplicação em modo de desenvolvimento:

$ npm run dev 
ou
$ yarn dev

```

### ***Padronização de Código***

#### - ***Instalação de Extensões no Editor <kbd>[VSCODE](https://code.visualstudio.com/)</kbd>***
```sh
"recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "editorconfig.editorconfig",
    "mohd-akram.vscode-html-format",
    "jock.svg"
 ]
```
- No Arquivo  <kbd>[extensions.json](.vscode/extensions.json)</kbd>, você verá essas extensões para serem instaladas no vscode, só ir em extensões e colocar @recommended  que ele mostrará as extensões a serem instaladas.

#### - ***Configurações do ESLint***

- ***O ESLint já virá configurado*** nos seguintes arquivos  <kbd>[settings.json](https://github.com/I9Colab-Tecnologia-e-Inovacao/NextJS-Modelo-Landing-MateUI/blob/main/.vscode/settings.json)</kbd>, <kbd>[.eslintrc](https://github.com/I9Colab-Tecnologia-e-Inovacao/NextJS-Modelo-Landing-MateUI/blob/main/.eslintrc)</kbd>  e <kbd>[.prettierrc](https://github.com/I9Colab-Tecnologia-e-Inovacao/NextJS-Modelo-Landing-MateUI/blob/main/.prettierrc)</kbd> você verá que todas as configurações para formatação de código já estão feitas, esse será o nosso padrão.
 
### ***Git Flow, como trabalhar em equipe***

#### - ***Criação de Branch, padrão de commits***

Criar a branch com base na função/tela que for desenvolver.
```sh
git checkout -b feature/{nome da função ou tela}
```
Depois de fazer as alterações ou criação de código, faça o commit dizendo o que aquele commit faz no projeto.
```sh
git commit -m '- Corrigir bug de responsividade'
```
Depois de fazer todos os commits necesssários e terminar a função ou tela, voce deverá colocar essa branch no repositório com o seguinte comando.
```sh
git push --set-upstream origin feature/{nome da função ou tela}
```

### - ***Configurações do Git Local***

```
git config --local core.autocrlf false
git config --local core.safecrlf false
```

### - ***Padrão de Versionamento***

```
X.Y.Z
│ │ └──> Bug fixes or improvements
│ └────> New features
└──────> New version
```

#### - ***Criando um Pull Request***

Depois de subir a branch para o repositório no GitHub você deverá criar um ***Pull Request*** onde o código será avaliado e depois de compararmos os códigos faremos um ***merge*** para juntar todos os códigos.


<i><h2 align="center">Responsável, <a href="https://www.linkedin.com/in/luiz-carlos-vilela/">Luiz Carlos Vilela</a></h2></i>
