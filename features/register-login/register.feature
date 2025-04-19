@registerlogin @register
Feature: A User wants to register new account
    As a user
    I want to register new account
    So that I have an account to use application

    Background:
        Given I visit the home page
        And I visit "Login"
        And I want to register
    @registerinvalid
    Scenario: An unregistered user attempts to register with invalid details
        When I put "testpd1" into "Username" box
        And I put "testpd1@#T" into "Password" box
        And I put "testpd1@#T" into "Confirm Password" box
        And I choose to register as a "Producer"
        And I click the "Register" button
        Then I should see "Sign Up Failed"
        And I should see "Username already exists."

        When I put "test" into "Username" box
        And I put "testpd3@#T" into "Password" box
        And I put "testpd3@#T" into "Confirm Password" box
        And I choose to register as a "Producer"
        And I click the "Register" button
        Then I should see "Username must contain at least 5 characters"

        When I put "111111111111111111111111111111111111111111111111111" into "Username" box
        And I put "testpd3@#T" into "Password" box
        And I put "testpd3@#T" into "Confirm Password" box
        And I choose to register as a "Producer"
        And I click the "Register" button
        Then I should see "Username must contain at most 50 characters"

        When I put "testpd3" into "Username" box
        And I put "eiei12!" into "Password" box
        And I put "eiei12!" into "Confirm Password" box
        And I choose to register as a "Producer"
        And I click the "Register" button
        Then I should see "Password must contain at least 8 characters"

        When I put "testpd3" into "Username" box
        And I put "eiei!eiei!eiei!eiei!eiei!eiei!eiei!eiei!eiei!eiei!" into "Password" box
        And I put "eiei!eiei!eiei!eiei!eiei!eiei!eiei!eiei!eiei!eiei!" into "Confirm Password" box
        And I choose to register as a "Producer"
        And I click the "Register" button
        Then I should see "Password must contain at most 20 characters"

        When I put "testpd3" into "Username" box
        And I put "testtest" into "Password" box
        And I put "testtest" into "Confirm Password" box
        And I choose to register as a "Producer"
        And I click the "Register" button
        Then I should see "Password should contain at least one special characters"

        When I put "testpd3" into "Username" box
        And I put "testpd3@#T" into "Password" box
        And I put "testp3@#T" into "Confirm Password" box
        And I choose to register as a "Producer"
        And I click the "Register" button
        Then I should see "Password do not match"
    @registervalid
    Scenario: An unregistered user registers with valid details
        When I put "testpd3" into "Username" box
        And I put "testpd3@#T" into "Password" box
        And I put "testpd3@#T" into "Confirm Password" box
        And I choose to register as a "Producer"
        And I click the "Register" button
        Then I should see "Sign Up Successful"

        When I want to login
        And I put "testpd3" into "Username" box
        And I put "testpd3@#T" into "Password" box
        And I login
        Then I should be on "Home Page"
        And I should see "You are a producer!"