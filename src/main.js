import api from './api';
import './app.css';

class App {
    constructor() {
        this.users = []; 
        this.repo = [];
        this.formEl = document.getElementById('user-form');
        this.inputEl = document.querySelector('input[name=User]');
        this.listEl = document.getElementById('user-list');
        this.listRepoEl = document.getElementById('repo-list');       
        this.registerHandlers();
    }
    // pega o evento quando o usuario subimita a pagina
    registerHandlers(){
        this.formEl.onsubmit = event => this.addUser(event);   
    }
    // adiciona um "carregando" enquanto traz os dados para tela
    setLoading(loading = true){
        if(loading === true){
            let loadingEl = document.createElement('h2');
            loadingEl.appendChild(document.createTextNode('Carregando ..'));
            loadingEl.setAttribute('id','loading');
            this.formEl.appendChild(loadingEl);
        }else{
            document.getElementById('loading').remove();
        }
    }
    // adiciona usuario e os seus repositorios
    async addUser(event){
        event.preventDefault();
        this.users = [];
        this.repo = [];
        this.listEl.innerHTML  ="";
        this.listRepoEl.innerHTML  =""
        const userInput = this.inputEl.value;     // pega valor da input (user)
       
        if (userInput.length === 0)
            return;

        this.setLoading();
        try{
          
            const response = await api.get(`/users/${userInput}`); // pega dados do user           
            
            const {name, bio, avatar_url, email, followers, following} = response.data;    
           // insere no array o user
            this.users.push({               
                name,
                bio,
                avatar_url,               
                email,
                followers,
                following,

            });
          
            const responseRepo = await api.get(`/users/${userInput}/repos`);  // pega repository do user
            responseRepo.data = responseRepo.data.sort(function(a, b) {  
                //verifica como os dados do repository sera exibido  
                if(document.getElementById('pesquisar').value == "star-decreasing"){     
                    return b.stargazers_count - a.stargazers_count;
                    
                } else {
                    return  a.stargazers_count - b.stargazers_count;                    
                } 
            }).forEach(elem => {
                // adiciona o repository no array
                const  { name: nameRepo, description, stargazers_count, html_url, language} =elem;
                this.repo.push({
                    nameRepo,
                    description,
                    stargazers_count,
                    html_url,
                    language
                });               
            });    
                    
            this.render(); // chama renderização na tela
        } catch (err) {
            alert('O usuário não existe');
        }
        this.setLoading(false); // retira o "carregamento"
    }
    
    // cria os elementos e adiciona no html
    render(){
        this.listEl.innerHTML = "";
        this.users.forEach(user =>{
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', user.avatar_url);

            let titileEl  = document.createElement('h2');
            titileEl.appendChild(document.createTextNode(user.name));
                      
            let tdsEl  = document.createElement('h5');
            tdsEl.appendChild(document.createTextNode("Followers: "+user.followers+" | Following: "+user.following + " | Email: "+user.email));           
           
            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(user.bio));            

            let listItemEl = document.createElement('div');
            
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(titileEl);
            listItemEl.appendChild(tdsEl);
           
            listItemEl.appendChild(descriptionEl);

            this.listEl.appendChild(listItemEl);
            this.listEl.appendChild(document.createElement('hr'));
        });
        var conteudo  = ""
      
        this.repo.forEach(repo =>{
            conteudo = this.listRepoEl.innerHTML;
            conteudo +=  "<li><h4>"+repo.nameRepo+"</h4>";
            conteudo += "<h5>Stars: " + repo.stargazers_count + " | Language: " + repo.language+"</h5>";
            conteudo += "<p>"+repo.description+"</p>";
            conteudo += "<a href='"+repo.html_url+"' target='_blank'>Visitar Repositório</a></li>";
            this.listRepoEl.innerHTML= conteudo;          
           
        });
    }
}


new App();