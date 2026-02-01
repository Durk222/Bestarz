// 1. Configuración de Supabase
const supabaseUrl = 'https://gughdghlphaqfqypidmr.supabase.co';
const supabaseKey = 'sb_publishable_a1AJQFRr3y-DTbIx41Z5sA_w0tuDyEM';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.btn-green-login');
    const modal = document.getElementById('auth-modal');
    const googleBtn = document.querySelector('.btn-auth-option:first-child');

    // 1. Función para ABRIR el modal
    loginBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        
        gsap.fromTo(".modal-base-container", 
            { scale: 0.5, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        );
    });

    // 2. Lógica de Google AUTH con Supabase
    googleBtn.addEventListener('click', async () => {
        // Efecto visual rápido al hacer clic
        gsap.to(googleBtn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

        console.log("Iniciando sesión con Google en Supabase...");
        
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        });

        if (error) {
            console.error("Error al autenticar:", error.message);
        }
    });

    // 3. Cerrar el modal al hacer click en el fondo (overlay)
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
