# figo-to-ynab v 0.1
A tool that gets bank statements via the figo api and saves them in YNAB format

## Requirements: 
* Node
* Figo account & API access

### Figo set up
Go to Figo and set up an account. Connect your bank acocunts to Figo.
Get API access (email them or apply on some form somewhere)

### Create a YNAB CSV file

Clone this repository. In its root folder create a directory ```/reports```:

``` 
mkdir reports
```

Then run: 

```
npm install
```

In the file ```test/index.js``` you can set a from date by changing the ```moment("2016-03-30")``` to whatever date you like. 

Okay, we're now ready to produce the CSV

In your terminal, run:
```
API_KEY="[Figo API key]" API_SECRET="[Figo API secret]" USERNAME="[Figo username]" PASSWORD="[Figo password]" npm test
```

CSV is served in reports folder.
