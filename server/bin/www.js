import http from 'http'
import dotenv from 'dotenv'
import App from '../app'

dotenv.config()

const PORT = (process.env.PORT || 5000);

const server = http.createServer(App);

server.listen(PORT, (req, res, next) => {

    console.log(`Server Listen Port ${PORT}`);
})