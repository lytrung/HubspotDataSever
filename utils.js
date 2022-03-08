//to cleanse Hubspot companies data to keep only relevant fields
const cleanseCompaniesData = (companies) =>{
    return companies.map(company =>{
        //  return company
        return {
            company_id: company.companyId,
            company_name: company.properties.name ? company.properties.name.value : null,
            client_company_location_id: company.properties.client_company_location_id ? parseInt(company.properties.client_company_location_id.value) : null,
            client_parent_company_id: company.properties.client_parent_company_id ? parseInt(company.properties.client_parent_company_id.value) : null,
            right_company_name: company.properties.client_parent_company_id ? company.properties.right_company_name.value : null,
        }
    })
}

module.exports = {cleanseCompaniesData }
