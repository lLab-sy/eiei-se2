Feature: Login Functionality

  Scenario: Successful login with correct credentials
    Given the producer is on the login page
    When the producer enters valid username and password
    And clicks the login button
    Then the producer should be redirected to the dashboard