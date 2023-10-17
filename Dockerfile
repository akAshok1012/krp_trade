FROM node:18 AS builder

RUN mkdir Demo

WORKDIR Demo

#WORKDIR /usr/local/app

COPY ./ /Demo

#COPY ./ /usr/local/app	

RUN npm install -g npm@9.6.7 && \
    npm install -g @angular/cli && \
    npm i --force  

# Build the Angular app
RUN ng build --configuration=production			

# ng build --configuration=production      	#--output-path= xylo-trade-manager-UI/dist

FROM nginx:latest
#COPY nginx.conf  /etc/nginx/conf.d/default.conf
COPY --from=builder Demo/dist /usr/share/nginx/html

EXPOSE 8081
CMD ["nginx","-g","daemon off;"]
