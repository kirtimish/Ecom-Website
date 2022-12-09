

async function addExpense(event) {
    event.preventDefault();
    const expenseAmt = event.target.expenseAmt.value;
    const description = event.target.description.value;
    const category = event.target.category.value;
    const token = localStorage.getItem('token')

    const expenseDetails = {
        expenseAmt,
        description,
        category
    }
        try {
            
            const res = await axios.post('http://localhost:3000/user/insert-expense',expenseDetails,{headers: { 'Authorization' : token}})
            console.log(res)
            if(res.status == 201){
                showexpenseonScreen(res.data.expenseCreated);
            }
            
        } catch (error) {
            console.log(error)
        }

        document.getElementById('expAmt').value = '';
        document.getElementById('desc').value = '';
        document.getElementById('category').value = '';

        // let expenseSerialised = JSON.stringify(expenseDetails);

        // localStorage.setItem(expenseDetails.Category,expenseSerialised);
        // showexpenseonScreen(expenseDetails);
}

window.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token')
    const listOfUsers = document.getElementById('expenses')
    let Items_Per_Page = +document.getElementById('Items_Per_Page')
    let page = 1;
    

    let response = await axios.post(`http://localhost:3000/user/get-expenses/${page}`,{Items_Per_Page: Items_Per_Page},{headers: { "Authorization": token}} )
    checkIfPremium();

    console.log(response.data.info);
    if(response.status === 200){
        listOfUsers.innerHTML = ''
        for(let i=0;i<response.data.data.length;i++){
            showexpenseonScreen(response.data.data[i]);
        }
    }

    showPagination(response.data.info)

})

function showPagination({currentPage,hasNextPage,hasPreviousPage,nextPage,previousPage,lastPage}){
    let page = 1;
    const pagination = document.getElementById('pagination')
    
    pagination.innerHTML = '';

    if(hasPreviousPage){
        const button1 = document.createElement('button');
        button1.innerHTML = previousPage ;
        button1.addEventListener('click' , ()=>getPageExpenses(page,previousPage))
        pagination.appendChild(button1)
    }

    const button2 = document.createElement('button');
    button2.classList.add('active')
    button2.innerHTML = currentPage ;
    button2.addEventListener('click' , ()=>getPageExpenses(page,currentPage))
    pagination.appendChild(button2)

    if(hasNextPage){
        const button3 = document.createElement('button');
        button3.innerHTML = nextPage ;
        button3.addEventListener('click' , ()=>getPageExpenses(page,nextPage))
        pagination.appendChild(button3)
    }

}

async function getPageExpenses(page,limitper){
    let Items_Per_Page = limitper;
    const listOfUsers = document.getElementById('expenses')

    console.log(Items_Per_Page);

    const token = localStorage.getItem('token')

    let response = await axios.post(`http://localhost:3000/user/get-expenses/${page}`,{Items_Per_Page: Items_Per_Page},{headers: { "Authorization": token}} )
    checkIfPremium();

    console.log(response.data.info);
    if(response.status === 200){
        listOfUsers.innerHTML = ''
        for(let i=0;i<response.data.data.length;i++){
            showexpenseonScreen(response.data.data[i]);
        }
    }

    showPagination(response.data.info)
}

function perPage(event) {
    let Items_Per_Page = +document.getElementById('Items_Per_Page')
    let page = 1;
    event.preventDefault();
    console.log('*****************');
    console.log(Items_Per_Page);
    //console.log(typeof(+event.target.Items_Per_Page.value));
    //Items_Per_Page = +event.target.Items_Per_Page.value
    localStorage.setItem('itemsperpage' , +event.target.Items_Per_Page.value )
    Items_Per_Page = localStorage.getItem('itemsperpage')
    getPageExpenses(page, +event.target.Items_Per_Page.value);
    //event.target.Items_Per_Page.value
}

