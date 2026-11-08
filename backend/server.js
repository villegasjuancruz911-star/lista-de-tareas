const path=require("path");
const fs=require("fs");
// Busca el .env dentro de /backend, sin importar desde qué carpeta se arranque
require("dotenv").config({ path: path.join(__dirname, ".env") });
const{createClient} = require("@supabase/supabase-js");

const express=require("express")
const supabase=createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY
);
const app=express();
// Render asigna el puerto en la variable PORT; en local usamos 3000
const PORT= process.env.PORT || 3000;

//permite que el servidor reciba datos en formato JSON.

app.use(express.json());


// MIDDLEWARE DE AUTENTICACIÓN
const authMiddleware = async (req, res, next) => {
    try {
        // 1. Obtener el token que envía el usuario
        const authHeader = req.headers.authorization;

        // 2. Comprobar que exista y tenga el formato Bearer
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                status: "error",
                message: "No se proporcionó un token de autenticación"
            });
        }

        // 3. Extraer el token
        const token = authHeader.split(" ")[1];

        // 4. Verificar el token con Supabase
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                status: "error",
                message: "Token inválido o expirado"
            });
        }

        // 5. Guardar los datos del usuario autenticado
        req.user = data.user;

        // 6. Crear un cliente de Supabase que actúe como ese usuario
        req.supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_PUBLISHABLE_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                },
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                }
            }
        );

        // 7. Permitir que la petición continúe
        next();

    } catch (error) {
        console.error("Error en autenticación:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Error interno de autenticación"
        });
    }
};


//ruta para comprobar el estado de la API

app.get("/api/health",(req,res)=>{
    res.json({
        status: "ok",
        messege: "El servidor esta funcando correctamente"
    })
});

app.get("/api/supabase-test", async (req, res) => {
    const {error} = await supabase
    .from("todos")
    .select("id")
    .limit(1);

    if (error) {
        console.error("Error al consultar Supabase:", error.message);
        return res.status(500).json({
            status: "error",
            message: "Error al consultar Supabase"
        });
    }
    
    res.json({
        status: "ok",
        message: "Conexión con Supabase exitosa"
    });
});

app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "El correo y la contraseña son obligatorios",
    });
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }

    return res.status(201).json({
      status: "ok",
      message: "Solicitud de registro procesada",
      user: data.user
        ? { id: data.user.id, email: data.user.email }
        : null,
      needsEmailConfirmation: !data.session,
    });
  } catch (error) {
    console.error("Error en registro:", error.message);

    return res.status(500).json({
      status: "error",
      message: "Error interno al registrar el usuario",
    });
  }
});

//Inicia el servidor

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "El email y la contraseña son obligatorios",
    });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        status: "error",
        message: error.message,
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "Inicio de sesión exitoso",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Ruta de prueba protegida por autenticación

app.get("/api/protected-test", authMiddleware, (req, res) => {
    res.json({
        status: "ok",
        message: "Acceso autorizado",
        user: {
            id: req.user.id,
            email: req.user.email
        }
    });
});


// ======================================
// CRUD DE TAREAS
// ======================================

// GET: Obtener las tareas del usuario autenticado

