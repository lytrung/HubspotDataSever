//this is a Node Express server
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const axios = require('axios')
const Utils = require('./utils') 
const _ = require('lodash');

const API_KEY = '4b6d25da-f327-475c-ae7e-8e0c0d6f8c35'
const hapikeyParam = `hapikey=${API_KEY}`

//setup express server
const app = express()
app.use(cors())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(logger('dev'))


//setup routes
var router = express.Router();

router.get('/testing', (req, res) => {
	res.send('<h1>Testing is working</h1>')
})

//get list of companies from Hubspot with relevant properties
router.get('/companies', (req, res) => {

    var companies = [];

    //recursive function to get list of companies from Hubspot
    function getData(offset){
        if (typeof offset == 'undefined') {
            offsetParam = null;
        } else {
            offsetParam = `offset=${offset}`;

            
        }

        const properties = ['client_company_location_id','name','client_parent_company_id','right_company_name']
        var propertiesString = 'properties='+properties.join('&properties=')
        const paramsString = `?${propertiesString}&${hapikeyParam}&${offsetParam}`;
        const url = `https://api.hubapi.com/companies/v2/companies/paged${paramsString}`
        
        console.log(url)
        
        return axios.get(url)
            .then(response =>{
                let data = response.data
                companies = companies.concat(data.companies)
                if(data['has-more']){
                    return getData(data['offset'])
                }else{
                    return res.json(Utils.cleanseCompaniesData(companies))
                }
                
            })
            .catch((error)=>{
                console.log(error)
                return res.json('Oops')
            })
    }
    getData()

})

//add new companies
router.post('/companies', (req, res) => {

    var url = 'https://api.hubapi.com/companies/v2/companies?'+hapikeyParam
    var data = req.body
    var properties = { 
        properties: [ 
            { name: 'name', value: data.company_name },
            { name: 'client_company_location_id', value: data.client_company_location_id} 
        ] 
    }

    axios.post(url,properties)
        .then(response=>res.json(response.data.companyId))
  
})

//add companies association
router.put('/associations', (req, res) => {

    var url = 'https://api.hubapi.com/crm-associations/v1/associations?'+hapikeyParam
    var data = req.body

    axios.put(url,data)
        .then(response=>res.json(response.data.companyId))

})




//use server to serve up routes
app.use('/', router)

// launch our backend into a port
const apiPort = 4000;
app.listen(apiPort, () => console.log('Listening on port '+apiPort));