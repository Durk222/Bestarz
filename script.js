const loginBtn = document.querySelector('.btn-green-login');
const modal = document.getElementById('auth-modal');

loginBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Cerrar al hacer click fuera del modal
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});
