# projet-alerte-vbg
Projet Alerte VBG en partenariat avec l'UNICEF
## Used Technologies and their references
[Kotlin](https://kotlinlang.org)
[Java]() 
[Spring Boot](https://spring.io/)
[Apache Maven](https://maven.apache.org/)
[Postgres](https://www.postgresql.org/)
[Nginx](https://nginx.org/en/)
[Angular](https://cli.angular.io/)


## Project's installation

First all install latest versions of docker & docker-compose :
https://www.docker.com/
https://docs.docker.com/compose/

1 - Clone the projet:
```sh
git clone git@github.com:ANDE-GUINEA/projet-alerte-vbg.git
```
2 - Change directory in your project, Download docker images and boot the app:
```sh
docker-compose build
```
3 - install the packages for the frontend 
```sh 
make npm-install
```
4 - Start the app 
```sh 
docker-compose up 
```

- Wait for docker to set up containers, then open in your browser [http://localhost:4000](http://localhost:400)  
Use the adress [http://localhost:8081](http://localhost:8081) for backend 