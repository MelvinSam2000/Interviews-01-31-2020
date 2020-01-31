import express from 'express';
import moment from 'moment';
import { DailyImage } from './nasa/daily-image';

const app = express();
app.use(express.json());
const port = 8002; // default port to listen

// define a route handler for the default home page
app.get( '/', async ( request: any, response: any ) => {
    response.send({});
} );

// Handle get requests to /nasa
app.get( '/daily', async ( request: any, response: any ) => {
    const daily = new DailyImage();
    // Sends in today's date as a formatted string
    const result = await daily.getImageForDate(moment().format('YYYY-MM-DD'));
    // Sends back the result of the image getter
    response.send(result);
} );

// Set up /timeline route 
app.get( '/timeline', async (request: any, response: any) => {

    const daily = new DailyImage();
    let output = []

    // parse dates string into multiple dates
    let dateString = request.query['dates']
    let parsedStr = dateString.replace(/['"]+/g, '')
    const dates = parsedStr.split(',')
    
    // fetch from nasa api
    for (let date of dates) {
        const result = await daily.imageGet(date)
        output.push(result)
    }

    // send list of results
    response.send(output)
});


// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );
