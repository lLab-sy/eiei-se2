@manageoffer @manageofferpd
Feature: Producer Reject or Confirm offers from Production Professional
    As a producer 
    I want to confirm offer from production professionals
    so that I can have new collaborator on the project I am working on.

    As a producer
    I want to reject offers
    so that I can be no longer interested some offer

    Background:
        Given the "producer" is logged in
        And I visit "My Offering"
        And choose a post to view offerings
        # And choose a post named "my new post action 2"

    @pdconfirmoffer
    Scenario: Producer confirms offer from Production Professional
        Given the producer choose a "Pending" offer
        When the producer confirms the offer
        Then the producer's offer status is changed to "Completed"
    
    @pdrejectoffer
    Scenario: Producer rejects offer from Production Professional
        Given the producer choose a "Pending" offer
        When the producer rejects the offer
        Then the producer's offer status is changed to "Rejected"

    @pdcounteroffer
    Scenario: Producer propose a counteroffer to the Producer
        Given the producer choose a "Pending" offer
        When the producer wants to create a counteroffer
        Then the producer should be redirected to "create-offer" page

    @pdconfirmselfoffer
    Scenario: Producer tries to confirm their own offer
        Given the producer choose a "Pending" offer
        And the offer owner is the producer
        When the producer confirms the offer
        Then the producer should not be able to confirm the offer