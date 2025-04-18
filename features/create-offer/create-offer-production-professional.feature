@createoffer @createofferproduction
Feature: Production Professional Create Offer to Producer
    As a production professional
    I want to create offer to the producer of the post I want 
    So that I can work on a project I am interested in

    Background:
        Given the "production professional" is logged in  
        And the production professional has a target post and "Send Offer"

    Scenario: Successfully create an offer to a producer
        Given the production professional fills out the offer details
        When "Send Offer" button is clicked
        Then ensure the system displays status message "Successful offer creation" 

    Scenario: Failed to create an offer to a producer with price option
        Given the production professional does not fill out the price
        When "Send Offer" button is clicked
        Then ensure the system sends a message failed that "Price more than 0".

        Given the production professional fill out the price as 0
        When "Send Offer" button is clicked
        Then ensure the system sends a message failed that "Price more than 0".

    Scenario: Failed to create an offer to a producer
        Given the production professional does not select role
        When "Send Offer" button is clicked
        Then ensure the system sends a message failed that "Please Select Production Professional Role".
        
        Given the production professional fill out description at most 20 characters
        When "Send Offer" button is clicked
        Then ensure the system sends a message failed that "Description must be at least 20 characters".

        Given the production professional fill out description more than 1000 characters
        When "Send Offer" button is clicked
        Then ensure the system sends a message failed that "Description must not exceed 1000 characters".