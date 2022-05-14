import {BACKEND_URL, authHeader} from "./utils.js";
import {loadPosts} from "./load-posts.js";

// save post after editing
export const savePost = (id, body) => {
    fetch(`${BACKEND_URL}/article/${id}`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(body),
    }).then((res) => res.json()).then((data) => {
        console.log(data);
    })
};

const postModal = document.querySelector('#post-modal');
const modalOverlay = document.querySelector('.modal-overlay');
const editorBtn = document.querySelector('#editor-btn');
const submitPostBtn = document.querySelector('#submit-post');

// close Editor's modal
const closeModal = () => {
    document.body.style.overflow = '';
    postModal.style.display = 'none';
    modalOverlay.classList.remove('overlay');
};

// show modal on Editor's button click
editorBtn.addEventListener('click', () => {
    document.body.style.overflow = 'hidden';
    postModal.style.display = 'block';
    modalOverlay.classList.add('overlay');
    postModal.querySelector('.btn-close').addEventListener('click', closeModal)
});

// create new post
submitPostBtn.addEventListener('click', () => {
    const title = postModal.querySelector('#title').value;
    const description = postModal.querySelector('#description').value;
    const isPrivate = postModal.querySelector('#private').checked;

    fetch(`${BACKEND_URL}/article`, {
        headers: authHeader(),
        method: 'POST',
        body: JSON.stringify({
            title,
            description,
            private: isPrivate
        })
    }).then(
        (res) => res.json()
    ).then((data) => {
        if (data) {
            closeModal();
            loadPosts();
        }
    })
});
