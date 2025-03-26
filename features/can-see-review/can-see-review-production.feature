@review @reviewpf
Feature: Production Professional Can See Review on User Profile
    As a production professional
    I want to see user reviews
    So that I can see review from producer

    As a production professional
    I want to see producers' reviews
    So that I can make informed decisions about whether to work with them

    Background:
        Given the "production professional" is logged in
    
    @pfcheckself
    Scenario: Production Professional wants to check self rating score
        When I visit "Profile"
        Then "Production Professional" should see "their own" review section
        And I should see at least one review
        And the reviews should be displayed correctly
    
    @pfcheckpd
    Scenario: Production Professional wants to check a Producer's rating score
        When the production professional has a target post and "View Producer Profile"
        Then "Production Professional" should see "producer's" review section
        And I should see at least one review
        And the reviews should be displayed correctly