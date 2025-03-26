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

    @pdconfirmoffer
    Scenario: Producer confirms offer from Production Professional
        Given choose a post named "Post with Offer From PF to PD"
        And the producer choose a "Pending" offer
        When the producer confirms the offer
        Then the producer's offer status is changed to "Completed"
    
    @pdcounteroffer
    Scenario: Producer propose a counteroffer to the Production Professional
        Given choose a post named "Post with Offer From PF to PD 2"
        And the producer choose a "Pending" offer
        When the producer wants to create a counteroffer
        Then the producer should be redirected to "create-offer" page

    @pdrejectoffer
    Scenario: Producer rejects offer from Production Professional
        Given choose a post named "Post with Offer From PF to PD 2"
        And the producer choose a "Pending" offer
        When the producer rejects the offer
        Then the producer's offer status is changed to "Rejected"

    @pdconfirmselfoffer
    Scenario: Producer tries to confirm their own offer
        Given choose a post named "Post with Offer From PD to PF"
        And the producer choose a "Pending" offer
        And the offer owner is the producer
        When the producer confirms the offer
        Then the producer should not be able to confirm the offer