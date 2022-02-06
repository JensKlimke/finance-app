# FinApp v1.0



## TODO

### General

* [x] General income, savings settings (to evaluate which amount is used per month from income) -> See transfers
* [x] calculations in inputs (for amounts) -> Change everywhere
* [x] Extrapolation/Prediction
* [ ] Messages as functions to react on content
* [x] Order of table cols in List
* [x] Delete logics for each REST API element when dependencies are given: 
  * Accounts belong to a user
  * Orders belong to an account
  * When a user is deleted, the corresponding accounts need to be deleted
  * When an order is deleted, the corresponding orders need to be deleted
* [x] Profile picture to be stored in user profile
* Remove user field from datasets on API platform (e.g. contract doesn't need to have a user field, when requested by the owner)
* [ ] Create an avatar API to get the image via e.g. https://finance.the3monkeys.io/avatar
* [ ] Lifecycle of AmountInput: If external change is done, the value is kept as input by user. There should be an update mechanism after saving the value.
* [ ] A definable order of the list elements should be loaded when hitting the page
* Language:
  * [ ] All hard-coded text to language object
  * [ ] German language support
* [ ] Import: allow imports with IDs
  * When ID is set, overwrite object in DB
  * When ID is not set, create new one
  * Sync with dates: if date is given take younger dataset
* [ ] Data dump and import via API (all elements in one call both direction)
* [ ] Integrity check to be shown on User Management site for admins (Is there data with is incorrectly linked to user or parent element)
* [ ] Data Management Segment all the same style (see money transfer)
* [ ] Demo/test data with test login
* [ ] Test all pages with no/incomplete data
* [ ] Replace avatar with default in auth menu
* [ ] Render version number by taking tag from release (via env var)

### Accounts

* [x] Show messages (or don't show tables), when no data is available for accounts, orders and balances
* [ ] Currency strings in tooltips and axis labels in plots
* [ ] Only save dates for orders and balances (with `mongoose-dateonly`?). Currently also time is stored, which makes no sense and makes the whole thing unhandy.
* [x] Bug: Account list doesn't update after import
* [ ] Set order of account (asc by name?)
* [ ] Scroll to last/current period in Assets table
* [ ] Sticky definition column in Assets table
* [ ] Set sign for different types of order automatically at saving
* [ ] Bar chart in plot is not working in production (compilation fails)
* [ ] When account is created, it is not selected automatically
* [ ] When a selected account is deleted, an error occurs because account is not available anymore
* [ ] Calculate annual return of invest on daily accuracy -> Model from literature?

### Prediction / Config

* [ ] percentage is currently saved as 10 for 10 %, but should be 0.1 instead
* [ ] export/import for config
* [ ] Setup multiple configurations with names (maybe accounts?) to have all saving accounts (like stocks, pension plan, etc.)

### Contracts

* [x] Bug: Statistics doesn't update after import
* [ ] Tags https://betterstack.dev/projects/react-tag-input/


### Auth and user

* [ ] Modal and feature to change password
* [ ] Feature to reset password
* [ ] Email confirmation when update email address

