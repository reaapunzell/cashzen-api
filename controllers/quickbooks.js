import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const tokenUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';

app.get("/", (req, res) => {
    res.send ("hello world");
})
// Redirect to QuickBooks for authorization
app.get('/authorize', (req, res) => {
    const authUri = `https://appcenter.intuit.com/connect/oauth2?client_id=${clientId}&scope=com.intuit.quickbooks.accounting&redirect_uri=${redirectUri}&response_type=code&state=someRandomState`;
    res.redirect(authUri);  // Redirect the user to the QuickBooks authorization page
});

// Handle the callback and exchange the authorization code for access tokens
app.get('/callback', async (req, res) => {
    const authCode = req.query.code;
    console.log(req.query.code);

    try {
        const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        
        // Exchange the authorization code for an access token and refresh token
        const response = await axios.post(tokenUrl, new URLSearchParams({
            code: authCode,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        }), {
            headers: {
                'Authorization': `Basic ${authHeader}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const { access_token, refresh_token } = response.data;

        // Save tokens in memory or database 
        req.session.access_token = access_token;
        req.session.refresh_token = refresh_token;

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error exchanging auth code for tokens:', error);
        res.status(500).send('Authentication failed');
    }
});

// Dashboard to test API access
app.get('/dashboard', async (req, res) => {
    const accessToken = req.session.access_token;

    if (!accessToken) {
        return res.status(401).send('Not authenticated');
    }

    try {
        // Make a request to the QuickBooks API
        const companyId = '9341453351463998';  // Replace with your company ID
        const apiUrl = `https://sandbox-quickbooks.api.intuit.com/v3/company/${companyId}/query?query=select * from Customer`;

        const quickbooksResponse = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        });

        // Return data to the dashboard
        res.json(quickbooksResponse.data);
    } catch (error) {
        console.error('Error making API request:', error);
        res.status(500).send('Failed to fetch data from QuickBooks');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(3000, () => console.log('Server running on port 3000'));
