const expenseDiv = document.getElementById('expense-div')

window.addEventListener('DOMContentLoaded',async (e) => {
    e.preventDefault()

    let token = localStorage.getItem('token')
    let clickedUserId = +localStorage.getItem('clickedUser')
    
    try {
        console.log(token, clickedUserId)

        const res = await axios.get(`http://localhost:3000/getInfo/${clickedUserId}`, {headers : {'Authorization': token}})

        if(res.data.success){
            res.data.data.map(data => {
                showOnScreen(data)
            })
        }
    } catch (error) {
        console.log(error)
    }
})

function showOnScreen(data){
    let child = `<li class="list" >
    <span class="expense-info"> ₹ ${data.expenseAmt} - ${data.category} - ${data.description}</span>
</li>`

expenseDiv.innerHTML += child
}