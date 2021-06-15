FROM node:latest
WORKDIR /frontend
COPY . .
RUN npm install --silent
RUN npm install react-scripts@0.9.5 -g --silent


EXPOSE 3000

#RUN npm run build
CMD npm start