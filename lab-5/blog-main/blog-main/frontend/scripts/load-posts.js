import {authHeader, BACKEND_URL, isEditor, isAuthorized} from './utils.js';
import {savePost} from "./edit-posts.js";

const postsContainer = document.querySelector('#posts');
const postTemplate = document.querySelector('#post-template');

const authWarning = document.querySelector('#auth-warning');

// render post stuff using template & data from back-end
const preparePost = (post) => {
    const template = postTemplate.content.cloneNode(true);
    const editBtn = template.querySelector('#edit-button');
    const saveButton = template.querySelector('#save-button');
    // set title and description
    template.querySelector('h5').textContent = post.title;
    template.querySelector('p').textContent = post.description;
    // render article badge based on item's being public/private
    if (post.private) {
        template.querySelector('span').textContent = 'Exclusive';
        template.querySelector('span').classList.add('bg-danger');
    } else {
        template.querySelector('span').textContent = 'Public';
        template.querySelector('span').classList.add('bg-secondary');
    }

    // render only editor-related stuff
    if (isEditor()) {
        const parent = editBtn.closest('.blog-post');
        editBtn.hidden = false;
        // on edit button stuff
        editBtn.addEventListener('click', () => {
            // use content-editable mode to edit posts in place
            parent.querySelector('h5').contentEditable = 'plaintext-only';
            parent.querySelector('p').contentEditable = 'plaintext-only';
            // highlight field to give a hint that it's editable
            parent.querySelector('p').focus();
            // show save button (hidden by default)
            saveButton.hidden = false;
        });

        // on save button stuff
        saveButton.addEventListener('click', () => {
            parent.querySelector('h5').contentEditable = false;
            parent.querySelector('p').contentEditable = false;
            savePost(post._id, {
                title: parent.querySelector('h5').textContent,
                description: parent.querySelector('p').textContent,
            });
            // hide save button again
            saveButton.hidden = true;
        });
    }
    return template;
};

// render posts
const appendPosts = (data) => {
    if (!data.length) {
        return;
    }

    // for further re-renders clear content
    postsContainer.innerHTML = '';

    const fragment = new DocumentFragment();
    data.forEach((post) => {
        fragment.append(preparePost(post));
    });

    postsContainer.append(fragment);
};

const subscriptionsSelect = document.querySelector('#subscriptions-select');
const subscribeBtn = document.querySelector('#subscribe-btn');

const appendSelectOptions = (data = []) => {
    // clear markup for re-render
    subscriptionsSelect.innerHTML = '';

    // create default select option
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select exclusive article';
    subscriptionsSelect.append(defaultOption);

    // append options with private articles
    data.forEach((item) => {
        const option = document.createElement('option');
        option.value = item._id;
        option.textContent = item.title;

        subscriptionsSelect.append(option);
    });

    // enable button if articles array not empty
    if (data.length) {
        subscribeBtn.disabled = false;
    }
};

// on subscribe button click
subscribeBtn.addEventListener('click', () => {
    const articleId = subscriptionsSelect.value;

    // if nothing selected return
    if (!articleId) return;

    // backend API call
    fetch(`${BACKEND_URL}/subscribe/${articleId}`, {
        headers: authHeader()
    }).then(
        (res) => res.json()
    ).then(({data}) => {
        // re-render select contents and available posts
        if (data) {
            loadPrivatePostsForSubscription();
            loadPosts();
        }
    })
});

// load and render posts
export const loadPosts = () => {
    fetch(`${BACKEND_URL}/articles`, {
        headers: authHeader()
    }).then(
        (res) => res.json()
    ).then(({data}) => appendPosts(data))
};

// load private articles and append them to select
const loadPrivatePostsForSubscription = () => {
    if (!isAuthorized()) {
        return;
    }
    // badge hints depending on auth/editor state
    if (isEditor()) {
        authWarning.textContent = 'You already have editor access to this stuff';
    } else {
        authWarning.textContent = 'Choose from options below';
    }
    fetch(`${BACKEND_URL}/articles/private`, {
        headers: authHeader()
    }).then(
        (res) => res.json()
    ).then(({data}) => appendSelectOptions(data))
};


loadPosts();
loadPrivatePostsForSubscription();
