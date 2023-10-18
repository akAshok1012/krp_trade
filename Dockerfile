FROM node:18 AS builder

RUN mkdir Demo

WORKDIR Demo

#WORKDIR /usr/local/app

COPY ./ /Demo

#COPY ./ /usr/local/app	

RUN npm install -g npm@10.2.0 && \
    npm install -g @angular/cli && \
    npm i --force  

# Build the Angular app
RUN ng build --configuration=kubeTest		

# ng build --configuration=production      	#--output-path= xylo-trade-manager-UI/dist

FROM nginx:latest
#COPY nginx.conf  /etc/nginx/conf.d/default.conf
COPY --from=builder Demo/dist /usr/share/nginx/html

EXPOSE 6041
CMD ["nginx","-g","daemon off;"]
