document.addEventListener('DOMContentLoadedited')

const signupForm = document.getElementById ('signup');

signupForm.addEventlistener('submit',async (e) => {
    e.preventDefault();

    const formData = new FormData(signupForm);
    const username = formData.get('username');
    const full_name = formdata.get('full_name');
    const email = formData.get('email');
    const password = formData.get('password');

    try{
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, full_name, email, password})
        }); 
    }


}