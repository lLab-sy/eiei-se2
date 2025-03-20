@createoffer @createofferproducer
Feature: Producer Create Offer to Production Professional
    As a producer
    I want to create offer to production professionals I find suitable for the project 
    So that I can recruit production professional to work on my project

    Background:
        Given the "producer" is logged in
        And has a target production professional

    Scenario: Successfully create an offer to a production professional
        Given the producer has their own posts
            And the producer fills out the offer details
        When "Send Offer" button is clicked
        Then ensure the system displays status message "Successful offer creation" 

    Scenario: Failed to create an offer to a production professional
        Given the producer has their own posts
            And the producer does not fill out the price
        When "Send Offer" button is clicked
        Then ensure the system sends a message failed to create an offer with a production professional