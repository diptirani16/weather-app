const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homePage = fs.readFileSync('index.html', 'utf-8');

const replaceVal = (tempVal, realVal) => {
    let replacedVal = tempVal.replace("{%temp%}", realVal.main.temp);
    replacedVal = replacedVal.replace("{%tempmin%}", realVal.main.temp_min);
    replacedVal = replacedVal.replace("{%tempmax%}", realVal.main.temp_max);
    replacedVal = replacedVal.replace("{%city%}", realVal.name);
    replacedVal = replacedVal.replace("{%country%}", realVal.sys.country);
    replacedVal = replacedVal.replace("{%tempstatus%}", realVal.weather[0].main);
    return replacedVal;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Katni&units=metric&appid=4ad3912f068ae6c9548678454a6731be")
            .on('data', (chunk) => {
                const objChunk = JSON.parse(chunk);
                const arrChunk = [objChunk];
                const realTimeData = arrChunk.map((val) => replaceVal(homePage, val)).join("");
                // console.log(arrChunk[0].weather);
                // console.log(realTimeData);
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
    else {
        res.end('FILE NOT FOUND');
    }
})

server.listen(3000, 'localhost');