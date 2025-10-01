document.addEventListener("click",(e)=>{
    const {target} = e; // obtem o objeto que foi clicado (destructuring)});
    if(!target.matches("nav a")) return; // garante que somente links dentro de navs serão processados
    e.preventDefault(); // desabilita a função padrão do link
    doRoutes(e); // chama a função que processa as rotas
});

// atualiza a URL e chama a função que processa as rotas
function doRoutes(e) {
    window.history.pushState({}, "", e.target.href); // atualiza o histórico do navegador
    locationHandler();
}

const templateCache = {}; // para evitar requisições repetidas para o mesmo template

// processa a rota atual
async function locationHandler() {
    const location = window.location.pathname; // get the url path
    if (location.length == 0) {
        location = "/";
    }
    
    // obtem os dados da rota com base no path ou obtem o 404
    const route = routes[location] || routes["404"];
    
    let html = templateCache[route.template]; // verifica se o template já foi carregado
    if (!html) { // se não estiver no cache, faz a requisição
        html = await fetch(route.template)
            .then((response) => response.text())
            .catch(() => "<h1>Erro ao obter o conteúdo!</h1>");
        templateCache[route.template] = html; // Salva no cache
    }
    
    await updateContent(html,route.title,route.description); // atualiza o conteúdo da página
}
    
async function updateContent(html, title, description) {
    document.querySelector("#content").innerHTML = html; // atualiza o conteúdo da página
    document.title = title; // atualiza o título da página
    document.querySelector('meta[name="description"]').setAttribute("content", description); // atualiza a descrição da página       
}

// array com os dados das rotas
const routes = {
    404: {
        template: "/templates/404.html",
        title: "404",
        description: "Page not found",
    },
    "/": {
        template: "/templates/index.html",
        title: "Home",
        description: "This is the home page",
    },
    "/about": {
        template: "/templates/about.html",
        title: "About Us",
        description: "This is the about page",
    },
    "/contact": {
        template: "/templates/contact.html",
        title: "Contact Us",
        description: "This is the contact page",
    },
};

// necessário para atualizar o conteúdo quando o usuário navega pelo histórico com -> ou <-
window.onpopstate = locationHandler; // chama a função locationHandler quando o usuário navega pelo histórico
window.route = routes; // torna o array de rotas acessível globalmente  
locationHandler(); // chama a função locationHandler quando a página é carregada