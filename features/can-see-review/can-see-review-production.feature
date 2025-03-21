@review
Feature: Production Professional Can See Review on User Profile
    As a production professional
    I want to see user reviews
    So that I can see review from producer

    Background:
        Given the "production professional" is logged in
    
    Scenario: Production Professional wants to check rating score
        When I visit "Profile"
        Then I should see my review section
        And I should see at least one review
        And reviews should be displayed correctly