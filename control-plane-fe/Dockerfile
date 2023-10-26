FROM --platform=linux/x86-64 node:14.16 as build-stage

RUN mkdir /app

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . /app

ENV NODE_OPTIONS=--max_old_space_size=2048
RUN npm run build 


FROM --platform=linux/x86-64 nginx:1.18

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]