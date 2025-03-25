@manageoffer @manageofferpf
Feature: Production Professional Reject or Confirm offers from Producer
    As a production professionals
    I want to confirm offer from producer
    so that I can have work.

    As a production professional
    I want to reject offers
    so that I can be no longer interested some offer.

    Background:
        Given the "production professional" is logged in
        And I visit "My Offering"
        And choose a post to view offerings
        # And choose a post named "my new post action 2"

    @pfconfirmoffer
    Scenario: Production Professional confirms offer from Producer
        Given the production professional choose a "Pending" offer
        When the production professional confirms the offer
        Then the production professional's offer status is changed to "Completed"
    
    @pfrejectoffer
    Scenario: Production Professional rejects offer from Producer
        Given the production professional choose a "Pending" offer
        And the production professional rejects the offer
        Then the production professional's offer status is changed to "Rejected"
    
    @pfcounteroffer
    Scenario: Production Professional propose a counteroffer to the Producer
        When the production professional choose a "Pending" offer
        And the production professional wants to create a counteroffer
        Then the production professional should be redirected to "create-offer" page
    
    @pfconfirmselfoffer
    Scenario: Production Professional tries to confirm their own offer
        Given the production professional choose a "Pending" offer
        And the offer owner is the production professional
        When the production professional confirms the offer
        Then the production professional should not be able to confirm the offer