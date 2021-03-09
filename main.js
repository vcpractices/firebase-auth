//  <li class="nav-item" style="display: none;">
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const loginCheck = user => {
    if(user) {
       loggedInLinks.forEach(link => link.style.display = 'block');
       loggedOutLinks.forEach(link => link.style.display = 'none');
    } else {
       loggedInLinks.forEach(link => link.style.display = 'none');
       loggedOutLinks.forEach(link => link.style.display = 'block');
    }
}

// registro
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const signupEmail = document.querySelector('#signup-email').value;
    const signupPassword = document.querySelector('#signup-password').value;

    console.log(signupEmail, signupPassword)

    // firebase
    auth
        .createUserWithEmailAndPassword(signupEmail, signupPassword)
        .then(userCredential => {
            signupForm.reset();

            $('#signupModal').modal('hide')

            console.log('registrado')
        });
})

// ingreso de usuario
const signinForm = document.querySelector('#signin-form');

signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const signinEmail = document.querySelector('#signin-email').value;
    const signinPassword = document.querySelector('#signin-password').value;

    console.log(signinEmail, signinPassword)

    // firebase
    auth
        .signInWithEmailAndPassword(signinEmail, signinPassword)
        .then(userCredential => {
            signinForm.reset();

            $('#signinModal').modal('hide')

            console.log('ingresado')
        });
})

// salir
const salir = document.querySelector('#salir')
salir.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        console.log('salir')
    })
})

// google
const googleButton = document.querySelector('#google-login')
googleButton.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.reset();
    $('#signinModal').modal('hide')
   
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
    .then((result) => {
        console.log(result)
        console.log('google sign in')
    })
    .catch(err => {
        console.log(err)
    })    
})

// facebook
const facebookButton = document.querySelector('#facebook-login')
facebookButton.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.reset();
    $("#signinModal").modal("hide");
    // console.log('facebook')
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            console.log(resutl)
            console.log('facebook')
        })
        .catch((error) => {
            console.log(error)
        })
})

// posts
const postList = document.querySelector('#posts')
const setupPosts = data => {
    if (data.length) {
        let html = '';
        data.forEach((doc) => {
            const post = doc.data()
            console.log(post)
            const li = ` <li class="list-group-item list-group-item-action"> 
                            <h5>${post.title}</h5>
                            <p>${post.description}</p>
                         </li>`;
            html += li;
        });
        postList.innerHTML = html;
    } else {
        postList.innerHTML = '<p class="text-center">Ingrese al aplicativo para ver las publicaciones</p>'
    }
}

// events
auth.onAuthStateChanged(user => {
    if (user) {
        console.log('logeado')
        fs.collection('posts')
            .get()
            .then((snapshot) => {
                // console.log(snapshot.docs)
                setupPosts(snapshot.docs)
                loginCheck(user)
            })
    } else {
        // console.log('no logeado')
        setupPosts([])
        loginCheck(user)
    }
})
