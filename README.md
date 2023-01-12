# FinApp 


## TODOs

### Structure
- [x] Topbar Nav as full page container, with "overflow-y: scroll"
- [x] Headers for Nav sections
- [ ] Align state management of forms (useReducer, see Register.page)

### New Features
- [ ] Steuerfreibeträge für Konten
- [ ] Sparziele
- [ ] Pension situation
- [ ] ...


### API
- [ ] Return {code: 200, object: {...}} from api when successful and handle code correctly
- [ ] Remove all unnecessary information from API -> Calculate in frontend
- [ ] Change log and historical data for entries
- [ ] Put reference in query and not in body of entry (e.g. order: account should be set as query parameter)
- [ ] When sub-data is loaded (e.g. orders for an account ID), set reference (account ID) in response on the level of page, results, ... 
  - {results: Array, page: 1, limit: 100, totalPages: 1, totalResults: 73, reference: 0abcdef...}
  - Can be used to check if the data contains to the right reference

### Authentication
- [x] check for renew in time interval (store expire date for that?)
- [x] User Management
- [ ] Password reset etc.
- [ ] Profile 
- [x] Only delete session cookie, when refresh token invalid
 
### Entries
- [ ] Make sortable and filterable
- [ ] Hard coded text to dictionary per entry page

#### Contracts
- [ ] Statistics of contract on hover (e.g. relative amount of the contract per month and per year) 
- [ ] Update statistics, when contract is updated 

### Transfers
- [ ] Restructure transfers code

### Assets
- [ ] Balances should be requestable by date and account
- [ ] Charts: Legend with jsx
- [ ] Charts: Tooltips with year etc.