function showexpenseonScreen(expense){
    const parentNode = document.getElementById('expenses');
    const childHTML = `<li id=${expense.id} class="expense-list-item">  ${expense.expenseAmt} : ${expense.description} : ${expense.category}
    <button onClick=deleteExpense("${expense.id}") class="action-btn">Delete Expense</button>
    <button onclick=editExpense("${expense.id}","${expense.category}","${expense.expenseAmt}","${expense.description}") class="edit-btn">Edit Expense</button>
    </li>`
    parentNode.innerHTML = parentNode.innerHTML + childHTML;

    document.getElementById('expAmt').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('category').value = '';
}

function editExpense(userId,category,expenseAmt,desc){
    document.getElementById('expAmt').value = expenseAmt;
    document.getElementById('desc').value = desc;
    document.getElementById('category').value = category;
    deleteExpense(userId);
}

function deleteExpense(userId){
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/user/delete-expense/${userId}`, {headers: {"Authorization": token}})
    .then(res => {
        removeexpensefromScreen(userId);
    })
    .catch(error =>{
        console.log(error)
    })
    // localStorage.removeItem(category);
    // removeexpensefromScreen(category);
}

function removeexpensefromScreen(userId){
    const parentNode = document.getElementById('expenses');
    const deleteChild = document.getElementById(userId);
    if(deleteChild){
        parentNode.removeChild(deleteChild);
    }
}

function premiumUser() {
    document.body.classList.add('dark');
}

function checkIfPremium() {
    let usertype = localStorage.getItem('user');

    if(usertype === "true"){
        premiumUser();
        getPremiumLeaderboard();
    }
}

document.getElementById('premium-btn').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "name": "Test Company",
     "order_id": response.data.order.id, // For one time payment
     "prefill": {
       "name": "Test User",
       "email": "test.user@example.com",
       "contact": "7003442036"
     },
     "theme": {
      "color": "#3399cc"
     },
     // This handler function will handle the success payment
     "handler": function (response) {
         console.log(response);
         axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} }).then(() => {
            localStorage.setItem('user', true);
            premiumUser();
            getPremiumLeaderboard();
            alert('You are a Premium User Now')
            document.getElementById('premium-btn').innerText = 'Premium Now'
         }).catch(() => {
             alert('Something went wrong. Try Again!!!')
         })
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
  alert(response.error.code);
  alert(response.error.description);
  alert(response.error.source);
  alert(response.error.step);
  alert(response.error.reason);
  alert(response.error.metadata.order_id);
  alert(response.error.metadata.payment_id);
 });
}

async function getPremiumLeaderboard(){
    const token = localStorage.getItem('token');
try {
const response = await axios.get('http://localhost:3000/premiums', {headers : {'Authorization': token}} )

if(response.data.success){
    console.log(response);
    if(response.data.data.length>0){
        response.data.data.sort((a,b)=>{
            return b.totalExpense - a.totalExpense;
        });
        console.log(response.data.data[0].user.username);
        console.log(response.data.data[0].user)

       

        response.data.data.map((user, id)=>{
            console.log(id);
            showLeaderboard(user, id);
        })

    }
}

} catch (err) {
console.log(err);

}

}

function showLeaderboard(user , id){
    console.log(id);
    console.log(user);
    const leaderboardDiv = document.getElementById('leaderboardDiv')
    const downloadBtn = document.getElementById('downloadexpense')
    downloadBtn.removeAttribute('disabled')
    
    let child = `
    <li class="list" onclick="openUserExpenses('${user.user.id}')">${id+1} ${user.user.username} ${user.totalExpense}</li>`

    leaderboardDiv.innerHTML += child
}

function openUserExpenses(user){
    console.log(user)
    localStorage.setItem('clickedUser' , user)
    window.location.href = './leaderboard.html'
}

function download() {
    const userType = localStorage.getItem('user')
    if(userType === 'true'){
        window.location.href = './report.html'
    }
}