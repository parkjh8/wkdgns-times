let news=[]
let page=1;
let total_pages=0;
let menus = document.querySelectorAll(".menus button")
menus.forEach(menu=> menu.addEventListener("click",(event)=>getNewsByTopic(event)))
let url;


let searchButton = document.getElementById("search-button");

const getLatestNews = async() =>{
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business`);
    getNews()

};


//각함수에서 필요한 url를 만든다.
// api호출함수를 부른다

const getNews = async () =>{
    try{
        let header = new Headers({'x-api-key':'h3YA3mAhXapcRpCbf_c4dogpY715If9Ty56hHJOR1bs'});
        url.searchParams.set(`page`,page); //&page
        let response = await fetch(url,{headers:header});
        let data = await response.json();
        if(response.status == 200){
            if(data.total_hits == 0){
                throw new Error("검색된 결과값이 없습니다.");
            }
            console.log("받은데이터는",data)
            news=data.articles;
            total_pages = data.total_pages;
            page = data.page;
            console.log(news);
            render();   
            pagenation();
        }else{
            throw new Error(data.message)
        }
        

    }catch(error){
        console.log("잡힌에러는",error.message)
        errorRender(error.message)
    }

}
const getNewsByTopic = async (event) =>{
    let topic= event.target.textContent.toLowerCase();
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);

    getNews()
} 

const getNewsByKeyWord = async () =>{
    // 검색키워드 읽어오기
    // url에 검색 키워드 부치기
    //헤더준비
    //url부르기
    //데이터 가져오기
    //데이터 보여주기

    let keyword= document.getElementById("search-input").value;
     url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`);
    getNews()
}


const render = () =>{
    let newsHTML =''
    newsHTML= news.map(news=>{
        return ` <div class="row news">
        <div class="col-lg-4">
            <img class="new-image-size" src="${news.media}"/>
        </div>
        <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>
               ${news.summary}
            </p>
            <div>
               ${news.rights} * ${news.published_date}
            </div>
        </div>

    </div>`
    }).join(``);
    


    document.getElementById("news-board").innerHTML=newsHTML
}

const errorRender= (message) =>{
    let ErrorHTML = `<div class="alert alert-danger text-center role="alert">${message}</div>`;
    document.getElementById("news-board").innerHTML=ErrorHTML
}

const pagenation=() => {
    let pagenationHTML= ``;
    //total page
    //page
    //page group
    let pageGroup = Math.ceil(page/5)
    //last
    let last = pageGroup *5; 
    if(last > total_pages){
        last = total_pages
    }
    //first
    let first = last-4;
    //first-last 페이지 프린트

    // total page 3일 경우 3개의 페이지 프린트 하는법 정의
    //<< >> 만들어주기
    //그룹 1일경우 << 버튼 없기
    //그룹 마지막일경우 >> 버튼 없애기

    pagenationHTML +=  `<li class="page-item">
    <a class="page-link" href="#" aria-label="Previous">
    <span aria-hidden="true" onclick="moveToPage(1)" ${page==1}"disable="true": "">&laquo;</span>
    </a>
    <div> <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page-1})">
      <span aria-hidden="true">&gt;</span>
    </a> </div>
  </li>`

    for(let i=first;i <= last;i++){
        pagenationHTML += `<li class="page-item ${page==i?"active" : ""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
    }

    pagenationHTML += ` <li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page+1})">
    <span aria-hidden="true">&gt;</span>
  </a> 
  <div> <a class="page-link" href="#" aria-label="Next" ${page==total_pages}"disable="true":"" onclick="moveToPage(${total_pages})">
  <span aria-hidden="true">&raquo;</span>
</a> </div>
  </li>`
    document.querySelector(".pagination").innerHTML=pagenationHTML;
}

const moveToPage=(pagenumber) => {
    //이동하고싶은 페이지를 알아야한다.
    page = pagenumber;
    //이동하고싶은 페이지를 가지고 api를 다시 호출해야한다.
    getNews();
}

searchButton.addEventListener("click",getNewsByKeyWord)
getLatestNews();