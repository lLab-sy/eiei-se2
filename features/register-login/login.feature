@registerlogin @login
Feature: A User wants to register new account
    As a user
    I want to login to the system
    So that I can use application

    Background: The User is has previously registered with "testpd1" and has "testpd1@#T" as password
        Given I visit the home page
        And I visit "Login"
    @logininvalid
    Scenario: A user attempts to login with invalid details
        When I put "" into "Username" box
        And I put "testpd1@#T" into "Password" box
        And I login
        Then I should see "Username must contain at least 5 characters"
        And I should be on "Login Page"

        When I put "randomtestpd" into "Username" box
        And I put "randompd@#T" into "Password" box
        And I login
        Then I should be on "Login Page"

        When I put "testpd1" into "Username" box
        And I put "" into "Password" box
        And I login
        Then I should see "Password must contain at least 8 characters"
        And I should be on "Login Page"

        When I put "testpd1" into "Username" box
        And I put "random@#T" into "Password" box
        And I login
        And I should be on "Login Page"
    @loginvalid
    Scenario: A user attempts to login with valid details
        When I put "testpd1" into "Username" box
        And I put "testpd1@#T" into "Password" box
        And I login
        Then I should be on "Home Page"
        And I should see "You are a producer!"