app.get("/api/todos", authMiddleware, async (req, res) => {
    try {
        const { data, error } = await req.supabase
            .from("todos")
            .select("*")
            .eq("user_id", req.user.id)
            .order("creacion", { ascending: false });

        if (error) {
            console.error("Error al obtener tareas:", error.message);

            return res.status(500).json({
                status: "error",
                message: "No se pudieron obtener las tareas"
            });
        }

        return res.status(200).json({
            status: "ok",
            message: "Tareas obtenidas correctamente",
            todos: data
        });

    } catch (error) {
        console.error("Error inesperado:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        });
    }
});


// POST: Crear una nueva tarea

app.post("/api/todos", authMiddleware, async (req, res) => {
    try {
        // Recibimos los datos enviados por el cliente
        const { titulo, descripcion, Prioridad, vencimiento } = req.body;

        // Comprobamos que el título no esté vacío
        if (!titulo || !titulo.trim()) {
            return res.status(400).json({
                status: "error",
                message: "El título de la tarea es obligatorio"
            });
        }

        // Comprobamos que la prioridad sea válida
        const prioridadesValidas = ["Baja", "Media", "Alta"];

        if (!prioridadesValidas.includes(Prioridad)) {
            return res.status(400).json({
                status: "error",
                message: "La prioridad debe ser Baja, Media o Alta"
            });
        }

        // Preparamos los datos que vamos a guardar
        const nuevaTarea = {
            titulo: titulo.trim(),
            descripcion: descripcion || "",
            Prioridad: Prioridad,
            vencimiento: vencimiento || null,
            completada: false,
            user_id: req.user.id
        };

        // Insertamos la tarea en Supabase
        const { data, error } = await req.supabase
            .from("todos")
            .insert([nuevaTarea])
            .select()
            .single();

        // Si Supabase devuelve un error, lo informamos
        if (error) {
            console.error("Error al crear tarea:", error.message);

            return res.status(500).json({
                status: "error",
                message: "No se pudo crear la tarea"
            });
        }

        // Respondemos con la tarea creada
        return res.status(201).json({
            status: "ok",
            message: "Tarea creada correctamente",
            todo: data
        });

    } catch (error) {
        console.error("Error inesperado al crear tarea:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        });
    }
});



app.put("/api/todos/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, Prioridad, vencimiento, completada } = req.body;

        const prioridadesValidas = ["Baja", "Media", "Alta"];

        // Validar que el ID sea un número válido
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                status: "error",
                message: "El ID de la tarea no es válido"
            });
        }

        // Validar el título si fue enviado
        if (titulo !== undefined && (!titulo.trim())) {
            return res.status(400).json({
                status: "error",
                message: "El título no puede estar vacío"
            });
        }

        // Validar la prioridad si fue enviada
        if (Prioridad !== undefined && !prioridadesValidas.includes(Prioridad)) {
            return res.status(400).json({
                status: "error",
                message: "La prioridad debe ser Baja, Media o Alta"
            });
        }

        // Preparar los datos que se van a modificar
        const cambios = {};

        if (titulo !== undefined) cambios.titulo = titulo.trim();
        if (descripcion !== undefined) cambios.descripcion = descripcion;
        if (Prioridad !== undefined) cambios.Prioridad = Prioridad;
        if (vencimiento !== undefined) cambios.vencimiento = vencimiento;
        if (completada !== undefined) cambios.completada = completada;

        if (Object.keys(cambios).length === 0) {
            return res.status(400).json({
                status: "error",
                message: "No se enviaron datos para modificar"
            });
        }

        // Buscar y modificar la tarea del usuario autenticado
        const { data, error } = await req.supabase
            .from("todos")
            .update(cambios)
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select()
            .single();

        if (error) {
            console.error("Error al modificar tarea:", error.message);

            return res.status(500).json({
                status: "error",
                message: "No se pudo modificar la tarea"
            });
        }

        return res.status(200).json({
            status: "ok",
            message: "Tarea modificada correctamente",
            todo: data
        });

    } catch (error) {
        console.error("Error inesperado al modificar tarea:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        });
    }
});

app.delete("/api/todos/:id", authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                status: "error",
                message: "El ID de la tarea no es válido"
            });
        }

        const { data, error } = await req.supabase
            .from("todos")
            .delete()
            .eq("id", id)
            .eq("user_id", req.user.id)
            .select()
            .single();

        if (error) {
            console.error("Error al eliminar tarea:", error.message);

            return res.status(500).json({
                status: "error",
                message: "No se pudo eliminar la tarea"
            });
        }

        return res.status(200).json({
            status: "ok",
            message: "Tarea eliminada correctamente",
            todo: data
        });

    } catch (error) {
        console.error("Error inesperado al eliminar tarea:", error.message);

        return res.status(500).json({
            status: "error",
            message: "Error interno del servidor"
        });
    }
});


// ======================================
// FRONTEND (React ya compilado)
// ======================================

// En producción el mismo servidor entrega la página de React (carpeta frontend/dist)
const frontendDist = path.join(__dirname, "..", "frontend", "dist");

if (fs.existsSync(frontendDist)) {
    app.use(express.static(frontendDist));

    // Cualquier ruta que no sea de la API devuelve la app de React
    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.join(frontendDist, "index.html"));
    });
} else {
    // En desarrollo el frontend corre aparte con Vite (npm run dev en /frontend)
    app.get("/", (req, res) => {
        res.send("¡El backend de lista de tareas está funcionando!");
    });
}

// Rutas de la API que no existen
app.use("/api", (req, res) => {
    res.status(404).json({
        status: "error",
        message: "Ruta no encontrada"
    });
});

console.log(
    "URL de Supabase cargada: ",
    Boolean(process.env.SUPABASE_URL)
);

console.log(
    "Clave publica cargada: ",
    Boolean(process.env.SUPABASE_PUBLISHABLE_KEY)
);

app.listen(PORT, ()=>{
    console.log(`Servidor iniciado en http://localhost:${PORT}`)
});
