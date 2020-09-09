# Testing

### Unit tests

### E2E tests

End-to-end testing for this project is done using Cypress.

#### Start page
E2E tests for the start page test that the page can be opened based on whether certain text can be found after trying to visit the front page url and that the login form shown on the front page works properly. The tests first check that all of the elements of the login form are visible. After that the tests make sure that a user can log in with a username that has been saved before and a matching password. Currently, this is confirmed by making sure that after entering the credentials and clicking the login-button, the log in text is no longer shown. It is also checked that a user cannot login using invalid credentials. At the moment, this is done by making sure that if invalid credentials are submitted using the login-button, the log in text is still displayed on the front page.
