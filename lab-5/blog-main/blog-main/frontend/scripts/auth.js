import {setAccessToken, setUser, BACKEND_URL, isAuthorized, clearAccessToken, isEditor, authHeader} from './utils.js';

const loginModal = document.querySelector('#login-modal');
const loginButton = document.querySelector('#login-btn');
const submitLogin = document.querySelector('#submit-login');
const loginError = document.querySelector('#login-error');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const roleSelect = document.querySelector('#role-select');

const registerButton = document.querySelector('#reg-btn');
const modalOverlay = document.querySelector('.modal-overlay');

// If user is logged in
const logoutBtn = document.querySelector('#logout-btn');
const editorBtn = document.querySelector('#editor-btn');

// this allows to use the same modal twice, depending on mode
let isRegisterMode = true;

// Get user data based on JSON Web Token
const getMe = (accessToken) => {
    fetch(`${BACKEND_URL}/auth/me`, {
        headers: {Authorization: 'Bearer: ' + accessToken}
    }).then(
        (res) => res.json()
    ).then(({data}) => {
        data && setUser(data);
    }).finally(() => {
        closeModal();
        setTimeout(() => {
            location.reload();
        }, 0);
    })
};

// close register & auth modal
const closeModal = () => {
    document.body.style.overflow = '';
    loginModal.style.display = 'none';
    modalOverlay.classList.remove('overlay');
    loginError.textContent = ``;
};

// authorize user with known credentials
const login = ({login, password}) => {
    fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            login,
            password,
        }),
    }).then(
        (res) => res.json()
    ).then((data) => {
        // set localStorage data
        setAccessToken(data.accessToken);
        getMe(data.accessToken);
    }).catch(() => {
        loginError.textContent = `Wrong credentials`;
    })
};

// register the new user
const register = ({login, password, role}) => {
    fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            login,
            password,
            role,
        }),
    }).then(
        (res) => res.json()
    ).then((data) => {
        if (data && data.accessToken) {
            // also set localStorage data
            setAccessToken(data.accessToken);
            getMe(data.accessToken);
        } else {
            loginError.textContent = `Cannot create account`;
        }
    })
};

// show auth & register modal
const showModal = () => {
    document.body.style.overflow = 'hidden';
    loginModal.style.display = 'block';
    modalOverlay.classList.add('overlay');
    loginModal.querySelector('.btn-close').addEventListener('click', closeModal)
};

// change modal contents and toggle auth mode
loginButton.addEventListener('click', () => {
    loginModal.querySelector('.modal-title').textContent = 'Auth';
    roleSelect.hidden = true;
    isRegisterMode = false;

    showModal();
});

// the same for register
registerButton.addEventListener('click', () => {
    loginModal.querySelector('.modal-title').textContent = 'Register';
    roleSelect.hidden = false;
    isRegisterMode = true;

    showModal();
});

// manage header buttons state on page load
logoutBtn.hidden = !isAuthorized();
editorBtn.hidden = !isEditor() || !isAuthorized();
registerButton.hidden = isAuthorized();
loginButton.hidden = isAuthorized();

// logout stuff
logoutBtn.addEventListener('click', () => {
    // clear localStorage
    clearAccessToken();
    location.reload();
});

// API calls depending on auth/reg mode
submitLogin.addEventListener('click', () => {
    if (isRegisterMode) {
        register({
            login: loginInput.value,
            password: passwordInput.value,
            role: roleSelect.value,
        })
    } else {
        login({
            login: loginInput.value,
            password: passwordInput.value,
        })
    }
});


