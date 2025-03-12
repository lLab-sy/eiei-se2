@createofferproduction
Feature: Production Professional Create Offer to Producer
    As a production professional
    I want to create offer to the producer of the post I want 
    So that I can work on a project I am interested in

    Background:
        Given the production professional is logged in  
        And has target post

    Scenario: Successfully create an offer to a producer
        Given the production professional fills out the offer details
        When the production professional clicks create offer button
        Then ensure the system sends an offer to producer 

    Scenario: Failed to create an offer to a producer
        Given the production professional does not fill out the price
        When the production professional clicks create offer button
        Then ensure the system sends a message failed to create an offer with a production professional.