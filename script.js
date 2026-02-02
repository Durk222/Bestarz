// 1. Configuración de Supabase
const supabaseUrl = 'https://gughdghlphaqfqypidmr.supabase.co';
const supabaseKey = 'sb_publishable_a1AJQFRr3y-DTbIx41Z5sA_w0tuDyEM';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

const updateUI = async (user) => {
    const loginBtn = document.querySelector('.btn-green-login') || document.querySelector('.btn-logout');
    const userLink = document.querySelector('.nav-links li:last-child a');

    if (user) {
        // Cambiar a botón de SALIR (Blanco/Celeste)
        loginBtn.textContent = 'SALIR';
        loginBtn.className = 'btn-frutiger btn-logout'; // Cambiamos la clase verde por la blanca
        
        // Poner la foto de perfil en el icono de usuario
        if (user.user_metadata.avatar_url) {
            userLink.innerHTML = `<img src="${user.user_metadata.avatar_url}" class="user-avatar-nav" alt="Profile">`;
        }
        // 1. Intentar obtener el perfil del usuario
        let { data: profile } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        // 2. Si no existe (primer login), crearlo con 85 XP de regalo
        if (!profile) {
            const { data: newProfile } = await supabaseClient
                .from('profiles')
                .insert([{ id: user.id, xp: 85, level: 1 }])
                .select()
                .single();
            profile = newProfile;
        }

        // 3. Pintar la barra con los datos obtenidos
        updateXPBar(profile.xp, profile.level);
        
        window.history.replaceState({}, document.title, window.location.pathname);
    } else {
        // Resetear a ¡INGRESA! (Verde)
        if (loginBtn) {
            loginBtn.textContent = '¡INGRESA!';
            loginBtn.className = 'btn-frutiger btn-green-login';
        }
        userLink.innerHTML = `<i class="fa-solid fa-user"></i>`;

        updateXPBar(0, 1);
    }
};

// Configuración del sistema de niveles
const XP_BASE = 100; // Nivel 1 necesita 100 XP

const getXPRequired = (level) => {
    return Math.floor(XP_BASE * Math.pow(1.2, level - 1));
};

const updateXPBar = (currentXP, level) => {
    const nextLevelXP = getXPRequired(level);
    const percentage = (currentXP / nextLevelXP) * 100;
    
    // Animación de la barra
    gsap.to(".xp-progress", {
        width: `${percentage}%`,
        duration: 1.2,
        ease: "power2.out"
    });
    
    // Actualizar el número de nivel
    document.querySelector('.level-number').textContent = level;
};

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('.btn-green-login') || document.querySelector('.btn-logout');
    const modal = document.getElementById('auth-modal');
    const googleBtn = document.querySelector('.btn-auth-option:first-child');

    const checkSession = async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    updateUI(session?.user);
    };
    checkSession();

    loginBtn.addEventListener('click', async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session) {
        // Lógica para CERRAR SESIÓN
        await supabaseClient.auth.signOut();
        window.location.reload(); 
    } else {
        // TU LÓGICA ORIGINAL DE ABRIR MODAL (Mantenla aquí adentro)
        modal.style.display = 'flex';
        gsap.fromTo(".modal-base-container", 
            { scale: 0.5, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
        );
    }
});

    // 2. Lógica de Google AUTH con Supabase
    googleBtn.addEventListener('click', async () => {
        // Efecto visual rápido al hacer clic
        gsap.to(googleBtn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

        console.log("Iniciando sesión con Google en Supabase...");
        
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://durk222.github.io/Bestarz/',
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
