

// Ajout d'un écouteur d'événement sur le bouton de sélection d'utilisateur


userSelectedButton.addEventListener('click', () => {
    const usersList = document.getElementById('usersList');
    const selectedUserId = usersList.value;
    alert('Utilisateur sélectionné ID : ' + selectedUserId);
});

// Ajout d'un écouteur d'événement sur le bouton
monBouton.addEventListener('click', () => {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputValue: monInput.value })
    }).then(response => response.text())
        .then(data => {
            alert(data);
        });
});

// Ajout d'un écouteur d'événement sur le bouton de vote
voteButton.addEventListener('click', () => {
    const selectedUserId = usersList.value;
    fetch('/vote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ IdUser: selectedUserId, candidateId: usersList.value })
    }).then(response => response.text())
        .then(data => {
            alert(data);
        });
});




// Charger la liste des utilisateurs au chargement de la page

window.onload = () => {
    fetch('/Users')
        .then(response => response.json())
        .then(users => {
            const usersList = document.getElementById('usersList');
            users.forEach(user => {
                //création d'un input select option avec id en value et login en texte  
                const option = document.createElement('option');
                option.value = user.id;
                option.text = user.login;
                usersList.appendChild(option);

            });
        });
}

const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', () => {
    const loginInput = document.getElementById('loginInput').value;
    const passwordInput = document.getElementById('passwordInput').value;

    fetch('/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login: loginInput, password: passwordInput })
    }).then(response => response.json())
        .then(data => {
            alert(data.message);
            alert('ID utilisateur : ' + data.user.id);
            localStorage.setItem('userId', data.user.id);
           
        });
});

 
  