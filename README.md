# Mis Tareas

Lista de tareas hecha para el Trabajo Práctico 2026.

- **Frontend:** React + Vite, con CSS plano (`/frontend`)
- **Backend:** Node.js + Express, API REST (`/backend`)
- **Base de datos y autenticación:** Supabase

## Funciones

- Registro e inicio de sesión con Supabase Auth
- Crear, ver, editar, completar y borrar tareas
- Prioridad (Alta, Media, Baja) y fecha de vencimiento
- Filtros por estado y por prioridad
- Cada usuario ve solo sus propias tareas

## Cómo correrlo en tu computadora

1. Copia `backend/.env.example` como `backend/.env` y completa los datos de Supabase.
2. Instala las dependencias:
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```
3. Arranca el backend (puerto 3000):
   ```bash
   npm run dev --prefix backend
   ```
4. En otra terminal, arranca el frontend (puerto 5173):
   ```bash
   npm run dev --prefix frontend
   ```
5. Abre http://localhost:5173

## Rutas de la API

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| POST | `/api/auth/register` | Crear cuenta |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/todos` | Ver mis tareas |
| POST | `/api/todos` | Crear tarea |
| PUT | `/api/todos/:id` | Editar o completar tarea |
| DELETE | `/api/todos/:id` | Borrar tarea |

Las rutas de tareas necesitan el token en el encabezado `Authorization: Bearer <token>`.

## Publicación (Render)

Se publica como un solo servicio web: Express sirve la API y la página de React ya compilada.

- **Build:** `npm run build`
- **Start:** `npm start`
- **Variables de entorno:** `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY`
