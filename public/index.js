
async function signUp(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.emailId.value;
    const password = event.target.password.value;
    //const exist= document.querySelector('existing');
    //exist.innerHTML = '';
  
    
    const obj = {
        username,
        email,
        password
    }

    console.log(obj.email)
    try {
        const res = await axios.post('http://localhost:3000/user/signup',obj)
        if(res.status === 201){
            console.log(res)
            window.location.href = './login.html'
        }  else if(res.status === 207){
            alert(res.data.message);
        }
        
    } catch (error) {
        console.log(error, "error came")
    }
}

