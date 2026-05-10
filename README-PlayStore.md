# Guía para Publicar ElenaMethod AI en Google Play Store

El proyecto ha sido configurado exitosamente con **Capacitor** para poder exportarse como una aplicación nativa de Android. A continuación, te detallo los siguientes pasos que debes realizar para empaquetar el `.aab` (Android App Bundle) y subirlo a la Play Store.

## 1. Requisitos de Imágenes (Assets)

La Play Store es estricta con los gráficos. Necesitas tener listos estos dos archivos:
- **Icono de la Aplicación**: Imagen en formato PNG de **512x512 píxeles**. (Debe tener un diseño limpio y moderno).
- **Gráfico de Funciones (Feature Graphic)**: Imagen en formato PNG o JPEG de **1024x500 píxeles**. (Este es el banner promocional que aparece en la Play Store).

> **Nota para los Iconos de la App (dentro del dispositivo):**
> Puedes reemplazar los iconos predeterminados de Android sobrescribiendo las imágenes en las carpetas dentro de `android/app/src/main/res/mipmap-*` con tu logo de `claudia.png` o usar la herramienta oficial de Capacitor `@capacitor/assets`.

## 2. Generar el Archivo .AAB (Android App Bundle)

El archivo `.aab` es el formato moderno que exige Google Play (reemplazó al antiguo `.apk`).

**Pasos:**
1. Abre **Android Studio**.
2. Selecciona **Open** (Abrir) y elige la carpeta `android/` que se acaba de crear dentro del directorio de este proyecto (`Elena Method AI/android`).
3. Espera a que Android Studio sincronice el proyecto y descargue las dependencias de Gradle.
4. En el menú superior de Android Studio, ve a **Build** > **Generate Signed Bundle / APK...**
5. Selecciona **Android App Bundle** y dale a Next.
6. En "Key store path", si no tienes una clave (Keystore), haz clic en **Create new...**
   - Elige una ruta segura en tu PC para guardar el archivo `.jks` (Key store).
   - Rellena las contraseñas, Alias (ej: `upload`), y tus datos de organización.
   - **¡GUARDA BIEN ESTAS CONTRASEÑAS Y EL ARCHIVO .JKS!** Sin ellos no podrás actualizar tu app en el futuro.
7. Selecciona tu clave recién creada, dale a **Next**.
8. Elige la variante **release** y haz clic en **Finish**.
9. Android Studio compilará el archivo. Al terminar, mostrará un mensaje flotante con la ubicación del archivo (usualmente en `android/app/release/app-release.aab`).

## 3. Configurar la Ficha de la Play Store (Google Play Console)

1. Ingresa a la [Google Play Console](https://play.google.com/console).
2. Crea una nueva aplicación (Nombre: "ElenaMethod AI").
3. Completa todos los campos obligatorios del panel de control:
   - **Contenido de la Aplicación**: Cuestionarios de privacidad, público objetivo, etc.
   - **Seguridad de los Datos**: Declara que solicitas correo y nombre para la funcionalidad de la app.
   - **Política de Privacidad**: Tendrás que alojar tu página web en un servidor (por ejemplo, en Firebase Hosting) y pegar el link de la URL que lleve a tu ruta `/privacy` (ej. `https://tu-dominio.com/privacy`).
   - **Términos y Condiciones**: Similar a lo anterior, provee el link hacia `/terms`.
   - **Ficha de la tienda**: Sube tus imágenes (512x512 y 1024x500) y redacta la descripción corta y larga.

## 4. Subir y Mandar a Revisión

1. Ve a la sección de **Producción**.
2. Crea una **Nueva Versión** (New Release).
3. Sube el archivo `.aab` que generaste en el paso 2.
4. Guarda y envía los cambios a revisión.
5. El equipo de Google puede tardar entre 2 a 7 días en aprobar tu app.

¡Éxito con el lanzamiento de ElenaMethod AI!
