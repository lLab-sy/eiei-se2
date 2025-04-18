@createoffer @createofferproducer
Feature: Producer Create Offer to Production Professional
    As a producer
    I want to create offer to production professionals I find suitable for the project 
    So that I can recruit production professional to work on my project

    Background:
        Given the "producer" is logged in
        And the producer has a target production professional for offer and "Send Offer"

    Scenario: Successfully create an offer to a production professional
        Given the producer has their own posts
            And the producer fills out the offer details
        When "Send Offer" button is clicked
        Then ensure the system displays status message "Successful offer creation" 

    Scenario: Failed to create an offer to a production professional
        Given the producer has their own posts
            And the producer does not select role
        When "Send Offer" button is clicked
        Then ensure the system sends a message failed that "Please Select Production Professional Role".

        Given the producer has their own posts
            And the producer fill description at most 20 characters
        When "Send Offer" button is clicked
        Then ensure the system sends a message failed that "Description must be at least 20 characters".

        Given the producer has their own posts
            And the producer fill description more than 1000 characters
        When "Send Offer" button is clicked
        Then ensure the system sends a message failed that "Description must not exceed 1000 characters".

        # Given the producer has their own posts
        #     And the producer does not select post
        # When "Send Offer" button is clicked
        # Then ensure the system sends a message failed to create an offer with a production professional
        
    Scenario: Failed to create an offer to a production professional with price option
        Given the producer has their own posts
            And the producer does not fill out the price
        When "Send Offer" button is clicked
        Then ensure the system sends a message failed that "Price more than 0".

        Given the producer has their own posts
            And the producer fill out the price as 0
        When "Send Offer" button is clicked
        Then ensure the system sends a message failed that "Price more than 0".




        