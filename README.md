

# ezTravels

## Application Description
Our website ezTravels is a simple yet useful travel planner with a variety of uses.  Through this application, the user can search for various flights and hotels for their trip and see their full itinerary in the planner tab. From the homepage, you can see popular destinations and filter search based on your preferences.  

## Contributors
- Zac Bailey
- Noah Pritchard
- Andrew Johnston
- Audra McDermott
- Hana Burroughs
- Joshua Sun
  
## Technology Stack

**Client:** EJS, JavaScript, CSS

**Server:** Node JS

**Deployment:** Azure, Docker

**Database:** Postgre SQL

**External APIs:** RapidAPi Priceline.com, Google maps

**Testing:** Mocha, Chai

**IDE**: VScode

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```
Navigate to the Project folder
```bash
  cd Software-Project-Team-6/Project
```
Ensure you have a rapidAPI Priceline.com key, can be aquired at https://rapidapi.com/tipsters/api/priceline-com-provider

To run this project, you will need to add the following environment variables to your .env file

### database credentials

POSTGRES_USER="postgres"

POSTGRES_PASSWORD="pwd"

POSTGRES_DB="users_db"

Priceline_API_Key= `API_KEY`

Start the server
```bash
  docker compose up
```
Go to localhost:3000

## Prerequisites:
- Docker / Docker compose 
- Env file with API keys

## Running Tests

To run tests, run the following command

```bash
  docker compose up
```

## Link to deployed application

http://recitation-14-team-6.eastus.cloudapp.azure.com:3000

