# Guía de Deployment en Vercel

Esta guía te ayudará a desplegar tu aplicación en Vercel para compartirla remotamente con tus compañeros.

## Requisitos Previos

- Cuenta de GitHub (para conectar tu repositorio)
- Cuenta de Vercel (gratuita) - [Crear cuenta](https://vercel.com/signup)

## Pasos para Desplegar

### 1. Preparar tu Repositorio Git

Si aún no has inicializado git en tu proyecto:

```bash
git init
git add .
git commit -m "Initial commit"
```

Sube tu código a GitHub:
- Crea un nuevo repositorio en GitHub
- Sigue las instrucciones para hacer push de tu código

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Haz clic en **"Add New Project"**
3. Selecciona **"Import Git Repository"**
4. Autoriza a Vercel para acceder a tu cuenta de GitHub
5. Selecciona el repositorio de tu proyecto

### 3. Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto Vite. Verifica que la configuración sea:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Configurar Variables de Entorno

**IMPORTANTE**: Antes de hacer el deployment, debes configurar las variables de entorno:

1. En la página de configuración del proyecto, ve a **"Environment Variables"**
2. Agrega las siguientes variables:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | https://xyqfduobdxdqheuileor.supabase.co |
   | `VITE_SUPABASE_ANON_KEY` | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cWZkdW9iZHhkcWhldWlsZW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MzMxNzgsImV4cCI6MjA3NzEwOTE3OH0.76s3bs5JycHAVm8Z75Q5mzPvTvnvWu_3p_NnyJxLNoI |

   **Nota**: Estas variables deben estar disponibles en todos los entornos (Production, Preview, Development)

### 5. Realizar el Deployment

1. Haz clic en **"Deploy"**
2. Espera a que Vercel construya y despliegue tu aplicación (generalmente toma 1-2 minutos)
3. Una vez completado, recibirás una URL como: `https://tu-proyecto.vercel.app`

### 6. Verificar el Deployment

1. Abre la URL proporcionada
2. Verifica que la aplicación cargue correctamente
3. Prueba la navegación entre pantallas
4. Verifica que la conexión con Supabase funcione

### 7. Configurar Supabase (Opcional pero Recomendado)

Para mayor seguridad, agrega la URL de Vercel a la lista de URLs permitidas en Supabase:

1. Ve al dashboard de Supabase: https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **Settings** > **API**
4. En **"Site URL"**, agrega tu URL de Vercel
5. En **"Redirect URLs"**, agrega también tu URL de Vercel si usas autenticación

## Compartir con tus Compañeros

Una vez desplegado, simplemente comparte la URL de Vercel con tus compañeros:
```
https://tu-proyecto.vercel.app
```

## Actualizaciones Automáticas

Cada vez que hagas `git push` a tu repositorio:
- Vercel detectará los cambios automáticamente
- Construirá una nueva versión
- La desplegará automáticamente
- Tus compañeros verán la versión actualizada sin hacer nada

## Solución de Problemas

### La aplicación no carga
- Verifica que las variables de entorno estén configuradas correctamente
- Revisa los logs de deployment en el dashboard de Vercel

### Error de conexión con Supabase
- Verifica que las URLs de Supabase estén correctas en las variables de entorno
- Asegúrate de que las políticas RLS en Supabase permitan acceso anónimo donde sea necesario

### Las rutas no funcionan (404 en navegación)
- El archivo `vercel.json` ya está configurado para manejar el routing de SPA
- Si persiste el problema, verifica que el archivo esté en la raíz del proyecto

## Dominios Personalizados (Opcional)

Si quieres usar un dominio personalizado:
1. Ve a **Settings** > **Domains** en el dashboard de Vercel
2. Agrega tu dominio personalizado
3. Sigue las instrucciones para configurar los registros DNS

## Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Vite en Vercel](https://vercel.com/guides/deploying-vite-with-vercel)
- [Variables de Entorno en Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
