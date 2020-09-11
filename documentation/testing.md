# Testing

### Unit tests

### E2E tests

End-to-end testing for this project is done using Cypress.

#### Start page
E2E tests for the start page test that the page can be opened based on whether certain text can be found after trying to visit the front page url and that the login form shown on the front page works properly. The tests first check that all of the elements of the login form are visible. After that the tests make sure that a user can log in with a username that has been saved before and a matching password. Currently, this is confirmed by making sure that after entering the credentials and clicking the login-button, the log in text is no longer shown. It is also checked that a user cannot login using invalid credentials. At the moment, this is done by making sure that if invalid credentials are submitted using the login-button, the log in text is still displayed on the front page.

#### Bacteria list
E2E tests for the list of bacteria test both the visibility of the list and the addition of new bacteria. The tests check that you can add a bacterium by finding and clicking the Lisää-button. Then the tests check that any added bacteria can be found on the list after being added. It is also tested that an existing bacterium can be deleted. This is done by finding the element containing the bacterium with a given name and clicking the Poista-button inside the same element. After this the code checks that the bactirium is no longer seen on the list.

#### Logout
The E2E tests test that there is the option to log out of the game. This is done by finding a button with the text 'Logout' and clicking it. After this it is checked that the instruction to log in has become visible. This is done to confirm that the login button has logged the user out of the game.
