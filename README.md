# masterdevops-modelo6-grupo2-threepoints
Inicialización del proyecto
Se desarrolló un pequeño script con el cual se puede automatizar la creación del repositorio y usuarios, así como también la asignación de permisos de estos usuarios sobre dicho repositorio.

Se debe parametrizar el archivo project.json con el nombre del repositorio y usuarios que tendrán acceso a dicho repositorio. Dentro de la carpeta se cuenta con un archivo project_sample.json como ejemplo.

Al ejecutar el comando npm start se crean todos los recursos sobre AWS y se generan archivos con el formato [user_name]-credentials.txt que contienen las credenciales de acceso de dichos usuarios.

Notas:
1.	Para poder ejecutar el script se debe:
  a.	Instalar previamente Node.js
  b.	Correr el comando npm install para descargar las dependencias que utiliza el script
  c.	Se debe cumplir con las especificaciones del archivo project.json
    -	El nombre debe ser obligatoriamente project.json
    -	Debe contener un parámetro repoName de tipo string
    -	Debe contener un parámetro users de tipo array de strings
2.	La carpeta contiene un archivo repo_policy.yml. Este archivo crea un stack con el recurso en AWS CodeCommit y la política con los permisos que tendrán los usuarios sobre el repositorio. Si se desea se pueden usar permisos más granulares modificando el parámetro PolicyDocument dentro de la plantilla.
