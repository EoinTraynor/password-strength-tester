# password-strength-tester

My application is designed for users to test the strength of their password, which in turn provides feedback to the user as a means to improve their password strength.
The application works by reading the password input field, which is then analyse,  determining a specific value (score, complexity) or whether or not it can be categorised (by containing: lowercase, uppercase, numbers, symbols, over eight characters). These statistics would then be sent to the database using AJAX with a lightweight API that I built using the PHP Slim framework.

## Configuration

* Clone the repository
* Define a local database (index.php)
* Run server and visit http://localhost:8888/PasswordStrengthTester/

## Technology Used

* Composer
* PHP
* Slim Framework
* Bootstrap
