// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.btn-green-login');
    const modal = document.getElementById('auth-modal');

    // Función para abrir el modal
    loginBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        
        // Animación de entrada con GSAP (Efecto "Pop" estilo Sims)
        gsap.fromTo(".modal-base-container", 
            { scale: 0.5, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        );
    });

    // Cerrar el modal al hacer click en el fondo (overlay)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            gsap.to(".modal-base-container", {
                scale: 0.8, 
                opacity: 0, 
                duration: 0.2, 
                onComplete: () => {
                    modal.style.display = 'none';
                }
            });
        }
    });
});
