
# Salesforce Address Finder Component

Salesforce LWC component to update Billing address using UK postcode.

## Features

- Search possible addresses using postcode from UK.
- View and select any address from a dropdown.
- Update account Billing address with the selected one.

## Tech Stack

**Client:** Lightning Web Components

**Server:** Apex

## Tech Features

- LWC Toast notifications in case of error or success.
- Quick action modal LWC component to be used in record page.
- Update address fields using lightning/uiRecordApi.
- Address list obtained via callout from getaddress.io

## Deployment

To deploy the LWC functionality execute the createScratch.sh bash script from the project directory.

## Testing

After deployment proceed to create a new account and use the quick action "Update Address" to check the functionality.

## Authors

- [@Luis Núñez Rodríguez](https://www.linkedin.com/in/luisnunezrodriguez)

## Feedback

If you have any feedback or doubts, please reach me on:

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/luisnunezrodriguez/)
