const token = localStorage.getItem('token');
const listurl = document.getElementById('listurl-div');

const download  = document.getElementById('download');

let listno = 0;

window.addEventListener('DOMContentLoaded',async (event) => {
    event.preventDefault();

    try {
        const res = await axios.get('http://localhost:3000/getAllUrl',{headers: {'Authorization' : token}})

        if(res.status === 200){
            console.log(res)
             showUrls(res.data)
        }
    } catch (error) {
        console.log(error)
    }
})

function showUrls(data){
    listurl.innerHTML = ''

    data.urls.forEach(url => {
        let child = `<li class="list" 
        <a href= "${data.fileURL}" class="expense-info">${listno + 1}. ${url.filename.split('/')[1]}</a>
        </li>`

        listurl.innerHTML += child;

        listno++
    })
}

download.addEventListener('click',async(event) => {
    event.preventDefault();

    try {
        let response = await axios.get('http://localhost:3000/download', {headers:{'Authorization' : token}})

        if(response.status === 200){
            console.log(response.data.downloadUrlData)
            showUrlOnScreen(response.data.downloadUrlData)
            var a = document.createElement("a")
            a.href = response.data.fileURL
            a.download = 'myexpense.csv'
            a.click();
        } else {
            throw new Error(response.data.message)
        }
    } catch (error) {
        console.log(error)
    }
})

function showUrlOnScreen(data){
    let child = `<li class="list" 
    <a href= "${data.fileURL}" class="expense-info">${listno + 1}. ${data.filename.split('/')[1]}</a>
    </li>`

    listurl.innerHTML += child;
}