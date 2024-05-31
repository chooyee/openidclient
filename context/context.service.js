

class Context { 

    constructor () {   
        const dotenv = require('dotenv');
        const env = process.env.NODE_ENV;
        const result = dotenv.config({ path: `./.env_${env}` });
        //const result = dotenv.config({ path: `./.env_dev` });

        
        if (result.error) {
            console.log(result.error);
        }

        this.BasePath = process.env.BasePath;
        this.ExpressPort = process.env.PORT;
        this.Environment = process.env.environment;
        this.LogLevel = process.env.LogLevel;
        this.OICDCallbackURL = process.env.OICDCallbackURL;
        this.ClientId = process.env.clientId;
        this.ClientSecret = process.env.clientSecret;
    }
}

module.exports = new Context();
